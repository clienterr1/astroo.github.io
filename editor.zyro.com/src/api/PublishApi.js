import axios from 'axios';
import {
    getCookie
} from '@zyro-inc/site-modules/utils/cookies';
import {
    COOKIE_ZYRO_DEVICE_ID,
    COOKIE_ZYRO_SESSION_ID,
    COOKIE_IS_ASTRO_PUBLISH_ENABLED,
} from '@/constants';
import EventLogApi from '@/api/EventLogApi';

const PUBLISH_API_V3 = `${import.meta.env.VITE_BACKEND_API_URL}/v3/publish`;

const PUBLISH_URL_ZYRO = PUBLISH_API_V3;

const REPUBLISH_URL_ZYRO = `${PUBLISH_API_V3}/republish`;

const PUBLISH_URL_HOSTINGER = `${PUBLISH_API_V3}/hostinger`;

const REPUBLISH_URL_HOSTINGER = `${PUBLISH_API_V3}/republish/hostinger`;

export const getZyrositePreviewDomain = async ({
    domain
}) => {
    const {
        data
    } = await axios.get(`${PUBLISH_API_V3}/zyrosite-preview-domain/${domain}`);

    const {
        zyrositePreviewDomain,
        previewDomain,
    } = data;

    return {
        zyrositePreviewDomain,
        previewDomain,
    };
};

export const getIsZyroSubdomainAvailable = async (domain) => {
    const {
        data
    } = await axios.get(`${PUBLISH_API_V3}/isavailable/${domain}`);

    EventLogApi.logEvent({
        eventName: 'user.domain_check',
        eventProperties: {
            domainName: domain,
        },
    });

    return data.ok;
};

export const publishSiteApi = async ({
    apiUrl,
    domain,
    websiteId,
}) => {
    const isAstroPublish = getCookie(COOKIE_IS_ASTRO_PUBLISH_ENABLED);

    const amplitudeTrackingData = {
        domainName: domain,
        location: 'builder',
        device_id: getCookie(COOKIE_ZYRO_DEVICE_ID),
        session_id: Number.parseInt(getCookie(COOKIE_ZYRO_SESSION_ID), 10),
    };

    const {
        data
    } = await axios.post(apiUrl, {
        domain,
        siteId: websiteId,
        amplitudeTrackingData,
    }, {
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
    });

    return data.newDomain;
};

export const publishSite = (domain, websiteId) => publishSiteApi({
    apiUrl: PUBLISH_URL_ZYRO,
    domain,
    websiteId,
});

export const publishSiteHostinger = (domain, websiteId) => publishSiteApi({
    apiUrl: PUBLISH_URL_HOSTINGER,
    domain,
    websiteId,
});

export const republishSiteApi = async ({
    apiUrl,
    siteId,
    isSiteWithEcommerce,
}) => {
    const isAstroPublish = getCookie(COOKIE_IS_ASTRO_PUBLISH_ENABLED);

    await axios.post(apiUrl, {
        siteId,
    }, {
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
    });

    EventLogApi.logEvent({
        eventName: 'site.updated',
        eventProperties: {
            siteId,
            isSiteWithEcommerce,
        },
    });
};

export const republishSite = (siteId, isSiteWithEcommerce) => republishSiteApi({
    apiUrl: REPUBLISH_URL_ZYRO,
    siteId,
    isSiteWithEcommerce,
});

export const republishSiteHostinger = (siteId, isSiteWithEcommerce) => republishSiteApi({
    apiUrl: REPUBLISH_URL_HOSTINGER,
    siteId,
    isSiteWithEcommerce,
});