import {
    ResizeObserver as ResizeObserverPolyfill
} from '@juggle/resize-observer';
import * as Vue from 'vue';

import {
    addDocumentElements
} from '@/utils/addDocumentElements';
import {
    addElementToHead
} from '@zyro-inc/site-modules/utils/addDomElements';

import {
    UPDATE_SITE_DATA,
    ADD_DOCUMENT_ELEMENTS,
    NAVIGATE_TO_PATH,
    SCROLL_TO_TOP,
    SET_AI_BUILDER_COLORS,
} from '@zyro-inc/site-modules/constants/messageEvents';
import {
    dataQADirective,
    QA_DIRECTIVE_NAME,
} from '@zyro-inc/site-modules/directives/dataQaDirective';

import '@/assets/scss/global.scss';
import App from '@/App.vue';
import {
    fetchSiteData
} from '@/utils/fetchSiteData';
import router from '@/router';
import store from '@/store';
import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';
import {
    getHeadData,
    getCanonicalUrlFromWindow,
} from '@/components/metas/getHeadData';
import {
    getPageIdFromPath
} from '@zyro-inc/site-modules/utils/page/getPageIdFromPath';
import {
    getPathParams
} from '@zyro-inc/site-modules/utils/page/getPathParams';
import {
    getCookie
} from '@zyro-inc/site-modules/utils/cookies';
import {
    getDomainWithoutWWWPrefix
} from '@zyro-inc/site-modules/utils/domainUtils';

if ('ResizeObserver' in window === false) {
    window.ResizeObserver = ResizeObserverPolyfill;
}

const addDocumentElementsByRoutePath = ({
    path,
    siteData,
}) => {
    const {
        meta,
        languages,
        domain,
        siteId,
    } = siteData;

    const currentPageId = getPageIdFromPath({
        siteData,
        path,
    });
    const currentLocale = getPathParams({
        path,
        languageKeys: Object.keys(languages),
        defaultLocale: meta.defaultLocale,
    }) ? .locale;
    const {
        pages,
        blocks,
        elements,
        metaTitle,
    } = languages[currentLocale];

    const currentPageData = pages[currentPageId] ? ? {};

    const headData = getHeadData({
        currentPageData,
        blocks,
        elements,
        meta,
        currentLocale,
        domain,
        canonicalUrl: getCanonicalUrlFromWindow({
            domain,
        }),
        siteId,
        languageMetaTitle: metaTitle,
    });

    const domainNameWithoutWww = getDomainWithoutWWWPrefix(window.location.hostname);
    const areCookiesAllowed = getCookie(`z-cookies-consent-${domainNameWithoutWww}`) !== '0';

    addDocumentElements({
        meta: siteData.meta,
        languageKeys: Object.keys(siteData.languages),
        headData,
        fonts: siteData.fonts,
        siteId: siteData.siteId,
        areCookiesAllowed,
    });
};

const app = Vue.createApp({
        mounted: () => {
            // 'site-engine-mount' custom event is used in prerender service
            // it notifies lambda that app is mounted and it could save the HTML output
            document.dispatchEvent(new Event('site-engine-mount'));
            // when all external dependencies are loaded, fire 'DOMContentLoaded', because some external scripts depend on it
            window.addEventListener('load', () => document.dispatchEvent(new Event('DOMContentLoaded')));
        },
        watch: {
            $route: {
                handler(route) {
                    if (route && this.$store.state.website) {
                        addDocumentElementsByRoutePath({
                            path: route.path,
                            siteData: this.$store.state.website,
                        });
                    }
                },
                deep: true,
            },
        },
        render: () => Vue.h(App),
    })
    .use(router)
    .use(store);

fetchSiteData().then((siteData) => {
    // Don't overwrite website if it's already set
    // Currently we have only 1 such condition - postMessage in builder preview sets website before this fetch
    if (siteData && !store.state.website) {
        addDocumentElementsByRoutePath({
            path: router.currentRoute.value.path,
            siteData,
        });
        store.commit('setWebsite', {
            website: siteData,
        });
    }
}).finally(() => {
    app.directive(QA_DIRECTIVE_NAME, dataQADirective);
    app.mount('#app');
});

/**
 * Listen for message events to allow setting data externally
 * Used for previews
 */
window.addEventListener('message', ({
    data
}) => {
    if (typeof data !== 'object') {
        return;
    }

    if (data.type === UPDATE_SITE_DATA) {
        store.commit('setWebsite', {
            website: data.payload.siteData,
        });

        if (data.payload.path && data.payload.path !== router.currentRoute.value.path) {
            router.push({
                path: data.payload.path,
            });
        }

        store.dispatch('ecommerce/setShoppingCartItems', []);
    }

    // NAVIGATE_TO_PATH event is used by other internal services (site-position-service, screenshot-service)
    if (data.type === NAVIGATE_TO_PATH) {
        if (data.payload.path !== router.currentRoute.value.path) {
            router.push({
                path: data.payload.path,
            });
        }
    }

    if (data.type === ADD_DOCUMENT_ELEMENTS) {
        addDocumentElementsByRoutePath({
            path: router.currentRoute.value.path,
            siteData: data.payload.siteData,
        });
    }

    if (data.type === SCROLL_TO_TOP) {
        window.scrollTo(0, 0);
    }

    if (data.type === SET_AI_BUILDER_COLORS) {
        addElementToHead({
            type: 'element',
            tagName: 'style',
            properties: {
                [ELEMENT_DATA_ATTRIBUTE]: 'ai-builder-colors',
            },
            children: [{
                type: 'text',
                value: data.payload.colors,
            }, ],
        });
    }
});