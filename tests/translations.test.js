import { transformLangFirstSpec, transformStructFirstSpec } from '@/lib/utils/translations'; // Adjust the path

describe('transformLangFirstSpec', () => {
    it('should transform a source object into the correct format', () => {
        const source = {
            "fr": {
                 "nav": {
                      "header": {
                           "greeting": "bonjour"
                       }
                 }
            },
            "en": {
                 "nav": {
                      "header": {
                           "greeting": "hello"
                       }
                 }
            }
        };
        
        const expected = {
            nav: {
                header: {
                    greeting: {
                        en: "hello",
                        fr: "bonjour"
                    }
                }
            }
        };
        expect(transformLangFirstSpec(source)).toEqual(expected);
    });
});

describe('transformStructFirstSpec', () => {
    it('should transform an initialObject into the correct format', () => {
        const initialObject = {
            nav: {
                header: {
                    greeting: {
                        en: "hello",
                        fr: "bonjour"
                    }
                }
            }
        };
        
        const expected = {
            en: {
                nav: {
                    header: {
                        greeting: "hello"
                    }
                }
            },
            fr: {
                nav: {
                    header: {
                        greeting: "bonjour"
                    }
                }
            }
        };
        
        expect(transformStructFirstSpec(initialObject)).toEqual(expected);
    });
});

