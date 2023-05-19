import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    PROPERTY_FONT_PRIMARY,
    PROPERTY_FONT_SECONDARY,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
    extractFontName
} from '@zyro-inc/site-modules/utils/font';
import {
    filterObject
} from '@zyro-inc/site-modules/utils/object';

import FONT_SETS from '@/assets/data/typography-styles-library.json';
import {
    TYPOGRAPHY_STYLE_REQUIRED_PROPERTIES,
    TYPOGRAPHY_STYLE_ELEMENTS,
} from '@/constants';
import {
    useUserStyles
} from '@/components/builder-drawers/drawers/partials/stylesDrawer/use/useUserStyles';
import BASE_TEMPLATE from '@/data/BaseTemplate.json';

const uneditedFontSets = cloneDeep(FONT_SETS);

// Shared state
const currentTypographyStyleLibrary = ref('');
const typographyStylesList = ref(FONT_SETS);
const uneditedTypographyStyleList = ref(uneditedFontSets);

export const useTypographyStylesLibrary = () => {
    const {
        currentTemplateUneditedStyles
    } = useUserStyles();
    const {
        getters,
        commit,
        dispatch,
    } = useStore();
    const currentTemplate = computed(() => getters.siteMeta.template);
    /**
     * If typographyStylesId is not set takes currentTemplate instead as it means
     * that no style has been selected yet and template id is the typographyStylesId
     */
    const typographyStylesId = computed(
        () => getters.siteMeta.typographyStylesId ? ? currentTemplate.value,
    );

    const updateStyleProperties = (styles) => {
        Object.entries(styles).forEach(([textElementKey, textElementValue]) => {
            commit('setStyleProperties', {
                element: textElementKey,
                value: textElementValue,
            });
        });
    };

    const addTypographyStylesToList = (title, textElementData) => {
        typographyStylesList.value.unshift({
            title,
            textElementData,
        });
    };

    const addTypographyStylesToUneditedList = (title, textElementData) => {
        uneditedTypographyStyleList.value.unshift({
            title,
            textElementData,
        });
    };

    const filterRequiredTypographyStyles = (styles) => {
        const pickedTypographyElements = filterObject(
            styles,
            ({
                key
            }) => TYPOGRAPHY_STYLE_ELEMENTS.includes(key),
        );

        return Object.fromEntries(
            Object.entries(pickedTypographyElements).map(([elementKey, element]) => {
                const newElement = filterObject(
                    element,
                    ({
                        key
                    }) => TYPOGRAPHY_STYLE_REQUIRED_PROPERTIES.includes(key),
                );

                return [
                    elementKey,
                    newElement,
                ];
            }),
        );
    };

    const websiteTypographyStyles = computed(() => filterRequiredTypographyStyles(getters.siteStyles));

    const currentUneditedTypographyStyles = computed(() => uneditedTypographyStyleList.value
        .find(({
            title
        }) => title === typographyStylesId.value) ? ? {});

    const isWebsiteTypographyStylesEdited = computed(
        () => {
            const pickedWebsitePropertiesForEvaluation = Object.fromEntries(
                Object.entries(websiteTypographyStyles.value).map(([elementKey, element]) => {
                    const newElement = filterObject(
                        element,
                        ({
                            key
                        }) => TYPOGRAPHY_STYLE_REQUIRED_PROPERTIES.includes(key),
                    );

                    return [
                        elementKey,
                        newElement,
                    ];
                }),
            );

            const pickedWebsiteUneditedPropertiesForEvaluation = Object.fromEntries(
                Object.entries(currentUneditedTypographyStyles.value.textElementData)
                .map(([elementKey, element]) => {
                    const newElement = filterObject(
                        element,
                        ({
                            key
                        }) => TYPOGRAPHY_STYLE_REQUIRED_PROPERTIES.includes(key),
                    );

                    return [
                        elementKey,
                        newElement,
                    ];
                }),
            );

            return !isEqual(pickedWebsitePropertiesForEvaluation, pickedWebsiteUneditedPropertiesForEvaluation);
        },
    );

    const setTypographyStylesLibrary = (title, textElementData) => {
        currentTypographyStyleLibrary.value = {
            title,
            textElementData,
        };
    };

    const setTypographySet = (title, textElementData) => {
        setTypographyStylesLibrary(title, textElementData);
        updateStyleProperties(textElementData);
    };

    const updateTypographyStylesLibrary = (title, textElementData, primaryFont, secondaryFont) => {
        setTypographySet(title, textElementData);

        commit('setWebsiteMeta', {
            key: 'typographyStylesId',
            value: title,
        });
        dispatch('fonts/UPDATE_FONT_STYLES', {
            family: extractFontName(primaryFont),
            type: PROPERTY_FONT_PRIMARY,
        });
        dispatch('fonts/UPDATE_FONT_STYLES', {
            family: extractFontName(secondaryFont),
            type: PROPERTY_FONT_SECONDARY,
        });
    };

    const resetSelectedStyleInList = () => {
        const typographySylesToResetIndex = typographyStylesList.value
            .findIndex(({
                title
            }) => title === typographyStylesId.value);

        typographyStylesList.value[typographySylesToResetIndex]
            .textElementData = currentUneditedTypographyStyles.value.textElementData;
    };

    const resetSelectedTypographyStyles = () => {
        updateStyleProperties(
            currentTypographyStyleLibrary.value.textElementData,
        );
    };

    const updateTypographyStyleListWithWebsiteStyles = () => {
        typographyStylesList.value = typographyStylesList.value
            .filter(({
                title
            }) => title !== currentTypographyStyleLibrary.value.title);
        addTypographyStylesToList(typographyStylesId.value, websiteTypographyStyles.value);
    };

    const filterOutExistingStyleInList = () => {
        typographyStylesList.value = typographyStylesList.value
            .filter(({
                title
            }) => title !== typographyStylesId.value);
    };

    const addTemplateTypographyStylesToList = () => {
        setTypographyStylesLibrary(
            typographyStylesId.value,
            websiteTypographyStyles.value,
        );

        filterOutExistingStyleInList();

        addTypographyStylesToList(typographyStylesId.value, websiteTypographyStyles.value);

        if (currentTemplateUneditedStyles.value) {
            const typographyElementsWithRequiredStyles = filterRequiredTypographyStyles(
                currentTemplateUneditedStyles.value,
            );

            if (currentTemplate.value !== typographyStylesId.value) {
                addTypographyStylesToList(currentTemplate.value, typographyElementsWithRequiredStyles);
            }

            addTypographyStylesToUneditedList(currentTemplate.value, typographyElementsWithRequiredStyles);
        } else {
            const {
                styles
            } = BASE_TEMPLATE;
            const typographyElementsWithRequiredStyles = filterRequiredTypographyStyles(styles);

            addTypographyStylesToUneditedList(typographyStylesId.value, typographyElementsWithRequiredStyles);
        }
    };

    return {
        resetSelectedTypographyStyles,
        updateTypographyStylesLibrary,
        addTemplateTypographyStylesToList,
        updateTypographyStyleListWithWebsiteStyles,
        resetSelectedStyleInList,
        filterOutExistingStyleInList,
        setTypographySet,
        typographyStylesId,
        isWebsiteTypographyStylesEdited,
        websiteTypographyStyles,
        currentTypographyStyleLibrary: computed(() => currentTypographyStyleLibrary.value),
        typographyStylesList: computed(() => typographyStylesList.value),
        uneditedTypographyStyleList: computed(() => uneditedTypographyStyleList.value),
    };
};