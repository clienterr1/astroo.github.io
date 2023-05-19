import {
    FONT,
    PROPERTY_FONT_FAMILY,
    PROPERTY_FONT_PRIMARY,
    PROPERTY_FONT_SECONDARY,
    PROPERTY_FONT_WEIGHT,
    FONT_WEIGHT_ELEMENTS,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
    onlyUnique
} from '@zyro-inc/site-modules/utils/array/onlyUnique';
import {
    ELEMENT_DATA_ATTRIBUTE,
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_STRIPE_BUTTON,
    ELEMENT_TYPE_ECOMMERCE_BUTTON,
    ELEMENT_TYPE_FORM,
} from '@zyro-inc/site-modules/constants';
import {
    addElementToHead
} from '@zyro-inc/site-modules/utils/addDomElements';

const GRID_BUTTON_TYPES = [
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_STRIPE_BUTTON,
    ELEMENT_TYPE_ECOMMERCE_BUTTON,
];

const FONT_WEIGHTS_MAP = {
    normal: 400,
    bold: 700,
};

const AVAILABLE_GOOGLE_FONT_WEIGHTS = [
    '100',
    '100italic',
    '200italic',
    '200',
    '300italic',
    '300',
    'regular',
    'italic',
    '400',
    '400italic',
    '500',
    '500italic',
    '600',
    '600italic',
    '700',
    '700italic',
    '800',
    '800italic',
    '900',
    '900italic',
];

export const FONT_TYPE_CUSTOM = 'custom';
export const FONT_TYPE_GOOGLE = 'google';

// TODO remove after mapper is done
/**
 * Mapper is needed for this to remove, currently our legacy templates
 * have bold for 700 and normal for 400 font weights
 */
export const convertWeightStringToNumber = (fontWeight) => FONT_WEIGHTS_MAP[fontWeight] ||
    Number(fontWeight);

/**
 * @param fontName ''Prata', sans-serif'
 * @returns 'Prata' {String}
 */
export const extractFontName = (fontName) => fontName.split(',')[0].replace(/["']+/g, '');

export const constructFontForCSS = (family, fallback) => (family ? `'${family}', ${fallback}` : null);

export const transformFontTypeToVariable = (fontType) => `var(--${FONT}-${fontType})`;

export const replaceSpacesWithPlus = (fontName) => fontName.trim().replace(/ /g, '+');

/**
 * @param variable var(--font-primary) | var(--font-secondary)
 * @returns primary | secondary
 */
export const extractFontTypeFromVariable = (variable) => {
    const regex = new RegExp(`var\\(--${FONT}-|\\)`, 'g');

    return variable.replace(regex, '');
};

export const filterAvailableFontWeightVariants = (variants) => {
    const GOOGLE_FONT_WEIGHT_MAP = {
        regular: 400,
        italic: '400italic',
    };

    return variants
        .filter((variant) => AVAILABLE_GOOGLE_FONT_WEIGHTS.includes(variant))
        .map((variant) => {
            const defaultValue = Number(variant) || variant;

            return GOOGLE_FONT_WEIGHT_MAP[variant] || defaultValue;
        });
};

export const pickUsedFontWeights = (siteStyles) => {
    let usedFontWeights = {
        // We want to always load 400 weight, because many fonts don't have other weights
        primary: [400],
        secondary: [400],
    };

    FONT_WEIGHT_ELEMENTS.forEach((element) => {
        const fontType = extractFontTypeFromVariable(siteStyles[element][PROPERTY_FONT_FAMILY]);
        const fontWeight = convertWeightStringToNumber(siteStyles[element][PROPERTY_FONT_WEIGHT]);

        usedFontWeights = {
            ...usedFontWeights,
            [fontType]: [
                ...usedFontWeights[fontType],
                fontWeight,
            ],
        };
    });

    return {
        [PROPERTY_FONT_PRIMARY]: usedFontWeights[PROPERTY_FONT_PRIMARY].filter(onlyUnique).sort(),
        [PROPERTY_FONT_SECONDARY]: usedFontWeights[PROPERTY_FONT_SECONDARY].filter(onlyUnique).sort(),
    };
};

export const websiteFontNames = (websiteFonts) => ({
    [PROPERTY_FONT_PRIMARY]: extractFontName(websiteFonts[PROPERTY_FONT_PRIMARY]),
    [PROPERTY_FONT_SECONDARY]: extractFontName(websiteFonts[PROPERTY_FONT_SECONDARY]),
});

export const constructMetaFont = (fontNames, fontWeights) => Object.keys(fontNames).map((fontProperty) => ({
        name: replaceSpacesWithPlus(fontNames[fontProperty]),
        weights: fontWeights[fontProperty].join(';'),
    }))
    .filter(({
        weights
    }) => !!weights)
    .map((font) => `family=${font.name}:wght@${font.weights}`)
    .join('&');

export const constructFontHref = (styles) => {
    const usedFontWeights = pickUsedFontWeights(styles);
    const usedFontNames = websiteFontNames(styles.font);
    const fontsQuery = constructMetaFont(usedFontNames, usedFontWeights);

    return `https://fonts.googleapis.com/css2?${fontsQuery}&display=swap`;
};

export const constructFontFamilyKey = (fontFamily) => fontFamily.trim().replace(/ /g, '+'); // 'Open Sans' -> 'Open+Sans'

export const getValidFontObject = ({
    googleFonts,
    customFonts,
    fontFamily,
    fontWeight,
}) => {
    if (!googleFonts.length || !fontFamily) return null;
    const fontWeightString = fontWeight.toString();
    const customFont = customFonts.find((font) => font.family === fontFamily);

    if (customFont) {
        customFont.weights = [fontWeightString];

        return customFont;
    }

    const googleVariantEquivalent = fontWeightString === '400' ? 'regular' : fontWeightString;
    const isGoogleFont = googleFonts.some((font) => (font.family === fontFamily && font.variants.includes(googleVariantEquivalent)));

    if (isGoogleFont) {
        return {
            family: fontFamily,
            type: FONT_TYPE_GOOGLE,
            weights: [fontWeightString],
        };
    }

    return null;
};

export const getInlineFontsFromHtml = ({
    html,
    customFonts,
    googleFonts,
}) => {
    const allSiteInlineStyles = html.match(/style\s*=\s*"([^"]*)"/gm) || [];

    const siteFonts = allSiteInlineStyles.reduce((allFonts, inlineStyle) => {
        const fontFamily = inlineStyle.match(/font-family:.(.*?)[",;]/m) ? .[1]; // Pick second capture group: ['fontFamily: Roboto', 'Roboto']
        const fontWeight = inlineStyle.match(/font-weight:.(.*?)[";]/m) ? .[1] || '400';

        if (!fontFamily) {
            return allFonts;
        }

        const validFont = getValidFontObject({
            googleFonts,
            customFonts,
            fontFamily,
            fontWeight,
        });

        return [
            ...allFonts,
            validFont,
        ];
    }, []);

    // ! BUG: In test (font.spec.js), `fontFamily` for some occurrences is `null`, so .filter is added
    return siteFonts.filter((siteFont) => siteFont);
};

const getGridButtonFonts = ({
    languages,
    googleFonts,
    customFonts,
}) => {
    const allSiteElements = Object.values(languages).flatMap((language) => Object.values(language.elements));

    return allSiteElements
        .filter(({
            type,
            fontFamily,
        }) => (GRID_BUTTON_TYPES.includes(type) && fontFamily))
        .map(({
            fontFamily,
            fontWeight,
        }) => getValidFontObject({
            googleFonts,
            customFonts,
            fontFamily,
            fontWeight,
        }));
};

const getGridFormFonts = ({
    languages,
    googleFonts,
    customFonts,
}) => {
    const allSiteElements = Object.values(languages).flatMap((language) => Object.values(language.elements));

    return allSiteElements
        .filter(({
            type,
            submitButtonFontFamily,
            formFontFamily,
        }) => type === ELEMENT_TYPE_FORM && (submitButtonFontFamily || formFontFamily))
        .flatMap(({
            submitButtonFontFamily,
            submitButtonFontWeight,
            formFontFamily,
            formFontWeight,
        }) => ([
            ...(submitButtonFontFamily ? [
                getValidFontObject({
                    googleFonts,
                    customFonts,
                    fontFamily: submitButtonFontFamily,
                    fontWeight: submitButtonFontWeight,
                }),
            ] : []),
            ...(formFontFamily ? [
                getValidFontObject({
                    googleFonts,
                    customFonts,
                    fontFamily: formFontFamily,
                    fontWeight: formFontWeight,
                }),
            ] : []),
        ]));
};

const getHeaderFonts = ({
    languages,
    googleFonts,
    customFonts,
}) => Object.entries(languages).map(([, language]) => {
    const {
        fontFamily,
        fontWeight,
    } = language.blocks.header;

    return getValidFontObject({
        googleFonts,
        customFonts,
        fontFamily,
        fontWeight,
    });
});

export const getFontsList = ({
    siteData,
    html,
    customFonts,
    googleFonts,
}) => {
    const {
        styles
    } = siteData;

    const globalFontFamilies = websiteFontNames(styles.font);
    const globalFontWeights = pickUsedFontWeights(styles);
    const globalFonts = [{
            family: globalFontFamilies.primary,
            weights: globalFontWeights.primary,
            type: FONT_TYPE_GOOGLE,
        },
        {
            family: globalFontFamilies.secondary,
            weights: globalFontWeights.secondary,
            type: FONT_TYPE_GOOGLE,
        },
    ];

    const inlineFonts = getInlineFontsFromHtml({
        html,
        customFonts,
        googleFonts,
    });

    const gridButtonFonts = getGridButtonFonts({
        languages: siteData.languages,
        googleFonts,
        customFonts,
    });

    const gridFormFonts = getGridFormFonts({
        languages: siteData.languages,
        googleFonts,
        customFonts,
    });

    const headerFonts = getHeaderFonts({
        languages: siteData.languages,
        googleFonts,
        customFonts,
    });

    const allFonts = [
        ...globalFonts,
        ...inlineFonts,
        ...gridButtonFonts,
        ...gridFormFonts,
        ...headerFonts,
    ];

    return allFonts
        .filter((font) => font)
        .reduce((sumAllFonts, font) => {
            const fontIndex = sumAllFonts.findIndex(({
                family
            }) => family === font.family);

            if (fontIndex !== -1) {
                // eslint-disable-next-line no-param-reassign
                sumAllFonts[fontIndex].weights = [
                    ...new Set([
                        ...sumAllFonts[fontIndex].weights,
                        ...font.weights,
                    ]),
                ];

                return sumAllFonts;
            }

            return [
                ...sumAllFonts,
                font,
            ];
        }, []);
};

export const constructGoogleFontsHref = ({
    googleFonts,
    origin,
}) => {
    const fontsQuery = googleFonts
        .map(({
            family,
            weights,
        }) => `family=${constructFontFamilyKey(family)}:wght@${weights.sort((a, b) => a - b).join(';')}`)
        .join('&');

    return `${origin}/u1/google-fonts/font-faces?${fontsQuery}&display=swap`;
};

export const getCustomFontsFontFaces = ({
    customFonts,
    siteId,
}) => `
	${customFonts
		.map(({
			family,
			fileType,
		}) => `
@font - face {
    font - family: $ {
        decodeURI(family)
    };
    src: url('${import.meta.env.VITE_ASSETS_ORIGIN}/${siteId}/${family}.${fileType}') format('${fileType}');
    font - display: swap;
}
`).join('')}`;

export const addCustomFontsFontFaces = ({
    customFonts,
    siteId,
}) => {
    const styleTagContent = getCustomFontsFontFaces({
        customFonts,
        siteId,
    });

    const fontFaceStyleTag = {
        type: 'element',
        tagName: 'style',
        properties: {
            [ELEMENT_DATA_ATTRIBUTE]: 'custom-fonts',
        },
        children: [{
            type: 'text',
            value: styleTagContent,
        }, ],
    };

    addElementToHead(fontFaceStyleTag);
};