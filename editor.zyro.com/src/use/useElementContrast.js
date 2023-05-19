import {
    useStore
} from 'vuex';

import {
    ELEMENT_GRID_BUTTON_PRIMARY,
    ELEMENT_GRID_BUTTON_SECONDARY,
    PROPERTY_BACKGROUND_COLOR_NULL,
} from '@zyro-inc/site-modules/constants/globalStyles';

import {
    getColorType
} from '@/utils/getColorType';
import {
    getContrastColor as getContrastColorUtil
} from '@/utils/getContrastColor';
import {
    lightenDarkenColor
} from '@/utils/lightenDarkenColor';

const COLOR_TRANSPARENT = 'transparent';
const LIGHTER_COLOR_SHADE = 30;
const DARKER_COLOR_SHADE = -30;

export const useElementContrast = () => {
    const {
        styles
    } = useStore().state.website ? ? {};

    const getColorProperty = (element, colorType) => {
        const isElementButton = element === ELEMENT_GRID_BUTTON_PRIMARY || element === ELEMENT_GRID_BUTTON_SECONDARY;
        const color = styles ? .[element] ? .[colorType];
        const isBackgroundNull = styles ? .[element] ? .[PROPERTY_BACKGROUND_COLOR_NULL] === COLOR_TRANSPARENT;

        if (isElementButton && isBackgroundNull) {
            return getColorType(COLOR_TRANSPARENT);
        }

        if (color === COLOR_TRANSPARENT && isElementButton) {
            return getColorType(color);
        }

        return colorType;
    };

    const getContrastColor = (color) => getContrastColorUtil(color);

    const getElementContrast = (element, colorType) => {
        const color = styles ? .[element] ? .[getColorProperty(element, colorType)];

        return getContrastColor(color);
    };

    const getColorShade = (color, colorShade) => lightenDarkenColor(color, colorShade);

    const getLighterColorShade = (color) => getColorShade(color, LIGHTER_COLOR_SHADE);
    const getDarkerColorShade = (color) => getColorShade(color, DARKER_COLOR_SHADE);

    return {
        getElementContrast,
        getContrastColor,
        getLighterColorShade,
        getDarkerColorShade,
    };
};