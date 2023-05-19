import {
    objectToCssVariables
} from '@zyro-inc/site-modules/utils/objectToCssVariables';

export const getTemplateStylesCssVariables = ({
    templateStyles,
    websiteStyles,
}) => {
    // Overriding website styles with templates styles for font-size, font-weight and line-height
    // otherwise global styles breaks design of elements inside andBlockModal
    const websiteStylesKeysToOverride = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'body',
        'body-large',
        'body-small',
        'grid-button-primary',
        'grid-button-secondary',
    ];
    const overriddenWebsiteStyles = Object.fromEntries(websiteStylesKeysToOverride.map((styleKey) => [
        styleKey,
        {
            ...websiteStyles[styleKey],
            'font-size': templateStyles[styleKey]['font-size'],
            'font-weight': templateStyles[styleKey]['font-weight'],
            'm-font-weight': templateStyles[styleKey]['m-font-weight'],
            'line-height': templateStyles[styleKey]['line-height'],
        },

    ]));

    const updatedTemplateStyles = {
        ...websiteStyles,
        ...overriddenWebsiteStyles,
        font: {
            primary: templateStyles.font.primary,
            secondary: templateStyles.font.secondary,
        },
    };

    return objectToCssVariables(updatedTemplateStyles);
};