import {
    captureException
} from '@sentry/browser';

import {
    META_ECOMMERCE_TYPE,
    ECOMMERCE_TYPE_ZYRO,
} from '@zyro-inc/site-modules/constants';
import {
    BLOCKS_ECOMMERCE
} from '@zyro-inc/site-modules/constants/ecommerce';
import {
    getIsLocaleWithEcommerce,
    getIsSiteWithEcommerce,
} from '@zyro-inc/site-modules/utils/getters/getIsLocaleWithEcommerce';
import {
    getStoreId
} from '@zyro-inc/site-modules/utils/getters/getStoreId';

import {
    getSettings,
    getStoreProducts,
    getVariantsQuantity,
    getCategories,
} from '@/api/EcommerceApi';
import {
    getMessagesByLocale
} from '@/i18n/setup';
import {
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';
import {
    patcher
} from '@/utils/jsondiffpatch';
import {
    getFilteredProductsByCategoryId
} from '@/utils/ecommerce';
import {
    removePage,
    removeBlock,
    removeElement,
} from '@/utils/siteDataUtils';
import {
    COLUMN_COUNT_2,
    productsPerPageByColumnCount,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';
// mutation type constants:
export const SET_STORE_PRODUCTS = 'SET_STORE_PRODUCTS';
export const SET_CATEGORIES = 'SET_CATEGORIES';
export const SET_VARIANTS_QUANTITY = 'SET_VARIANTS_QUANTITY';

export default {
    namespaced: true,
    state: {
        products: [],
        categories: [],
        variantsQuantity: [],
    },
    getters: {
        isStoreTypeZyro: (state, getters, rootState, rootGetters) => rootGetters
            .siteMeta[META_ECOMMERCE_TYPE] === ECOMMERCE_TYPE_ZYRO,
        isEcommerceAvailableForUsers: (state, getters, rootState, rootGetters) => !rootGetters['subscription/hasActiveEcommerceSubscription'],
        // need to update this place
        isLocaleWithEcommerceItems: (state, getters, rootState, rootGetters) => getIsLocaleWithEcommerce({
            blocks: rootGetters.siteBlocks,
            elements: rootGetters.siteElements,
        }),
        isSiteWithEcommerceItems: (state, getters, rootState) => getIsSiteWithEcommerce(rootState.website),
        isEcommerceAvailableForBusinessPlan: (state, getters, rootState, rootGetters) => (rootGetters['subscription/hasActiveBusinessSubscription'] && !rootGetters['ecwid/isLocaleWithEcwid']),
        showEcommerce: (state, getters) => getters.isStoreTypeZyro || getters.isEcommerceAvailableForBusinessPlan,
        isBlockInEcommerceProductPage: (state, getters, rootState, rootGetters) => (blockId) => Object.values(
            rootGetters.ecommerceProductPages,
        ).some(({
            blocks
        }) => blocks.includes(blockId)),
        isBlockSingleInEcommerceProductPage: (state, getters, rootState, rootGetters) => (blockId) => Object.values(
            rootGetters.ecommerceProductPages,
        ).some(({
            blocks
        }) => blocks.includes(blockId) && blocks.length === 1),
        isCartVisible: (state, getters, rootState, rootGetters) => rootGetters.headerBlock.settings.isCartVisible,
        products: (state, getters, rootState) => (rootState.currentLocale === rootState.website.meta.defaultLocale ? state.products : []),
        categories: (state, getters, rootState) => (
            rootState.currentLocale === rootState.website.meta.defaultLocale ? state.categories : []
        ),
    },
    mutations: {
        [SET_STORE_PRODUCTS](state, products) {
            state.products = products;
        },
        [SET_CATEGORIES](state, categories) {
            state.categories = categories;
        },
        [SET_VARIANTS_QUANTITY](state, variantsQuantity) {
            state.variantsQuantity = variantsQuantity;
        },
    },
    actions: {
        getSettings: async ({
            rootGetters,
            dispatch,
        }) => {
            const storeId = getStoreId(rootGetters.siteMeta);

            if (!storeId) {
                return;
            }

            try {
                const settings = await getSettings(storeId);
                const storeLanguage = settings.store_owner.language ? .toLowerCase();
                let messages = await getMessagesByLocale(storeLanguage);

                if (!messages ? .onlineStore) {
                    messages = await getMessagesByLocale('en');
                }

                dispatch('addEcommerceShoppingCart', {
                    translations: messages.onlineStore,
                    lang: storeLanguage,
                }, {
                    root: true,
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex ecommerce store',
                    message: 'Error while getting settings.',
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        getProducts: async ({
            getters,
            commit,
            dispatch,
            rootGetters,
        }, {
            resetUndoForPageCreation = true
        } = {}) => {
            const storeId = getStoreId(rootGetters.siteMeta);

            if (!storeId) {
                return;
            }

            try {
                const storeProducts = await getStoreProducts(storeId);

                commit(SET_STORE_PRODUCTS, storeProducts);

                // this is used for old blocks which stored variantId, instead of productId
                Object.keys(rootGetters.siteBlocks).forEach((key) => {
                    const block = rootGetters.siteBlocks[key];

                    if (block.type === 'BlockEcommerceProduct') {
                        const variantBasedProduct = storeProducts
                            .find((product) => product.variants.find((variant) => variant.id === block.product.id));

                        if (variantBasedProduct) {
                            dispatch('updateBlockData', {
                                blockId: key,
                                blockData: {
                                    ...block,
                                    product: {
                                        id: variantBasedProduct.id,
                                    },
                                },
                            }, {
                                root: true,
                            });
                        }
                    }

                    if (block.type === 'BlockEcommerceProductList') {
                        const filteredProducts = !block.productCategoryId ?
                            storeProducts.sort((a, b) => a.title.localeCompare(b.title)) :
                            getFilteredProductsByCategoryId(storeProducts, block.productCategoryId);

                        dispatch('updateBlockData', {
                            blockId: key,
                            blockData: {
                                ...block,
                                productIds: filteredProducts.map((product) => product.id),
                                productsPerPage: block.productsPerPage || productsPerPageByColumnCount[COLUMN_COUNT_2],
                            },
                        }, {
                            root: true,
                        });
                    }
                });

                if (!getters.isStoreTypeZyro) {
                    return;
                }

                dispatch('addEcommerceProductPages', {
                    resetUndo: resetUndoForPageCreation,
                }, {
                    root: true,
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex ecommerce store',
                    message: 'Error while getting store products.',
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        getVariantsQuantity: async ({
            commit,
            rootGetters,
            dispatch,
        }) => {
            const storeId = getStoreId(rootGetters.siteMeta);

            if (!storeId) {
                return;
            }

            try {
                const variantsQuantity = await getVariantsQuantity(storeId);

                commit(SET_VARIANTS_QUANTITY, variantsQuantity);
            } catch (error) {
                let sentryText = 'Fetching variants quantity';

                if (error.code === 'ECONNABORTED') {
                    sentryText = 'Fetching variants quantity: timeout';
                }

                captureException(new Error(sentryText));
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex ecommerce store',
                    message: 'Error while getting products quantity',
                }, {
                    root: true,
                });
            }
        },
        getCategories: async ({
            commit,
            dispatch,
            rootGetters,
        }) => {
            const storeId = getStoreId(rootGetters.siteMeta);

            if (!storeId) {
                return;
            }

            try {
                const categories = await getCategories(storeId);

                commit(SET_CATEGORIES, categories);
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'Vuex ecommerce store',
                    message: 'Error while getting categories.',
                }, {
                    root: true,
                });

                captureException(error);
            }
        },
        deleteEcommerceItemsFromSite: ({
            dispatch,
            rootState,
            rootGetters,
        }) => {
            let siteDataClone = patcher.clone(rootState.website);

            // firstly, deselect any selected block so the deletion would be smooth
            dispatch('updateCurrentBlockId', null, {
                root: true,
            });

            // then delete all the product pages together with their product blocks from default lang
            const productPageKeys = Object.keys(rootGetters.ecommerceProductPages);

            if (productPageKeys.length) {
                productPageKeys.forEach((pageId) => {
                    siteDataClone = removePage({
                        siteData: siteDataClone,
                        pageId,
                        locale: rootGetters.defaultLocale,
                    });
                });
            }

            // get ecommerce block and element info from the remaining pages
            Object.entries(siteDataClone.languages).forEach(([
                locale,
                {
                    blocks,
                    elements,
                },
            ]) => {
                const languageEcommerceBlockIds = Object.keys(blocks).filter(
                    (key) => BLOCKS_ECOMMERCE.includes(blocks[key] ? .type),
                );
                const languageEcommerceElementIds = Object.keys(elements).filter(
                    (key) => elements[key] ? .type === 'GridEcommerceButton',
                );

                languageEcommerceBlockIds.forEach((blockId) => {
                    siteDataClone = removeBlock({
                        siteData: siteDataClone,
                        blockId,
                        locale,
                    });
                });

                languageEcommerceElementIds.forEach((elementId) => {
                    siteDataClone = removeElement({
                        siteData: siteDataClone,
                        elementId,
                        locale,
                    });
                });
            });

            siteDataClone.meta[META_ECOMMERCE_TYPE] = null;

            // remove ecommerce shopping cart
            const {
                ecommerceShoppingCart,
                ...restData
            } = siteDataClone;

            dispatch('overwriteWebsiteData', {
                websiteData: {
                    ...restData,
                },
            }, {
                root: true,
            });
            dispatch('undoRedo/resetUndoRedo', null, {
                root: true,
            });
            dispatch('saving/saveWebsite', {}, {
                root: true,
            });
        },
    },
};