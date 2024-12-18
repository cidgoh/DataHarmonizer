import {
  // Template,
  // accessTemplate,
  // buildTemplate,
  findBestLocaleMatch,
} from '../lib/utils/templates';
import { deepMerge, getNestedValue } from '../lib/utils/objects';

/* Example usage
template = await Template.create('canada_covid19')
template.schema.prefixes.linkml.prefix_prefix == 'linkml'
template.schema.default.prefixes.linkml.prefix_prefix == 'linkml'

template.schema.locales['default'].prefixes.linkml.prefix_prefix == 'linkml'

template.updateLocale('fr')  // will find first nearest match if only full countrycodes present
// template.updateLocale('fr-FR')
template.schema.prefixes.linkml.prefix_prefix == 'lènkml'

// support for picklist value/label distinction
template.schema.default.prefixes.linkml.prefix_prefix == 'linkml'
template.schema.locale.prefixes.linkml.prefix_prefix == 'lènkml' // TODO

template.schema.locales['fr-FR'].prefixes.linkml.prefix_prefix == 'linkml'

template.currentLocale() == 'fr-FR'

template.updateLocale('default')
template.schema.prefixes.linkml.prefix_prefix == 'linkml'
template.schema.default.prefixes.linkml.prefix_prefix == 'linkml'
*/

describe('Template', () => {
  // let proxy;
  // beforeEach(async () => {
  //   /* eslint-disable */
  //   const overrides = {
  //     fetchFileImpl: jest.fn(async function (filePath) {
  //       try {
  //         //
  //         const response = Promise.resolve(require('../web/' + filePath));
  //         return response;
  //       } catch (error) {
  //         console.error(`Failed to load ${filePath}: ${error}`);
  //         throw error;
  //       }
  //     }),
  //   };
  //   /* eslint-enable */
  //   // initiate localized
  //   proxy = await Template.create('test', { locale: 'de', overrides });
  // });
  // test('should return localized property if it exists', () => {
  //   // proxy.updateLocale('de');
  //   expect(proxy.schema.name).toBe('TEST_de');
  //   expect(proxy.schema.name).toBe(proxy.localized.schema.name);
  // });
  // test('should return default property if localized version doesn’t exist', () => {
  //   expect(proxy.schema.description).toBe('default_description');
  // });
  // test('should switch to a new locale and return appropriate data', () => {
  //   proxy.updateLocale('fr');
  //   expect(proxy.schema.name).toBe('TEST_fr');
  //   expect(proxy.schema.name).toBe(proxy.localized.schema.name);
  //   expect(proxy.schema.description).toBe('french_description');
  // });
  // test('should return to the default locale when updating empty', () => {
  //   proxy.updateLocale();
  //   expect(proxy.schema.name).toBe('TEST');
  //   expect(proxy.schema.name).toBe(proxy.default.schema.name);
  //   expect(proxy.schema.description).toBe(proxy.default.schema.description);
  // });
  // test('should throw error for unsupported locale', () => {
  //   expect(() => proxy.updateLocale('es')).toThrow(
  //     'Locale es is not supported by the template.'
  //   );
  // });
  // Additional tests can be based on other methods and functionalities of the TemplateProxy class
});

describe('deepMerge function', () => {
  it('should merge two objects deeply', () => {
    const defaultObj = {
      name: 'John',
      address: {
        city: 'New York',
        zip: '10001',
      },
    };
    const localizedObj = {
      address: {
        zip: '10002',
      },
    };
    const merged = deepMerge(defaultObj, localizedObj);
    expect(merged.name).toBe('John');
    expect(merged.address.city).toBe('New York');
    expect(merged.address.zip).toBe('10002');
  });
});

describe('getNestedValue function', () => {
  const data = {
    user: {
      address: {
        city: 'New York',
      },
    },
  };

  it('should return nested value', () => {
    expect(getNestedValue(data, 'user.address.city')).toBe('New York');
  });

  it('should return undefined for non-existent path', () => {
    expect(getNestedValue(data, 'user.age')).toBeUndefined();
  });
});

describe('findBestLocaleMatch function', () => {
  it('should return the best matching locale', () => {
    const available = ['en-US', 'fr-FR', 'es-ES'];
    expect(findBestLocaleMatch(available, ['en-GB', 'fr-CA', 'es-AR'])).toBe(
      'en-US'
    );
    expect(findBestLocaleMatch(available, ['en'])).toBe('en-US');
  });

  it('should return null if no matching locale is found', () => {
    const available = ['en-US', 'fr-FR', 'es-ES'];
    expect(findBestLocaleMatch(available, ['de-DE'])).toBeNull();
  });
});

// Mocking the manifest data
jest.mock('@/web/templates/manifest.json');

describe('Template utilities', () => {
  // Reset all mocks after each test
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  describe('accessTemplate', () => {
    /* eslint-disable */
    const overrides = {
      fetchFileImpl: jest.fn(async function (filePath) {
        try {
          const response = Promise.resolve(require('../web/' + filePath));
          return response;
        } catch (error) {
          console.error(`Failed to load ${filePath}: ${error}`);
          throw error;
        }
      }),
    };
    /* eslint-enable */

    // it('should return the correct template if it exists', async () => {
    //   const mockTemplate = { name: 'template1' };
    //   jest.mock('@/web/templates/manifest.json', () => ({
    //     children: [mockTemplate],
    //   }));

    //   const result = await accessTemplate('test', overrides.fetchFileImpl);
    //   expect(result[0]).toBe('test');
    // });

    // it('should return null if the template does not exist', async () => {
    //   const result = await accessTemplate(
    //     'non-existent-template',
    //     overrides.fetchFileImpl
    //   );
    //   expect(result).toBeNull();
    // });
  });

  describe('buildTemplate', () => {
    // it('should correctly build the template', async () => {
    //   // Here, the mock returns will depend on your actual data structures,
    //   // so you will need to adjust the mocked return values accordingly.
    //   const mockTemplateName = 'template1';
    //   const mockTemplateData = [
    //     mockTemplateName,
    //     [[{ key: 'mockSchema' }], [{ key: 'mockDocumentation' }]],
    //     // Locale tree is pretty gnarly. need to slim down. which means simplifying manifest.json generation
    //     [[[], [[]], [['en-US', [[{ key: 'mockEnUS' }]], []]]]],
    //   ];
    //   jest.mock('@/lib/utils/templates', () => ({
    //     accessTemplate: jest.fn().mockResolvedValue(mockTemplateData),
    //   }));
    //   const result = await buildTemplate(mockTemplateData);
    //   expect(result.name).toBe(mockTemplateName);
    //   expect(result.default.schema.key).toBe('mockSchema');
    //   expect(result.default.documentation.key).toBe('mockDocumentation');
    //   expect(result.locales['en-US'].schema.key).toBe('mockEnUS');
    // });
  });
});
