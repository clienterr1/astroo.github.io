import {
    useStore
} from 'vuex';

export const useBuilderStyles = () => {
    const {
        getters
    } = useStore();

    /**
     * Handles returning style key based on current edit mode (mobile/desktop)
     * @param {string} key - style key
     * @param {boolean} hasMobileStyle - wether style has mobile value
     */
    const getStyleKey = (key, hasMobileStyle = true) => ((hasMobileStyle && getters['gui/isMobileMode']) ? `m-${key}` : key);

    /**
     * Handles returning style value based on current edit mode (mobile/desktop),
     * If mobile style is not found returns desktop style
     * @param {string} key - style key
     * @param {object} styleObject - style object (e.g. data.settings.styles)
     * @param {boolean} hasMobileStyle - wether style has mobile value
     */
    const getStyleValue = (key, styleObject, hasMobileStyle = true) => {
        const reactiveKey = getStyleKey(key, hasMobileStyle);

        return styleObject[reactiveKey] || styleObject[key];
    };

    return {
        getStyleValue,
        getStyleKey,
    };
};