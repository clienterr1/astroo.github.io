import {
    getCookie
} from '@zyro-inc/site-modules/utils/cookies';

import {
    COOKIE_ZYRO_AUTH_ID,
    COOKIE_MANUAL_LOCALE,
    COOKIE_GEOIP_LOCALE,
    COOKIE_HOSTINGER_LANGUAGE,
} from '@/constants';

export const getAuthCookie = () => {
    const cookie = getCookie(COOKIE_ZYRO_AUTH_ID);

    return cookie.substring(2, 34);
};

export const getManualLocaleCookie = () => getCookie(COOKIE_MANUAL_LOCALE);

export const getGeoIPLocaleCookie = () => getCookie(COOKIE_GEOIP_LOCALE);

export const getHostingerLanguageCookie = () => getCookie(COOKIE_HOSTINGER_LANGUAGE);