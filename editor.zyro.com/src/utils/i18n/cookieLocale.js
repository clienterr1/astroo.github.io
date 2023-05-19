import {
    getManualLocaleCookie,
    getGeoIPLocaleCookie,
    getHostingerLanguageCookie,
} from '@/utils/getCookies';
import {
    setCookie
} from '@zyro-inc/site-modules/utils/cookies';

import {
    COOKIE_MANUAL_LOCALE
} from '@/constants';

const HOSTINGER_LANG_TO_LOCALE_MAP = {
    en_GB: 'en',
    ru_RU: 'ru',
    uk_UA: 'ua',
    pt_BR: 'br',
    es_ES: 'es',
    pt_PT: 'pt',
    es_MX: 'mx',
    fr_FR: 'fr',
    es_CO: 'co',
    lt_LT: 'lt',
    tr_TR: 'tr',
    id_ID: 'id',
    ar_AR: 'en',
    zh_CN: 'en',
};
const getLocaleCodeBasedOnHostingerLanguage = (hostingerLanguage) => HOSTINGER_LANG_TO_LOCALE_MAP[hostingerLanguage];

export function getLocaleCodeFromCookie() {
    const localeFromCookie = getLocaleCodeBasedOnHostingerLanguage(getHostingerLanguageCookie()) ||
        getManualLocaleCookie() ||
        getGeoIPLocaleCookie();

    return localeFromCookie;
}

export function setLocaleCodeToCookie(localeCode) {
    setCookie(COOKIE_MANUAL_LOCALE, localeCode, 365, {
        cdomain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
}