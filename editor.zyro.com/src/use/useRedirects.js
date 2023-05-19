import {
    useStore
} from 'vuex';

import {
    useRoute
} from 'vue-router';

import {
    HPANEL_REDIRECTS_PATHS,
    WWW_REDIRECT_PATHS,
    ECOMMERCE_REDIRECT_PATHS,
    REDIRECT_PARAM_KEYS,
    REDIRECT_PARAM_VALUES,
    REDIRECT_TYPES,
} from '@/constants';
import {
    getLocaleCodeFromCookie
} from '@/utils/i18n/cookieLocale';

const {
    HOME,
    PAYMENTS,
    SINGLE_SITE_DASHBOARD_SUBSCRIPTION,
    SIGN_UP,
    SIGN_IN,
    SITES,
    SUBSCRIPTIONS,
} = WWW_REDIRECT_PATHS;
const {
    PRODUCTS,
    PRODUCTS_ADD,
    PRODUCTS_EDIT,
    PAYMENT_MANAGEMENT,
} = ECOMMERCE_REDIRECT_PATHS;
const {
    LANG,
    RETURN,
    SITE_ID,
    PLANS_TO_SHOW,
    SUBSCRIPTION_ID,
    PRODUCT,
    FLOW,
    ACTIVATE_PLAN,
    REDIRECT_URL,
} = REDIRECT_PARAM_KEYS;
const {
    FLOW_UPGRADE,
    FLOW_EXTEND,
    RETURN_BUILDER,
    PLANS_TO_SHOW_ECOMMERCE,
    PLANS_TO_SHOW_NON_ECOMMERCE,
    PLANS_TO_SHOW_BUSINESS,
} = REDIRECT_PARAM_VALUES;
const {
    ASSIGN
} = REDIRECT_TYPES;

const getRedirectUrlBase = ({
    path,
    params,
    domain,
}) => {
    const baseUrl = new URL(path, domain);

    baseUrl.search = new URLSearchParams(params).toString();

    return baseUrl.href;
};

export const getRedirectUrlToWWW = ({
    path = '',
    params = {},
}) => getRedirectUrlBase({
    path,
    params,
    domain: import.meta.env.VITE_HOMEPAGE_URL,
});

export const getRedirectUrlToBuilder = ({
    path = '',
    params = {},
}) => getRedirectUrlBase({
    path,
    params,
    domain: import.meta.env.VITE_BUILDER_URL,
});

export const getRedirectUrlToHTemplates = ({
    path = '',
    params = {},
}) => getRedirectUrlBase({
    path,
    params,
    domain: import.meta.env.VITE_TEMPLATES_URL_HOSTINGER,
});

export const getRedirectUrlToDashboard = ({
    path = SITES,
    params = {},
} = {}) => getRedirectUrlBase({
    path,
    params,
    domain: import.meta.env.VITE_DASHBOARD_URL,
});

export const getRedirectUrlToHostingerLogin = ({
    path = '',
    params = {},
} = {}) => getRedirectUrlBase({
    path,
    params: {
        redirectUrl: window.location.href,
        ...params,
    },
    domain: import.meta.env.VITE_HOSTINGER_LOGIN_URL,
});

export const getRedirectUrlToHPanel = ({
    path = '',
    params = {},
} = {}) => getRedirectUrlBase({
    path,
    params: {
        redirectUrl: window.location.href,
        ...params,
    },
    domain: import.meta.env.VITE_HPANEL_URL,
});

export const getRedirectUrlToHostinger = ({
    path = '',
    params = {},
} = {}) => getRedirectUrlBase({
    path,
    params,
    domain: import.meta.env.VITE_HOSTINGER_URL,
});

export const getRedirectUrlToEcommerce = ({
    path = null,
    siteId = null,
    params = {},
} = {}) => {
    const pathname = [
        siteId,
        path,
    ].filter((value) => value).join('/');

    const url = new URL(pathname,
        import.meta.env.VITE_ECOMMERCE_ADMIN_URL);
    const searchParams = {
        ...params,
        [LANG]: getLocaleCodeFromCookie(),
    };

    Object.keys(searchParams).forEach((key) => url.searchParams.append(key, searchParams[key]));

    return url.href;
};

export const useRedirects = () => {
    const {
        state,
        getters,
        dispatch,
    } = useStore() ? ? {};

    const route = useRoute();

    // Accepts a WWW page path, to which redirect should be made, and custom params object.
    // Function stringifies params, constructs the link to WWW with current locale param,
    // so that after redirect, user would be presented the same language he had set in builder.

    const saveChanges = async () => {
        if (!dispatch || !getters['saving/canSave']) {
            return;
        }

        await dispatch('saving/saveWebsite');
    };

    // Executes redirect to WWW with provided redirect type.
    const redirectToWWW = async ({
        path = HOME,
        params = {},
        redirectType = ASSIGN,
    } = {}) => {
        await saveChanges();

        const wwwUrl = getRedirectUrlToWWW({
            path,
            params,
        });

        window.location[redirectType](wwwUrl);
    };

    const redirectToDashboard = async ({
        path = SITES,
        params = {},
        redirectType = ASSIGN,
    } = {}) => {
        await saveChanges();

        const dashboardUrl = getRedirectUrlToDashboard({
            path,
            params,
        });

        window.location[redirectType](dashboardUrl);
    };

    const redirectToHPanel = async ({
        path,
        params = {},
        redirectType = ASSIGN,
        openInNewTab = false,
    } = {}) => {
        await saveChanges();

        const hPanelUrl = getRedirectUrlToHPanel({
            path,
            params,
        });

        if (openInNewTab) {
            window.open(hPanelUrl);

            return;
        }

        window.location[redirectType](hPanelUrl);
    };

    const redirectToHPanelAddDomain = async ({
        currentDomain,
        siteId,
        params = {},
    } = {}) => {
        await saveChanges();

        const hPanelUrl = getRedirectUrlToHPanel({
            path: `${HPANEL_REDIRECTS_PATHS.ADD_DOMAIN}/${currentDomain}`,
            params: {
                [REDIRECT_URL]: `${import.meta.env.VITE_BUILDER_URL}/${siteId}`,
                ...params,
            },
        });

        window.location.assign(hPanelUrl);
    };

    const redirectToHostinger = async ({
        path,
        params = {},
        redirectType = ASSIGN,
        openInNewTab = false,
    } = {}) => {
        await saveChanges();

        const hostingerUrl = getRedirectUrlToHostinger({
            path,
            params,
        });

        if (openInNewTab) {
            window.open(hostingerUrl);

            return;
        }

        window.location[redirectType](hostingerUrl);
    };

    const handleDemoRedirect = () => {
        const shouldLeadToHostingerOnboarding = route.query ? .leadToOnboarding === 'true';

        if (shouldLeadToHostingerOnboarding) {
            redirectToHPanel({
                path: 'redirect-to',
                params: 'destination=builder-onboarding',
                openInNewTab: true,
            });

            return;
        }

        redirectToHostinger({
            path: 'website-builder',
            openInNewTab: true,
        });
    };

    const getPlansToShowInPricing = () => {
        const isStoreTypeEcwid = getters['ecwid/isStoreTypeEcwid'];
        const isStoreTypeZyro = getters['ecommerce/isStoreTypeZyro'];

        if (isStoreTypeEcwid) {
            return PLANS_TO_SHOW_ECOMMERCE;
        }

        if (isStoreTypeZyro) {
            return PLANS_TO_SHOW_BUSINESS;
        }

        return PLANS_TO_SHOW_NON_ECOMMERCE;
    };

    const redirectToUpgrade = (payload = {}) => {
        redirectToDashboard({
            path: SINGLE_SITE_DASHBOARD_SUBSCRIPTION,
            params: {
                [SITE_ID]: state.websiteId,
                [FLOW]: FLOW_UPGRADE,
                ...payload,
            },
        });
    };

    const redirectToExtend = (payload = {}) => {
        redirectToDashboard({
            path: SINGLE_SITE_DASHBOARD_SUBSCRIPTION,
            params: {
                [SITE_ID]: state.websiteId,
                [FLOW]: FLOW_EXTEND,
                ...payload,
            },
        });
    };

    const redirectToWWWPayments = (payload = {}) => {
        const plansToShowInPricing = payload[PLANS_TO_SHOW] || getPlansToShowInPricing();

        const parameters = {
            [SITE_ID]: state.websiteId,
            [PLANS_TO_SHOW]: plansToShowInPricing,
            [ACTIVATE_PLAN]: true,
            ...payload,
        };

        redirectToWWW({
            path: PAYMENTS,
            params: parameters,
        });
    };

    const redirectToWWWSignUp = ({
        returnTo = RETURN_BUILDER
    } = {}) => {
        redirectToWWW({
            path: SIGN_UP,
            params: {
                [RETURN]: returnTo,
            },
        });
    };

    const redirectToWWWSignIn = () => {
        redirectToWWW({
            path: SIGN_IN,
            params: {
                [RETURN]: RETURN_BUILDER,
            },
        });
    };

    const redirectToSubscriptions = ({
        websiteId,
        subscriptionId,
    } = {}) => {
        const params = {
            [RETURN]: RETURN_BUILDER,
        };

        if (websiteId) {
            params[SITE_ID] = websiteId;
        }

        if (subscriptionId) {
            params[SUBSCRIPTION_ID] = subscriptionId;
        }

        return redirectToDashboard({
            path: SUBSCRIPTIONS,
            params,
        });
    };

    const redirectToEcommerce = async (path = null, params = {}, siteId = null) => {
        await saveChanges();

        const href = getRedirectUrlToEcommerce({
            path,
            params,
            siteId: siteId || state ? .websiteId,
        });

        window.location.assign(href);
    };

    const redirectToEcommerceProducts = () => {
        redirectToEcommerce(PRODUCTS);
    };

    const redirectToEcommerceProductsAdd = () => {
        redirectToEcommerce(PRODUCTS_ADD);
    };

    const redirectToEcommerceProductsEdit = (productId) => {
        redirectToEcommerce(
            PRODUCTS_EDIT, {
                [PRODUCT]: productId,
            },
        );
    };

    const redirectToEcommercePayments = (siteId = null, params = {}) => {
        redirectToEcommerce(PAYMENT_MANAGEMENT, params, siteId);
    };

    return {
        redirectToWWW,
        redirectToUpgrade,
        redirectToExtend,
        redirectToDashboard,
        redirectToHPanel,
        redirectToHostinger,
        handleDemoRedirect,
        redirectToWWWPayments,
        redirectToWWWSignUp,
        redirectToWWWSignIn,
        redirectToSubscriptions,
        redirectToEcommerce,
        redirectToEcommerceProducts,
        redirectToEcommerceProductsAdd,
        redirectToEcommerceProductsEdit,
        redirectToEcommercePayments,
        redirectToHPanelAddDomain,
    };
};