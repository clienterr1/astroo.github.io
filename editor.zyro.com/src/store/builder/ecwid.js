import {
    createNamespacedHelpers
} from 'vuex';

import {
    META_ECOMMERCE_TYPE,
    ECOMMERCE_TYPE_ECWID,
} from '@zyro-inc/site-modules/constants';

import {
    getStore
} from '@/api/EcwidApi';

// namespacing to use with `createNamespacedHelpers`
export const ECWID_NAMESPACE = 'ecwid';

// action type constants:
export const GET_STORE_MANAGER_URL = 'GET_STORE_MANAGER_URL';

// mutation type constants:
export const SET_STORE_MANAGER_URL = 'SET_STORE_MANAGER_URL';

/**
 * TODO: each namespacedHelper export should go to corresponding module state/action/mutation files
 */
export const {
    mapState: mapStateEcwid,
    mapGetters: mapGettersEcwid,
    mapActions: mapActionsEcwid,
} = createNamespacedHelpers(ECWID_NAMESPACE);

export default {
    namespaced: true,
    state: {
        storeId: null,
        storeManagerUrl: null,
    },
    getters: {
        isPageWithEcwid: (state, getters, rootState, rootGetters) => Object.keys(
            rootGetters.ecwidPages,
        ).includes(rootState.currentPageId),
        isLocaleWithEcwid: (state, getters, rootState, rootGetters) => Object.keys(rootGetters.ecwidPages).length > 0,
        isStoreTypeEcwid: (state, getters, rootState, rootGetters) => rootGetters
            .siteMeta[META_ECOMMERCE_TYPE] === ECOMMERCE_TYPE_ECWID,
    },
    mutations: {
        [SET_STORE_MANAGER_URL]: (state, storeManagerUrl) => {
            state.storeManagerUrl = storeManagerUrl;
        },
    },
    actions: {
        [GET_STORE_MANAGER_URL]: async ({
            commit,
            rootState,
        }, {
            language
        }) => {
            const {
                data
            } = await getStore(rootState.websiteId);

            if (data) {
                commit('setWebsiteMeta', {
                    key: 'ecwidStoreId',
                    value: data.storeId,
                }, {
                    root: true,
                });

                const storeUrl = new URL(data.storeUrl);

                storeUrl.searchParams.set('lang', language);
                commit(SET_STORE_MANAGER_URL, storeUrl);
            }
        },
    },
};