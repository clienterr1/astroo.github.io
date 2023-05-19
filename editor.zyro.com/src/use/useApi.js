import axios from 'axios';
import {
    ref,
    reactive,
    computed,
} from 'vue';

import {
    getErrorMessage
} from '@/use/api/errorMessage';
import {
    useNotifications
} from '@/use/useNotifications';

// default axios request config
export const DEFAULT_CONFIG = {
    method: 'get',
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: {
        common: {
            Accept: 'application/json',
        },
    },
    withCredentials: true,
};

export const useApi = () => {
    const isLoading = ref(false);
    const hasLoaded = ref(false);
    const hasFailed = ref(false);
    const cancelTokenSource = ref(false);
    const hasRequestCancelled = ref(false);

    const error = ref(null);
    const result = ref(null);
    const requestConfig = reactive({});

    const {
        notify
    } = useNotifications();

    const errorMessage = computed(() => error.value ? .message);

    const errorHandler = (error_, errorNotification, showToast) => {
        hasFailed.value = true;
        hasRequestCancelled.value = axios.isCancel(error_);
        const message = errorNotification.message ? ? getErrorMessage(error_);

        if (showToast && !hasRequestCancelled.value) {
            notify({
                ...errorNotification,
                message,
            });
        }

        error.value = {
            ...error_,
            message,
        };
        // TODO: Failed requests are logged in test. Find a way to disable that.
    };

    /**
     *
     * @param url {string}
     * @param config {{
     *    method: 'get' | 'post' | 'put' | 'delete' | 'patch',
     *    [data]: Object
     * }}
     * @param errorNotification {{
     *    [type]: NOTIFICATION_TYPE_TOAST | NOTIFICATION_TYPE_MODAL | NOTIFICATION_TYPE_RENDERLESS,
     *    [origin]: string,
     *    [title]: string,
     *    [message]: string,
     *    [isClosable]: boolean,
     *    [autoCloseTimeout]: number,
     *    [autoSubmit]: boolean,
     *    [submitLabel]: string,
     *    [submitCallback]: function,
     *    [closeCallback]: function,
     *    [closeOnSubmit]: boolean,
     *    [props]: Object
     * }},
     * @returns {Promise<void>}
     */
    const callApi = async (url, config = {}, errorNotification = {}, showToast = true) => {
        isLoading.value = true;
        hasLoaded.value = false;
        hasFailed.value = false;
        cancelTokenSource.value = axios.CancelToken.source();
        error.value = null;
        requestConfig.value = {
            url,
            ...DEFAULT_CONFIG,
            ...config,
            cancelToken: cancelTokenSource.value.token,
        };

        try {
            const {
                data
            } = await axios(requestConfig.value);

            if (data) {
                result.value = data;
                hasLoaded.value = true;
            } else {
                errorHandler(new Error('A malformed response'));
            }
        } catch (error_) {
            errorHandler(error_, errorNotification, showToast);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        hasLoaded,
        hasFailed,
        hasRequestCancelled,
        cancelTokenSource,
        error,
        errorMessage,
        result,
        callApi,
    };
};

// export endpoints for use in components
export const AI_PAGE_HEATMAP = '/v1/ai/heatmap/page';

export const DOMAIN_WHOIS_DATA = '/v3/domains/whois/';

export const PUBLISH_WITH_GENERATED_URL = '/v3/publish';
export const CONNECT_CUSTOM_DOMAIN_ZYRO = '/v3/publish/custom-domain';
export const CONNECT_DOMAIN_HOSTINGER = '/v3/publish/connect-domain-hostinger';
export const IS_DOMAIN_CONNECTED = '/v3/domains/is-connected/';
export const DELETE_CUSTOM_DOMAIN = '/v3/publish/custom-domain';
export const CONNECT_IMPORTED_DOMAIN = 'v3/hostinger-integration/connect-imported-domain';
export const GET_DOMAIN_LIST = '/v3/hdomains/user/domain-list';
export const GET_IS_FREE_DOMAIN_AVAILABLE = '/v3/hdomains/free-domain/user/available-for-claim';
export const TEMPLATE = '/v3/templates';
export const SITES_API = '/v3/sites';
export const AI_SUBCATEGORIES = '/v1/ai/subcategories';
export const AI_SEO_HEADINGS = 'v1/ai/seo/headings';
export const SITE_TRAFFIC_API = '/v3/domains/traffic';
export const CHECK_SINGLE_DOMAIN_AVAILABILITY = '/v3/hdomains/availability';
export const JWT_VERIFY = '/v1/users/jwt-token';