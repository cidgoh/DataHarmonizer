/* OcaToLinkml.js
 *
 * Convert an OCA (Overlay Capture Architecture) bundle JSON object to a
 * LinkML schema object suitable for YAML.stringify + loadSchemaYAML().
 *
 * Supports both the older "bundle" format and the newer "oca_package" format.
 * See: https://github.com/agrifooddatacanada/OCA_package_standard
 */

/**
 * Return true if the parsed JSON object looks like an OCA bundle.
 */
export function isOcaBundle(obj) {
  if (!obj || typeof obj !== 'object') return false;
  // Newer "oca_package" format: { type: "oca_package/...", oca_bundle: { bundle: ... } }
  if (typeof obj.type === 'string' && obj.type.split('/')[0] === 'oca_package') {
    return !!obj.oca_bundle?.bundle?.capture_base?.attributes;
  }
  // Older "bundle" format: { bundle: { capture_base: { attributes: {...} } } }
  return !!obj.bundle?.capture_base?.attributes;
}

/**
 * Convert an OCA bundle JSON object to a LinkML schema plain object.
 * The result can be serialised with YAML.stringify() and fed to loadSchemaYAML().
 */
export function ocaToLinkml(obj) {
  // ── Unpack oca_package wrapper if present ───────────────────────────────
  let bundle_obj;
  if (typeof obj.type === 'string' && obj.type.split('/')[0] === 'oca_package') {
    bundle_obj = obj.oca_bundle;
  } else {
    bundle_obj = obj;
  }

  const capture_base = bundle_obj.bundle.capture_base;
  const overlays     = bundle_obj.bundle.overlays || {};

  // ── Capture base ────────────────────────────────────────────────────────
  const attributes      = capture_base.attributes || {};
  const flagged_attrs   = new Set(capture_base.flagged_attributes || []);

  // ── Overlays ────────────────────────────────────────────────────────────
  const formats     = overlays.format?.attribute_formats || {};
  const cardinality = overlays.cardinality?.attr_cardinality || {};
  const conformance = overlays.conformance?.attribute_conformance || {};
  const entry_codes = overlays.entry_code?.attribute_entry_codes || {};

  // units
  let units = {};
  let metric_system = '';
  if (overlays.unit) {
    metric_system = overlays.unit.metric_system || '';
    units = overlays.unit.attribute_units || overlays.unit.attribute_unit || {};
  }

  // Language-specific overlays (meta, label, information, entry) may occur
  // once per language.  The first meta overlay's language is the primary
  // language; the other languages become extensions.locales translations.
  const meta_by_lang  = _byLanguage(overlays.meta);
  const label_by_lang = _byLanguage(overlays.label);
  const info_by_lang  = _byLanguage(overlays.information);
  const entry_by_lang = _byLanguage(overlays.entry);

  const meta_arr     = _asArray(overlays.meta);
  const primary_lang = meta_arr[0]?.language
    ?? _asArray(overlays.label)[0]?.language ?? null;
  // Pick the primary-language overlay, else the first one of that kind.
  const _primary = (by_lang, arr) => by_lang.get(primary_lang) ?? _asArray(arr)[0];

  // meta – derive schema name / title / description
  const primary_meta       = _primary(meta_by_lang, overlays.meta);
  const schema_title       = primary_meta?.name || 'UntitledSchema';
  const schema_description = primary_meta?.description?.trim() || '';
  const primary_locale     = primary_lang ? _localeLookup(primary_lang) : 'en';
  const schema_name = _toPascalCase(schema_title) || 'UntitledSchema';

  // labels (attribute titles), information (attribute descriptions) and
  // entry labels (picklist item titles) in the primary language.
  const labels       = _primary(label_by_lang, overlays.label)?.attribute_labels || {};
  const informations = _primary(info_by_lang, overlays.information)?.attribute_information || {};
  const entry_labels = _primary(entry_by_lang, overlays.entry)?.attribute_entries || {};

  // ── Build schema skeleton ────────────────────────────────────────────────
  const schema = {
    id:          `https://example.com/${schema_name}`,
    name:        schema_name,
    title:       schema_title,
    description: schema_description,
    version:     '0.0.1',
    in_language: primary_locale,
    imports:     ['linkml:types'],
    prefixes: {
      linkml: 'https://w3id.org/linkml/',
    },
    classes: {},
    slots:   {},
    enums:   {},
  };

  // The unit overlay's metric_system (e.g. "SI") qualifies all its units.
  if (metric_system) {
    schema.annotations = {
      metric_system: { tag: 'metric_system', value: metric_system },
    };
  }

  // ── Build schema slots ───────────────────────────────────────────────────
  // Each OCA attribute becomes a schema-level slot; the main class lists them
  // in its `slots`, so translations align at locales.<lang>.slots.<slot>.
  for (const [slot_name, oca_type] of Object.entries(attributes)) {
    const pattern     = formats[slot_name];
    const type_result = _mapOcaType(oca_type, pattern);
    const slot_def    = { name: slot_name };

    if (labels[slot_name])       slot_def.title       = labels[slot_name];
    if (informations[slot_name]) slot_def.description = informations[slot_name];

    // Range: prefer enum (entry_codes) over primitive type
    slot_def.range = entry_codes[slot_name] ? slot_name : type_result.range;

    // Multivalued from Array[T] type
    if (type_result.multivalued) slot_def.multivalued = true;

    // Cardinality overlay (may also set multivalued)
    if (cardinality[slot_name]) {
      const card = _parseCardinality(cardinality[slot_name]);
      if (card.multivalued)          slot_def.multivalued          = true;
      if (card.minimum_cardinality !== undefined)
                                     slot_def.minimum_cardinality  = card.minimum_cardinality;
      if (card.maximum_cardinality !== undefined)
                                     slot_def.maximum_cardinality  = card.maximum_cardinality;
    }

    // Conformance
    if      (conformance[slot_name] === 'M') slot_def.required    = true;
    else if (conformance[slot_name] === 'O') slot_def.recommended = true;

    // Pattern (only for non-enum slots)
    if (pattern && !entry_codes[slot_name]) slot_def.pattern = pattern;

    // Unit (stored as { ucum_code } for addSlotRecord to read slot_obj.unit?.ucum_code)
    if (units[slot_name]) slot_def.unit = { ucum_code: units[slot_name] };

    // Identifying factor (flagged / confidentiality-sensitive attribute)
    if (flagged_attrs.has(slot_name)) {
      slot_def.annotations = { identifying_factor: { value: 'True' } };
    }

    schema.slots[slot_name] = slot_def;
  }

  // ── Main class ───────────────────────────────────────────────────────────
  // slot_usage gives each slot its OCA order (rank) within the class, and is
  // what SchemaEditor shows as the class's "Table field (from schema)" rows.
  const slot_names = Object.keys(schema.slots);
  schema.classes[schema_name] = {
    name:        schema_name,
    title:       schema_title,
    description: schema_description,
    slots:       slot_names,
    slot_usage:  Object.fromEntries(
      slot_names.map((slot_name, i) => [slot_name, { name: slot_name, rank: i + 1 }])
    ),
  };

  // ── Container class (tree_root) ──────────────────────────────────────────
  schema.classes['Container'] = {
    name:       'Container',
    tree_root:  true,
    attributes: {
      [schema_name + 'Data']: {
        multivalued:     true,
        range:           schema_name,
        inlined_as_list: true,
      },
    },
  };

  // ── Enums ────────────────────────────────────────────────────────────────
  for (const [enum_name, codes] of Object.entries(entry_codes)) {
    const permissible_values = {};
    for (const code of codes) {
      const label = entry_labels[enum_name]?.[code];
      permissible_values[code] = label ? { title: label } : {};
    }
    schema.enums[enum_name] = {
      name:               enum_name,
      title:              enum_name,
      permissible_values,
    };
  }

  // ── Translations (extensions.locales) ────────────────────────────────────
  // Each non-primary language gets a partial schema that DataHarmonizer
  // deep-merges over the default schema when that locale is selected, using
  // the same paths as SchemaEditor's Translations form.
  const other_langs = new Set(
    [meta_by_lang, label_by_lang, info_by_lang, entry_by_lang]
      .flatMap((by_lang) => [...by_lang.keys()])
      .filter((lang) => lang !== primary_lang)
  );
  const locales = {};
  for (const lang of other_langs) {
    const locale = _buildLocale(lang, {
      schema, schema_name,
      meta:    meta_by_lang.get(lang),
      labels:  label_by_lang.get(lang)?.attribute_labels || {},
      infos:   info_by_lang.get(lang)?.attribute_information || {},
      entries: entry_by_lang.get(lang)?.attribute_entries || {},
    });
    if (locale) locales[locale.in_language] = locale;
  }
  if (Object.keys(locales).length > 0) {
    schema.extensions = { locales: { tag: 'locales', value: locales } };
  }

  return schema;
}

// ── Private helpers ──────────────────────────────────────────────────────────

/** Normalise a value that may be an array or a single object to an array. */
function _asArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/**
 * Index a language-specific overlay (or array of them) by its `language`.
 * The first overlay seen for a language wins.
 */
function _byLanguage(val) {
  const by_lang = new Map();
  for (const overlay of _asArray(val)) {
    if (overlay?.language && !by_lang.has(overlay.language)) {
      by_lang.set(overlay.language, overlay);
    }
  }
  return by_lang;
}

/**
 * Build one extensions.locales entry from a language's overlays:
 *   title, description                           ← meta overlay
 *   classes.<Class>.title / description          ← meta overlay
 *   slots.<slot>.title                           ← label overlay
 *   slots.<slot>.description                     ← information overlay
 *   enums.<Enum>.permissible_values.<code>.title ← entry overlay
 * Returns null if the language has no translated content.
 */
function _buildLocale(lang, { schema, schema_name, meta, labels, infos, entries }) {
  const slots = {};
  for (const slot_name of Object.keys(schema.slots)) {
    const slot = {};
    if (labels[slot_name]) slot.title       = labels[slot_name];
    if (infos[slot_name])  slot.description = infos[slot_name];
    if (Object.keys(slot).length) slots[slot_name] = slot;
  }

  const enums = {};
  for (const enum_name of Object.keys(schema.enums)) {
    const permissible_values = {};
    for (const [code, label] of Object.entries(entries[enum_name] || {})) {
      if (code in schema.enums[enum_name].permissible_values && label) {
        permissible_values[code] = { title: label };
      }
    }
    if (Object.keys(permissible_values).length) enums[enum_name] = { permissible_values };
  }

  const title       = meta?.name;
  const description = meta?.description?.trim();
  if (!title && !description && !Object.keys(slots).length && !Object.keys(enums).length) {
    return null;
  }

  const locale_code = _localeLookup(lang);
  const locale = {
    id:          schema.id,
    name:        schema.name,
    version:     schema.version,
    in_language: locale_code,
  };
  if (title)       locale.title       = title;
  if (description) locale.description = description;

  const cls = {};
  if (title)       cls.title       = title;
  if (description) cls.description = description;
  if (Object.keys(cls).length) locale.classes = { [schema_name]: cls };

  if (Object.keys(slots).length) locale.slots = slots;
  if (Object.keys(enums).length) locale.enums = enums;
  return locale;
}

/**
 * Map OCA 3-letter ISO 639-2 codes to 2-letter i18n codes where known.
 * Unknown codes are returned unchanged.
 */
function _localeLookup(lang) {
  const MAP = {
    eng: 'en', fra: 'fr', deu: 'de', spa: 'es', por: 'pt',
    ita: 'it', nld: 'nl', pol: 'pl', rus: 'ru', zho: 'zh',
    jpn: 'ja', kor: 'ko', ara: 'ar', hin: 'hi',
  };
  return MAP[lang] || lang;
}

/**
 * Convert an arbitrary string to PascalCase, keeping only alphanumeric chars.
 * e.g. "Chicken gut health" → "ChickenGutHealth"
 */
function _toPascalCase(str) {
  return str
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Map an OCA attribute type string to a LinkML range (and optional multivalued flag).
 * Handles Array[T] recursively.
 *
 * @param  {string}  oca_type  e.g. "Text", "Numeric", "Boolean", "Array[Text]"
 * @param  {string}  pattern   OCA format regex (used to sniff integer vs decimal)
 * @returns {{ range: string, multivalued?: true }}
 */
function _mapOcaType(oca_type, pattern) {
  // Array[T] → multivalued + inner type
  const array_match = oca_type.match(/^Array\[(.+)\]$/);
  if (array_match) {
    return { ..._mapOcaType(array_match[1], pattern), multivalued: true };
  }

  switch (oca_type) {
    case 'Text':
      return { range: 'string' };

    case 'Numeric':
      // Sniff integer: pattern consists of an optional minus, then [0-9]{n}
      if (pattern && /^-?\[0-9\]\{\d+\}$/.test(pattern)) {
        return { range: 'integer' };
      }
      return { range: 'decimal' };

    case 'Boolean':
      return { range: 'boolean' };

    case 'DateTime':
      return { range: 'datetime' };

    default:
      return { range: 'string' };
  }
}

/**
 * Parse an OCA cardinality string into cardinality fields.
 * Formats: "n", "n-", "-m", "n-m"
 *
 * @param  {string} card
 * @returns {{ minimum_cardinality?: number, maximum_cardinality?: number, multivalued?: true }}
 */
function _parseCardinality(card) {
  const result = {};
  if (!card) return result;

  if (card.includes('-')) {
    if (card[0] === '-') {
      // "-m": only maximum given
      const max = parseInt(card.slice(1), 10);
      if (!isNaN(max)) {
        result.maximum_cardinality = max;
        if (max > 1) result.multivalued = true;
      }
    } else if (card[card.length - 1] === '-') {
      // "n-": only minimum given, unbounded maximum
      const min = parseInt(card.slice(0, -1), 10);
      if (!isNaN(min)) {
        result.minimum_cardinality = min;
        result.multivalued = true;
      }
    } else {
      // "n-m": both given
      const [min_s, max_s] = card.split('-');
      const min = parseInt(min_s, 10);
      const max = parseInt(max_s, 10);
      if (!isNaN(min)) result.minimum_cardinality = min;
      if (!isNaN(max)) result.maximum_cardinality = max;
      if (!isNaN(max) && max > 1) result.multivalued = true;
    }
  } else {
    // "n": exact count
    const n = parseInt(card, 10);
    if (!isNaN(n)) {
      result.minimum_cardinality = n;
      result.maximum_cardinality = n;
      if (n > 1) result.multivalued = true;
    }
  }
  return result;
}
