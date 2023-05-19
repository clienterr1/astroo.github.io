import {
    getLocale,
    getLocaleByIso,
} from '@/utils/i18n/supportedLocales';

/**
 * Function to get locale from browser
 * @example
 * when navigator.languages == ["ar-SA", "en-US"], then:
 * getBrowserLocale() // returns "ar-SA"
 * getBrowserLocale({ countryCodeOnly: true }) // returns "ar"
 *
 * @param {Object} [options={}] - Options object
 * @returns {string} - locale code
 */
function getBrowserLocale(options = {}) {
    const defaultOptions = {
        countryCodeOnly: false,
    };

    const opt = {
        ...defaultOptions,
        ...options,
    };

    const navigatorLocale = navigator.languages ? .[0] || navigator.language;

    if (!navigatorLocale) {
        return;
    }

    const trimmedLocale = opt.countryCodeOnly ?
        navigatorLocale.trim().split(/-|_/)[0] :
        navigatorLocale.trim();

    // eslint-disable-next-line consistent-return
    return trimmedLocale;
}

/**
 * Gets the locale or language code from browser preferences
 * @export
 * @returns {string} - locale code if found, else `undefined`
 */
export default function getLocaleFromBrowser() {
    // Gets region. If region does not exist, gets language
    const locale = getLocaleByIso(getBrowserLocale()) ||
        getLocale(getBrowserLocale({
            countryCodeOnly: true,
        }));

    return locale ? .code;
}