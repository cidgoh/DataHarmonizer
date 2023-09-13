import { 
    TemplateProxy,
    accessTemplate,
    buildTemplate,
    deepMerge,
    getNestedValue,
    accessFile,
    findBestLocaleMatch
} from '@/lib/utils/templates';

/* Example usage
template = await Template.create('canada_covid19')
template.schema.prefixes.linkml.prefix_prefix == 'linkml'
template.schema.default.prefixes.linkml.prefix_prefix == 'linkml'

template.schema.locales['default'].prefixes.linkml.prefix_prefix == 'linkml'

template.changeLocale('fr')  // will find first nearest match if only full countrycodes present
// template.changeLocale('fr-FR')
template.schema.prefixes.linkml.prefix_prefix == 'lènkml'

// support for picklist value/label distinction
template.schema.default.prefixes.linkml.prefix_prefix == 'linkml'
template.schema.locale.prefixes.linkml.prefix_prefix == 'lènkml' // TODO

template.schema.locales['fr-FR'].prefixes.linkml.prefix_prefix == 'linkml'

template.currentLocale() == 'fr-FR'

template.changeLocale('default')
template.schema.prefixes.linkml.prefix_prefix == 'linkml'
template.schema.default.prefixes.linkml.prefix_prefix == 'linkml'
*/

describe('TemplateProxy', () => {
    let proxy;

    // Assuming the existence of a function to mock the 'buildTemplate' function
    const mockBuildTemplate = (templateName) => {
        return {
            default: {
                name: 'default_name',
                description: 'default_description'
            },
            locales: {
                fr: {
                    name: 'french_name',
                    description: 'french_description'
                },
                "de-DE": {
                    name: 'deutsch_nam'
                },
            }
        };
    };

    beforeEach(async () => {
        // Mock the actual buildTemplate with our version
        global.buildTemplate = mockBuildTemplate; // or however you would mock in your setup
        proxy = await Template.create('test', 'en');
    });

    test('should return localized property if it exists', () => {
        expect(proxy.name).toBe('english_name');
    });

    test('should return default property if localized version doesn’t exist', () => {
        expect(proxy.description).toBe('default_description');
    });

    test('should switch to a new locale and return appropriate data', () => {
        proxy.changeLocale('fr');
        expect(proxy.name).toBe('french_name');
        expect(proxy.description).toBe('french_description');
    });

    test('should throw error for unsupported locale', () => {
        expect(() => proxy.changeLocale('es')).toThrow('Locale es is not supported by the template.');
    });

    // Additional tests can be based on other methods and functionalities of the TemplateProxy class
});

describe('deepMerge function', () => {
    it('should merge two objects deeply', () => {
        const defaultObj = {
            name: "John",
            address: {
                city: "New York",
                zip: "10001"
            }
        };
        const localizedObj = {
            address: {
                zip: "10002"
            }
        };
        const merged = deepMerge(defaultObj, localizedObj);
        expect(merged.name).toBe("John");
        expect(merged.address.city).toBe("New York");
        expect(merged.address.zip).toBe("10002");
    });
});

describe('getNestedValue function', () => {
    const data = {
        user: {
            address: {
                city: 'New York'
            }
        }
    };

    it('should return nested value', () => {
        expect(getNestedValue(data, 'user.address.city')).toBe('New York');
    });

    it('should return undefined for non-existent path', () => {
        expect(getNestedValue(data, 'user.age')).toBeUndefined();
    });
});

describe('accessFile function', () => {
    // Note: Testing this function requires filesystem operations which might be mocked.
    // For simplicity, we'll assume a generic success/failure case.
    it('should return data on successful import', async () => {
        const data = await accessFile('./mock-success-path');  // Adjust the path to a mock module.
        expect(data).not.toBeNull();
    });

    it('should return null on failed import', async () => {
        const data = await accessFile('./mock-failure-path');  // Adjust the path to a non-existent module.
        expect(data).toBeNull();
    });
});

describe('findBestLocaleMatch function', () => {
    it('should return the best matching locale', () => {
        const available = ['en-US', 'fr-FR', 'es-ES'];
        expect(findBestLocaleMatch(available, ['en-GB', 'fr-CA', 'es-AR'])).toBe('en-US');
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
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('accessTemplate', () => {
        it('should return the correct template if it exists', async () => {
            const mockTemplate = { name: 'template1' };
            jest.mock('@/web/templates/manifest.json', () => ({
                children: [mockTemplate]
            }));

            const result = await accessTemplate('template1');
            expect(result[0]).toBe('template1');
        });

        it('should return null if the template does not exist', async () => {
            const result = await accessTemplate('non-existent-template');
            expect(result).toBeNull();
        });
    });

    describe('buildTemplate', () => {
        it('should correctly build the template', async () => {
            // Here, the mock returns will depend on your actual data structures, 
            // so you will need to adjust the mocked return values accordingly.
            const mockTemplateName = 'template1';
            const mockTemplateData = [
                mockTemplateName, 
                [[{ key: 'mockSchema' }], [{ key: 'mockDocumentation' }]], 
                [['en-US', [{ key: 'mockEnUS' }], []]]
            ];

            jest.mock('./path-to-your-functions-file', () => ({
                accessTemplate: jest.fn().mockResolvedValue(mockTemplateData)
            }));

            const result = await buildTemplate(mockTemplateName);

            expect(result.name).toBe(mockTemplateName);
            expect(result.default.schema.key).toBe('mockSchema');
            expect(result.default.documentation.key).toBe('mockDocumentation');
            expect(result.locales['en-US'].schema.key).toBe('mockEnUS');
        });
    });
});