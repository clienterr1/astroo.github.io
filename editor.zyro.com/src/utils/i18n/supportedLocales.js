import LOCALES from '@/i18n/locales.json';

/**
 * Default locale, which is ALWAYS the last one in available locales
 * @type {import('@/i18n/localesTarget').Locale}
 */
export const DEFAULT_LOCALE = LOCALES[LOCALES.length - 1];

/**
 * Finds a locale by its code
 * @export
 * @param {string} locale - code of locale to find
 * @returns {import('@/i18n/localesTarget').Locale} - Locale object, if found
 */
export function getLocale(locale) {
    return LOCALES.find((localeObject) => localeObject.code === locale);
}

/**
 * Finds a locale by its iso
 * @export
 * @param {string} localeIso - iso of locale to find
 * @returns {import('@/i18n/localesTarget').Locale} - Locale object, if found
 */
export function getLocaleByIso(localeIso) {
    return LOCALES.find((localeObject) => localeObject.iso === localeIso);
}

/**
 * Finds a locale by its localeId
 * @param {string} localeId - localeId of locale to find
 * @returns {import('@/i18n/localesTarget').Locale} - Locale object, if found
 */
function getLocaleById(localeId) {
    return LOCALES.find((localeObject) => localeObject.localeId === localeId);
}

/**
 * Finds a locale fallback, if has one
 * @export
 * @param {string} locale - code of locale, whose fallback to find
 * @returns {import('@/i18n/localesTarget').Locale} - Locale object of the fallback locale, if found
 */
export function getLocaleFallback(locale) {
    return getLocaleById(LOCALES.find((localeObject) => localeObject.code === locale) ? .fallback);
}