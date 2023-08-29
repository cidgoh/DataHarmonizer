// TODO: bad way to reference the templates. use import for
TEMPLATE_ROOT = '../../web/templates'

function accessFolder(folder_path, files_only = false, recursion = 1) {
    return []
}

function accessTemplate(template_name, files_only = false, recursion = 1) {
    this.accessFolder(`${TEMPLATE_ROOT}/${template_name}`, files_only, recursion)
}

function parseLocaleTree(el) {
    locale_label = el[0]
    let locale_schema = []
    let locale_documentation = []
    this.accessFolder(`${TEMPLATE_ROOT}${template_name}/locales/${locale_label}`).forEach(el => {
        function parseTemplateTree(el) {}
        locale_schema.push()
        locale_documentation.push()
    })
    return [locale_label, [locale_schema, locale_documentation]]
}

function parseTemplateTree(el) {}


class Labels {
    
    template = {}
    
    constructor(schemas, documentation) {
        this.build(schemas, documentation)
        this.locale = locale
    }

    constructor(template) {
        this.buildTemplate(template)
    }
        
    loadSchema(schema) {}
    loadDocumentation(documentation) {}

    parseTemplateFolder(template_name) {

        let schema = []
        let documentation = []
        accessTemplate(template_name, files_only=true).forEach(el => {
            schema.push()
            documentation.push()
        })

        // TODO: add parsers, refactor to single tree parse method for recurisve parsing
        let locales = []
        // TODO: unify accessTemplate and locales accessors?
        accessTemplate(`${template_name}/locales`)
            .forEach(el => {
                [locale_label, [locale_schema, locale_documentation]] = parseLocaleTree(el)
                locales.push([locale_label, [locale_schema, locale_documentation]])
            })

        return [schema, documentation, locales]
    }

    makeLabels(schemas = [], documentation = []) {
        return {
            schema: schemas.reduce(this.loadSchema, {}),
            documentation: documentation.reduce(this.loadDocumentation, {})
        }
    }

    makeLocale(current_spec, locale_spec) {
        [locale_label, [schema, documentation]] = locale_spec
        return {
            [locale_label]: Object.assign(
                current_spec, 
                this.makeLabels(schema, documentation)
            )
        }
    }

    buildTemplate(template) {
        [schema, documentation, locales] = this.parseTemplateFolder(template)
        this.template[template]["default"] = {
            ...this.makeLabels(schema, documentation)
        }
        // NOTE: duplication in this merge strategy
        // Replacing with custom get/set strategy would reduce memory duplication
        // May be important in cases where schemas are used as column stores rather than field specifications
        for (let locale in locales) {
            this.template[template]["locale"] = {
                ...this.makeLocale(this.template[template]["default"], locale)
            }
        }
        return this
    }

}

class Template {

    locale = null
    template = {}

    constructor(template_name, locale_label = null) {
        this.template = Labels.buildTemplate(template_name).template
        this.setLocale(locale_label)
    }

    set setLocale(locale_label) {
        // Two possible failures:
        // - Not a valid locale label
        // - Not a known locale label for template
        // It is difficult to keep track of all known locale codes without adhering to a standard
        // In the end, what matters is how the template accepts locales
        // Standardizing locale labels should be job of template spec, not consumer to defend against
        if (locale_label == 'default') this.locale = null
        else if (this.template.locale[locale] !== undefined) this.locale = locale_label
        else throw Error('Locale not found in template!')
    }

    get locale() {
        if (this.locale == null) return 'default'
        else return this.locale
    }

    get schema() {
        if (this.locale == null) return this.template.default.schema 
        else return this.template.locale[locale].schema
    }

    get documentation() {
        if (this.locale == null) return this.template.default.documentation 
        else return this.template.locale[locale].documentation
    }
}