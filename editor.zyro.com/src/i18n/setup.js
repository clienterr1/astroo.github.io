import {
    createI18n
} from 'vue-i18n';

import mergeMessageTranslations from '@/i18n/mergeMessageTranslations';
import defaultMessages from '@/i18n/defaultMessages.json';

import getLocaleFromBrowser from '@/utils/i18n/getBrowserLocale';
import {
    getLocaleCodeFromCookie,
    setLocaleCodeToCookie,
} from '@/utils/i18n/cookieLocale';
import {
    DEFAULT_LOCALE,
    getLocale,
    getLocaleByIso,
} from '@/utils/i18n/supportedLocales';

/**
 * Gets the starting locale code, of the locale that should be used on page load.
 * Priority flow, of initial locale decision making:
 * `query param ("?lang=")` > `cookie/localStorage` > `browser preferences` > default
 *
 * @returns {string} - starting locale code
 */
function getStartingLocale() {
    const startingLocale = getLocale(getLocaleCodeFromCookie()) ||
        getLocale(getLocaleFromBrowser());

    return startingLocale ? .code || DEFAULT_LOCALE.code;
}

const startingLocale = getStartingLocale();

/** The VueI18n instance */
const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: startingLocale,
    fallbackLocale: DEFAULT_LOCALE.code,
    messages: {
        // because of our message merging logic, default messages are loaded regardless
        [DEFAULT_LOCALE.code]: defaultMessages,
    },
    silentTranslationWarn: import.meta.env.PROD,
});

/**
 * Array of locale codes, that are already loaded
 * @type {Array.<string>}
 */
const loadedLanguages = [DEFAULT_LOCALE.code];

/**
 * Sets the current locale to a given one
 * @param {string} locale - locale code
 */
function setLocale(locale) {
    i18n.global.locale = locale;
    setLocaleCodeToCookie(locale);
}

/**
 * This function sets the i18n to a given locale,
 * and loads the given locale's messages if needed
 * @export
 * @param {string} locale - locale code
 * @returns {Promise.<string>} Promise that resolves to the set locale code
 */
export function loadLocaleMessagesAsync(locale) {
    const localeInfo = getLocale(locale);

    if (!localeInfo) {
        setLocale(i18n.global.fallbackLocale);

        return Promise.resolve(i18n.global.fallbackLocale);
    }

    // If the language was already loaded
    if (loadedLanguages.includes(locale)) {
        // If locale is loaded, is not yet set as current one
        if (i18n.global.locale !== locale) {
            setLocale(locale);
        }

        return Promise.resolve(locale);
    }

    // If the language hasn't been loaded yet
    return mergeMessageTranslations(localeInfo.localeId).then((messages) => {
        i18n.global.setLocaleMessage(locale, messages);
        loadedLanguages.push(locale);
        setLocale(locale);

        return Promise.resolve(locale);
    });
}

/**
 * This function gets a single set of translations by locale
 * @export
 * @param {string} locale - locale code
 * @returns {object | null} - translations of the locale
 */
export function getMessagesByLocale(locale) {
    const localeInfo = getLocaleByIso(locale) || getLocale(locale);

    if (!localeInfo) {
        return null;
    }

    return mergeMessageTranslations(localeInfo.localeId);
}

export const loadStartingLocaleMessages = async () => loadLocaleMessagesAsync(startingLocale);

export default i18n;