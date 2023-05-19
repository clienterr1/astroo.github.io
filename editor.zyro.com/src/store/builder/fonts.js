import {
    addBreadcrumb,
    captureException,
} from '@sentry/browser';
import {
    createNamespacedHelpers
} from 'vuex';

import {
    PROPERTY_FONT_PRIMARY,
    PROPERTY_FONT_SECONDARY,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
    constructMetaFont,
    convertWeightStringToNumber,
    filterAvailableFontWeightVariants,
    pickUsedFontWeights,
    websiteFontNames,
} from '@zyro-inc/site-modules/utils/font';

import {
    getGoogleFonts
} from '@/api/GoogleFontsApi';
import {
    FONTS_UNLISTED_GOOGLE_FONTS
} from '@/data';
import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';
import mostPopularGoogleFonts from '@/assets/data/mostPopularGoogleFonts.json';
import {
    addGoogleFontQueryLinks
} from '@/utils/injectableDomElements/addGoogleFontQueryLinks';

const AVAILABLE_FONT_WEIGHTS = [
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
];

// namespacing to use with `createNamespacedHelpers`
export const FONTS_NAMESPACE = 'fonts';

// action type constants:
export const UPDATE_FONT_STYLES = 'UPDATE_FONT_STYLES';
export const UPDATE_CURRENT_FONT_STYLES = 'UPDATE_CURRENT_FONT_STYLES';

// mutation type constants:
export const SET_LOADING_FONTS = 'SET_LOADING_FONTS';
export const SET_GOOGLE_FONTS = 'SET_GOOGLE_FONTS';
export const SET_FONT_STYLES = 'SET_FONT_STYLES';

export const {
    mapState: mapStateFonts
} = createNamespacedHelpers(FONTS_NAMESPACE);
export const {
    mapActions: mapActionsFonts
} = createNamespacedHelpers(FONTS_NAMESPACE);
export const {
    mapMutations: mapMutationsFonts
} = createNamespacedHelpers(FONTS_NAMESPACE);

export default {
    namespaced: true,
    state: {
        googleFonts: [],
        isLoadingFonts: false,
        fontStyles: {
            primary: {
                subsets: [],
                variants: [],
                family: '',
                category: '',
            },
            secondary: {
                subsets: [],
                variants: [],
                family: '',
                category: '',
            },
        },
    },
    getters: {
        getAvailableFontWeights(state) {
            const {
                fontStyles
            } = state;
            const primaryWeights = fontStyles[PROPERTY_FONT_PRIMARY].variants
                .filter((variant) => AVAILABLE_FONT_WEIGHTS.includes(convertWeightStringToNumber(variant)));
            const secondaryWeights = fontStyles[PROPERTY_FONT_SECONDARY].variants
                .filter((variant) => AVAILABLE_FONT_WEIGHTS.includes(convertWeightStringToNumber(variant)));

            return {
                [PROPERTY_FONT_PRIMARY]: primaryWeights,
                [PROPERTY_FONT_SECONDARY]: secondaryWeights,
            };
        },
        getUsedFontWeights(state, getters, rootState, rootGetters) {
            return pickUsedFontWeights(rootGetters.siteStyles);
        },
        getFontNames(state, getters, rootState, rootGetters) {
            return rootGetters.siteFonts && websiteFontNames(rootGetters.siteFonts);
        },
        getMetaFont(state, getters, rootState, rootGetters) {
            const shouldUseAllFontWeights =
                import.meta.env.DEV || rootGetters['user/isZyroUser'];

            if (!getters.getFontNames) {
                return null;
            }

            const fontNames = getters.getFontNames;
            const fontWeights = shouldUseAllFontWeights ?
                {
                    primary: AVAILABLE_FONT_WEIGHTS,
                    secondary: AVAILABLE_FONT_WEIGHTS,
                } :
                getters.getUsedFontWeights;

            return constructMetaFont(fontNames, fontWeights);
        },
    },
    mutations: {
        [SET_LOADING_FONTS]: (state, value) => {
            state.isLoadingFonts = value;
        },
        [SET_GOOGLE_FONTS]: (state, googleFonts) => {
            state.googleFonts = googleFonts;
        },
        [SET_FONT_STYLES]: (state, fontStyles) => {
            state.fontStyles = {
                ...state.fontStyles,
                ...fontStyles,
            };
        },
    },
    actions: {
        fetchGoogleFonts: async ({
            commit,
            dispatch,
            state,
            rootState,
        }) => {
            if (state.googleFonts.length > 0) {
                return;
            }

            commit(SET_LOADING_FONTS, true);

            try {
                const {
                    items
                } = rootState.isDemoMode ? mostPopularGoogleFonts : await getGoogleFonts();
                const googleFonts = items.map(({
                    family,
                    category,
                    variants,
                    subsets,
                    files,
                }) => ({
                    family,
                    category,
                    variants,
                    subsets,
                    files,
                }));
                const allFonts = [
                    ...googleFonts,
                    ...FONTS_UNLISTED_GOOGLE_FONTS,
                ].sort((a, b) => a.family.localeCompare(b.family));

                commit(SET_GOOGLE_FONTS, allFonts);
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex fonts store',
                    messageI18nKeyPath: 'builder.notifications.errorLoadingFonts',
                }, {
                    root: true,
                });

                captureException(error);
            } finally {
                commit(SET_LOADING_FONTS, false);
            }
        },
        [UPDATE_FONT_STYLES]: ({
            commit,
            state,
            getters,
        }, {
            family: passedFamily,
            type,
        }) => {
            const fontStyles = state.googleFonts.find(({
                family
            }) => family === passedFamily);

            commit(SET_FONT_STYLES, {
                [type]: {
                    ...fontStyles,
                    variants: filterAvailableFontWeightVariants(fontStyles.variants),
                },
            });

            addGoogleFontQueryLinks(getters.getMetaFont);
        },
        [UPDATE_CURRENT_FONT_STYLES]: ({
            commit,
            state,
            getters,
        }) => {
            const {
                googleFonts
            } = state;
            const fontNames = getters.getFontNames;

            if (!fontNames[PROPERTY_FONT_PRIMARY]) {
                addBreadcrumb({
                    category: 'DEBUG',
                    message: 'font-families',
                    data: {
                        families: fontNames,
                        totalFonts: googleFonts.length,
                    },
                });
            }

            const primaryFontStyles = googleFonts.find(({
                family
            }) => family === fontNames[PROPERTY_FONT_PRIMARY]);
            const secondaryFontStyles = googleFonts.find(({
                family
            }) => family === fontNames[PROPERTY_FONT_SECONDARY]);

            // Error handling for local development in playground without backend
            if (!primaryFontStyles && !secondaryFontStyles) return;

            commit(SET_FONT_STYLES, {
                primary: {
                    ...primaryFontStyles,
                    variants: filterAvailableFontWeightVariants(primaryFontStyles.variants),
                },
                secondary: {
                    ...secondaryFontStyles,
                    variants: filterAvailableFontWeightVariants(secondaryFontStyles.variants),
                },
            });
        },
    },
};