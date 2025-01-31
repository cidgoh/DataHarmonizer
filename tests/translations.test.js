import { transformLangFirstSpec } from '@/lib/utils/i18n'; // Adjust the path

describe('transformLangFirstSpec', () => {
  it('should transform a source object into the correct format', () => {
    const source = {
      fr: {
        nav: {
          header: {
            greeting: 'bonjour',
          },
        },
      },
      en: {
        nav: {
          header: {
            greeting: 'hello',
          },
        },
      },
    };

    const expected = {
      nav: {
        header: {
          greeting: {
            en: 'hello',
            fr: 'bonjour',
          },
        },
      },
    };
    expect(transformLangFirstSpec(source)).toEqual(expected);
  });
});
