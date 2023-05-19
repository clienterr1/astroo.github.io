import * as Vuex from 'vuex';

import ecommerce from '@/store/ecommerce';

import {
    SYSTEM_LOCALE,
    LINK_TYPE_INTERNAL,
} from '@zyro-inc/site-modules/constants';

export const MUTATION_SET_PAGE_DATA = 'SET_PAGE';

export const storeConfig = {
    modules: {
        ecommerce,
    },
    state: {
        website: null,
        pageData: null,
    },
    getters: {
        pages: (state) => state.pageData.pages,
        blocks: (state) => state.pageData.blocks,
        elements: (state) => state.pageData.elements,
        nav: (state) => state.pageData.nav,
        homePageId: (state) => state.pageData.homePageId,
        isNavHidden: (state) => state.pageData.isNavHidden,
        cookieBannerAcceptText: (state) => state.pageData.cookieBannerAcceptText,
        cookieBannerDisclaimer: (state) => state.pageData.cookieBannerDisclaimer,
        cookieBannerDeclineText: (state) => state.pageData.cookieBannerDeclineText,
        meta: (state) => state.pageData.meta,
        metaTitle: (state) => state.pageData.metaTitle,
        forms: (state) => state.pageData.forms,
        styles: (state) => state.pageData.styles,
        domain: (state) => state.pageData.domain,
        siteId: (state) => state.pageData.siteId,
        ecommerceShoppingCart: (state) => state.pageData.ecommerceShoppingCart,
        blogCategories: (state) => state.pageData.blogCategories,
        languageSwitcherLanguages: (state) => state.pageData.languageSwitcherLanguages,
        currentPageId: (state) => state.pageData.currentPageId,
        currentPageData: (state, getters) => getters.pages[getters.currentPageId],
        currentLocale: (state) => state.pageData.currentLocale,
        languageKeys: (state) => state.pageData.languageKeys,
        ecwidPages: (state) => state.pageData.ecwidPages,
        getPagePathFromId: (_, getters) => ({
            pageId
        }) => {
            if (!getters.pages[pageId]) {
                return null;
            }

            const pageSlug = getters.pages[pageId].slug;

            if (getters.currentLocale === SYSTEM_LOCALE || getters.currentLocale === getters.meta.defaultLocale) {
                return getters.homePageId === pageId ? '/' : `/${pageSlug}`;
            }

            return getters.homePageId === pageId ? `/${getters.currentLocale}` : `/${getters.currentLocale}/${pageSlug}`;
        },
        getButtonHref: (_, getters) => ({
            isFormButton,
            linkedPageId,
            linkType,
            href,
        }) => {
            if (isFormButton) {
                return null;
            }

            // Maintenance mapper is required to clean up old website data
            // Where buttons with external links have linkType === 'internal'
            if (href) return href;

            if (linkType === LINK_TYPE_INTERNAL && linkedPageId) {
                return getters.getPagePathFromId({
                    pageId: linkedPageId,
                });
            }

            return href;
        },
    },
    actions: {},
    mutations: {
        setWebsite: (state, {
            website
        }) => {
            state.website = website;
        },
        [MUTATION_SET_PAGE_DATA]: (state, {
            pageData
        }) => {
            state.pageData = pageData;
        },
    },
};
export default Vuex.createStore(storeConfig);