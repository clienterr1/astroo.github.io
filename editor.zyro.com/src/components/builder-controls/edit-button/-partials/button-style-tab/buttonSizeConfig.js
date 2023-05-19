import {
    PROPERTY_PADDING_X,
    PROPERTY_PADDING_Y,
    PROPERTY_FONT_SIZE,
    PROPERTY_M_PADDING_X,
    PROPERTY_M_PADDING_Y,
    PROPERTY_M_FONT_SIZE,
} from '@zyro-inc/site-modules/constants/globalStyles';

import {
    BUTTON_PROPERTY_SIZE_SMALL,
    BUTTON_PROPERTY_SIZE_MEDIUM,
    BUTTON_PROPERTY_SIZE_LARGE,
} from '@/constants';

const SIZE_TO_STYLE_CONFIG_MAP = {
    [BUTTON_PROPERTY_SIZE_SMALL]: {
        padding: '14px 32px',
        paddingMobile: '14px 32px',
        fontSize: '14px',
        fontSizeMobile: '14px',
    },
    [BUTTON_PROPERTY_SIZE_MEDIUM]: {
        padding: '16px 34px',
        paddingMobile: '16px 34px',
        fontSize: '16px',
        fontSizeMobile: '16px',
    },
    [BUTTON_PROPERTY_SIZE_LARGE]: {
        padding: '18px 40px',
        paddingMobile: '18px 40px',
        fontSize: '16px',
        fontSizeMobile: '16px',
    },
};

export const getButtonSizes = (currentElementStyles, currentButtonType) => {
    const activePaddingX = currentElementStyles[`grid-button-${currentButtonType}-${PROPERTY_PADDING_X}`];
    const activePaddingY = currentElementStyles[`grid-button-${currentButtonType}-${PROPERTY_PADDING_Y}`];
    const activeFontSize = currentElementStyles[`grid-button-${currentButtonType}-${PROPERTY_FONT_SIZE}`];
    const activePaddingMobileX = currentElementStyles[`grid-button-${currentButtonType}-${PROPERTY_M_PADDING_X}`];
    const activePaddingMobileY = currentElementStyles[`grid-button-${currentButtonType}-${PROPERTY_M_PADDING_Y}`];
    const activeFontSizeMobile = currentElementStyles[`grid-button-${currentButtonType}-${PROPERTY_M_FONT_SIZE}`];

    const activeSizeConfig = Object.entries(SIZE_TO_STYLE_CONFIG_MAP)
        .find(([, styleProps]) => activePaddingX === styleProps.padding &&
            activePaddingY === styleProps.padding &&
            activePaddingMobileX === styleProps.paddingMobile &&
            activePaddingMobileY === styleProps.paddingMobile &&
            activeFontSizeMobile === styleProps.fontSizeMobile &&
            activeFontSize === styleProps.fontSize);

    return activeSizeConfig ? activeSizeConfig[0] : null;
};

export const finalButtonSizesObject = (newSize, currentButtonType) => {
    const targetConfig = SIZE_TO_STYLE_CONFIG_MAP[newSize];

    return {
        [`grid-button-${currentButtonType}-${PROPERTY_PADDING_Y}`]: targetConfig ? .padding || null,
        [`grid-button-${currentButtonType}-${PROPERTY_PADDING_X}`]: targetConfig ? .padding || null,
        [`grid-button-${currentButtonType}-${PROPERTY_FONT_SIZE}`]: targetConfig ? .fontSize || null,
        [`grid-button-${currentButtonType}-${PROPERTY_M_PADDING_Y}`]: targetConfig ? .paddingMobile || null,
        [`grid-button-${currentButtonType}-${PROPERTY_M_PADDING_X}`]: targetConfig ? .paddingMobile || null,
        [`grid-button-${currentButtonType}-${PROPERTY_M_FONT_SIZE}`]: targetConfig ? .fontSizeMobile || null,
    };
};