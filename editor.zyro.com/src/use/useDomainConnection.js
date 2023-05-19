import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    getSites
} from '@/api/BillingApi';
import EventLogApi from '@/api/EventLogApi';
import {
    getZyrositePreviewDomain
} from '@/api/PublishApi';
import {
    DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS,
    WHOIS_PROVIDER_INFORMATION,
    RDAP_PROVIDER_INFORMATION,
    DOMAIN_PROVIDER_OTHER,
    COOKIE_ZYRO_DEVICE_ID,
    COOKIE_ZYRO_SESSION_ID,
    COOKIE_IS_ASTRO_PUBLISH_ENABLED,
} from '@/constants';
import {
    useApi,
    PUBLISH_WITH_GENERATED_URL,
    IS_DOMAIN_CONNECTED,
    DOMAIN_WHOIS_DATA,
    CONNECT_DOMAIN_HOSTINGER,
    DELETE_CUSTOM_DOMAIN,
    CONNECT_IMPORTED_DOMAIN,
    CHECK_SINGLE_DOMAIN_AVAILABILITY,
    GET_DOMAIN_LIST,
    GET_IS_FREE_DOMAIN_AVAILABLE,
    CONNECT_CUSTOM_DOMAIN_ZYRO,
} from '@/use/useApi';
import {
    useNotifications
} from '@/use/useNotifications';
import {
    getIsDomainWithWWWPrefix,
    getDomainWithoutWWWPrefix,
    getDomainProperties,
} from '@zyro-inc/site-modules/utils/domainUtils';
import {
    getCookie
} from '@zyro-inc/site-modules/utils/cookies';
import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';
import {
    useI18n
} from 'vue-i18n';

// Shared state
const currentModalStepComponent = ref(DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS);
const hasVerificationTimedOut = ref(false);
const freeDomainTicket = ref({});
const isFreeDomainAvailable = computed(() => freeDomainTicket.value ? .subscription);
const currentNameservers = ref([]);
const providerData = ref({});
const customProviderData = ref('');
const isHostingerDomainConnectionFlow = ref(false);
const isDomainConnected = ref(false);
const hasDomainConnectionFailed = computed(() => !isDomainConnected.value && hasVerificationTimedOut.value);
const isDomainConnectionStatusInVerification = computed(() => !isDomainConnected.value && !hasDomainConnectionFailed.value);
const unusedDomainsList = ref([]);

const RDAP_TYPE = 'rdap';
const TAKEN_DOMAIN_ERROR_MESSAGE = 'The domain is already taken';
const ERROR_MESSAGE_BLACKLISTED_DOMAIN = 'Domain name is blacklisted';

export const useDomainConnection = (siteId) => {
    const isBeingVerified = ref(false);
    const domainConnectionError = ref('');
    const {
        state,
        getters,
        commit,
        dispatch,
    } = useStore();
    const {
        notify
    } = useNotifications();

    const {
        isLoading,
        hasFailed,
        error: useApiError,
        result,
        callApi,
        errorMessage,
    } = useApi();

    const {
        t
    } = useI18n();

    const setCurrentModalStepComponent = (stepValue) => {
        currentModalStepComponent.value = stepValue;
    };

    const setProviderData = (value) => {
        providerData.value = value;
    };

    const getProviderInformation = async (domainValue) => {
        await callApi(`${DOMAIN_WHOIS_DATA}${domainValue}`, {
            method: 'get',
        });
        if (hasFailed.value) {
            providerData.value = {};
            hasFailed.value = false;

            return;
        }

        const {
            registrar,
            registrarUrl,
            type,
            registrarId,
        } = result.value;

        const providerInformation = type === RDAP_TYPE ?
            RDAP_PROVIDER_INFORMATION[registrarId] :
            WHOIS_PROVIDER_INFORMATION[registrarUrl];

        if (providerInformation) {
            // Use provider information from our constants, if it is found
            providerData.value = providerInformation;
        } else if (registrar) {
            // Fallback to registrar information, if it is found, and set it as custom provider
            customProviderData.value = {
                providerName: registrar,
                url: registrarUrl,
            };

            providerData.value = {
                ...customProviderData.value,
            };
        } else {
            // If none of the information is present, set custom provider to the first entry in the list
            providerData.value = {
                ...DOMAIN_PROVIDER_OTHER,
            };
        }
    };

    const fetchUnusedDomainsList = async () => {
        await callApi(GET_DOMAIN_LIST, {
            method: 'get',
        });

        if (hasFailed.value) {
            notify({
                message: 'Failed to fetch domains list.',
                origin: 'UseDomainConnection.js',
            });

            return;
        }

        const registeredDomainsList = result.value.registeredList;
        const userSitesList = await getSites();

        unusedDomainsList.value = registeredDomainsList.filter(
            ({
                domain
            }) => userSitesList.every(({
                customDomain
            }) => customDomain !== domain),
        );
    };

    const fetchFreeDomainSubscription = async () => {
        await callApi(GET_IS_FREE_DOMAIN_AVAILABLE, {
            method: 'get',
        });

        if (hasFailed.value) {
            notify({
                message: 'Unable to fetch free domain subscription.',
                origin: 'UseDomainConnection.js',
            });
        }

        freeDomainTicket.value = result.value;
    };

    const connectCustomDomain = async (domainValue) => {
        const {
            websiteId
        } = state;

        const customDomainApi = isHostingerBrand ? CONNECT_DOMAIN_HOSTINGER : CONNECT_CUSTOM_DOMAIN_ZYRO;

        await callApi(customDomainApi, {
            method: 'post',
            data: {
                domain: domainValue,
                siteId: websiteId,
            },
        }, {}, false);

        if (hasFailed.value) {
            // Hacky way to check for error type until we have better handling
            if (errorMessage.value === TAKEN_DOMAIN_ERROR_MESSAGE) {
                domainConnectionError.value = t('validate.domainNameTaken');
            } else if (useApiError ? .value ? .response ? .data ? .errors ? .[0] ? .msg === ERROR_MESSAGE_BLACKLISTED_DOMAIN) {
                notify({
                    message: 'Domain name is blacklisted',
                    origin: 'UseDomainConnection.js',
                });
            } else {
                notify({
                    message: 'Custom domain connection has failed.',
                    origin: 'UseDomainConnection.js',
                });
            }

            return;
        }

        const isDomainWithWWWPrefix = getIsDomainWithWWWPrefix(domainValue);
        const domainWithoutWWW = getDomainWithoutWWWPrefix(domainValue);

        commit('setWebsiteMeta', {
            key: 'shouldAddWWWPrefixToDomain',
            value: isDomainWithWWWPrefix,
        });

        commit('setCustomDomain', domainWithoutWWW);
    };

    const publishWithGeneratedDomain = async (domain) => {
        const {
            zyroDomain
        } = state;

        if (zyroDomain) {
            hasFailed.value = false;

            return;
        }

        try {
            const {
                zyrositePreviewDomain,
                previewDomain,
            } = await getZyrositePreviewDomain({
                domain,
            });

            const amplitudeTrackingData = {
                domainName: 'generated',
                location: 'builder',
                device_id: getCookie(COOKIE_ZYRO_DEVICE_ID),
                session_id: Number.parseInt(getCookie(COOKIE_ZYRO_SESSION_ID), 10),
            };
            const isAstroPublish = getCookie(COOKIE_IS_ASTRO_PUBLISH_ENABLED);

            await callApi(PUBLISH_WITH_GENERATED_URL, {
                method: 'post',
                data: {
                    domain: zyrositePreviewDomain,
                    siteId,
                    amplitudeTrackingData,
                },
                params: {
                    ...(
                        import.meta.env.VITE_USER_APP_DPREVIEW && {
                            userAppDpreview: import.meta.env.VITE_USER_APP_DPREVIEW,
                        }),
                    ...(
                        import.meta.env.VITE_SCREENSHOT_PREVIEW && {
                            screenshotPreview: import.meta.env.VITE_SCREENSHOT_PREVIEW,
                        }),
                    ...(isAstroPublish && {
                        isAstroPublish,
                    }),
                    ...(
                        import.meta.env.VITE_ASTRO_RABBITMQ_QUEUE && {
                            astroQueueName: import.meta.env.VITE_ASTRO_RABBITMQ_QUEUE,
                        }),
                },
            }, {
                message: 'Couldn\'t publish the website with a generated domain.',
                origin: 'UseDomainConnection.js',
            });

            if (hasFailed.value) {
                return;
            }

            commit('setZyroDomain', zyrositePreviewDomain);
            commit('setPreviewDomain', previewDomain);
        } catch (error) {
            if (error ? .response ? .data ? .errors ? .[0] ? .msg === ERROR_MESSAGE_BLACKLISTED_DOMAIN) {
                notify({
                    message: 'Domain name is blacklisted',
                    origin: 'UseDomainConnection.js',
                });
            } else {
                notify({
                    message: 'Failed to generate site link preview domain',
                    origin: 'UseDomainConnection.js',
                });
            }
        }
    };

    const connectHostingerDomain = async (domain) => {
        isHostingerDomainConnectionFlow.value = true;

        await callApi(
            CONNECT_IMPORTED_DOMAIN, {
                method: 'post',
                data: {
                    domain,
                },
            }, {
                message: 'Couldn\'t publish the website with the Hostinger domain. Contact customer support.',
                origin: 'useHostingerDomainConnection.js',
            },
        );

        if (hasFailed.value) {
            isHostingerDomainConnectionFlow.value = false;

            return;
        }

        await publishWithGeneratedDomain(domain);

        await connectCustomDomain(domain);

        EventLogApi.logEvent({
            eventName: 'domain.connected',
            eventProperties: {
                type: 'hDomain',
            },
        });
    };

    const verifyConnection = async (setTimestamp = false) => {
        isBeingVerified.value = true;
        const {
            customDomain,
            websiteId,
        } = state;

        if (!customDomain) {
            isBeingVerified.value = false;
            isDomainConnected.value = false;

            return;
        }

        await callApi(`${IS_DOMAIN_CONNECTED}${customDomain}`, {
            method: 'get',
            params: {
                siteId: websiteId,
                setTimestamp,
            },
        }, {
            message: 'Couldn\'t verify whether the domain is connected.',
            origin: 'UseDomainConnection.js',
        });

        isBeingVerified.value = false;

        if (hasFailed.value) {
            return;
        }

        isDomainConnected.value = !!result.value.ok;

        /**
         * If endpoint returns difference (seconds since last verification),
         * check if 3h passed and set the value.
         */
        if ('difference' in result.value) {
            const hasTimedOut = (result.value.difference / 3600) > 3;

            hasVerificationTimedOut.value = hasTimedOut;
        }

        currentNameservers.value = result.value ? .records ? .ns ? ? [];
    };

    const removeDomain = async () => {
        const {
            websiteId
        } = state;

        await callApi(DELETE_CUSTOM_DOMAIN, {
            method: 'delete',
            data: {
                siteId: websiteId,
            },
        }, {
            message: 'Couldn\'t delete the custom domain.',
            origin: 'UseDomainConnection.js',
        });
        if (hasFailed.value) {
            return;
        }

        commit('setCustomDomain', null);
    };

    const getIsDomainAvailableToRegister = async (domain) => {
        const {
            domainName,
            tld,
        } = getDomainProperties(domain);

        await callApi(CHECK_SINGLE_DOMAIN_AVAILABILITY, {
            method: 'get',
            params: {
                domain: `${domainName}.${tld}`,
                domainName,
                tld,
            },
        }, {}, false);

        if (hasFailed.value) {
            return false;
        }

        return result.value.isAvailable;
    };

    const domainConnectionStatusTextPath = computed(() => {
        const {
            customDomain
        } = state;

        if (!customDomain) {
            return 'common.notConnected';
        }

        if (isDomainConnected.value) {
            return 'common.connected';
        }

        if (hasDomainConnectionFailed.value) {
            return 'siteSettings.domain.connectionFailed';
        }

        return 'siteSettings.domain.verifyingConnection';
    });

    const trackDomainConnectionStatus = async () => {
        const wasPropagationEventAlreadySent = getters.builderCompletedSteps ? .isDomainPropagatedEventSent ? ? false;

        if (wasPropagationEventAlreadySent) {
            return;
        }

        await verifyConnection();

        if (isDomainConnected.value && !getters.isCustomDomainPreview) {
            EventLogApi.logEvent({
                eventName: 'website_builder.domain.propagated',
                eventProperties: {
                    website_id: state.websiteId,
                    domain_name: state.customDomain,
                },
                isHostingerEvent: true,
            });

            dispatch('addBuilderCompletedStep', {
                isDomainPropagatedEventSent: true,
            });
        }
    };

    return {
        setCurrentModalStepComponent,
        setProviderData,
        getProviderInformation,
        verifyConnection,
        connectCustomDomain,
        connectHostingerDomain,
        publishWithGeneratedDomain,
        removeDomain,
        getIsDomainAvailableToRegister,
        fetchUnusedDomainsList,
        fetchFreeDomainSubscription,
        trackDomainConnectionStatus,
        isHostingerDomainConnectionFlow: computed(() => isHostingerDomainConnectionFlow.value),
        isLoading: computed(() => isLoading.value),
        hasFailed: computed(() => hasFailed.value),
        isBeingVerified: computed(() => isBeingVerified.value),
        currentModalStepComponent: computed(() => currentModalStepComponent.value),
        hasVerificationTimedOut: computed(() => hasVerificationTimedOut.value),
        providerData: computed(() => providerData.value),
        currentNameservers: computed(() => currentNameservers.value),
        domainConnectionError: computed(() => domainConnectionError.value),
        isDomainConnected: computed(() => isDomainConnected.value),
        hasDomainConnectionFailed: computed(() => hasDomainConnectionFailed.value),
        isDomainConnectionStatusInVerification: computed(() => isDomainConnectionStatusInVerification.value),
        domainConnectionStatusTextPath: computed(() => domainConnectionStatusTextPath.value),
        customProviderData: computed(() => customProviderData.value),
        unusedDomainsList: computed(() => unusedDomainsList.value),
        freeDomainTicket: computed(() => freeDomainTicket.value),
        isFreeDomainAvailable: computed(() => isFreeDomainAvailable.value),
    };
};