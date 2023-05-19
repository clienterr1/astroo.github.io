import {
    TIME_DENOMINATOR_MINUTE,
    TIME_DENOMINATOR_HOUR,
    TIME_DENOMINATOR_DAY,
} from '@/constants';
import {
    getLocaleCodeFromCookie
} from '@/utils/i18n/cookieLocale';
import {
    DEFAULT_LOCALE
} from '@/utils/i18n/supportedLocales';

export const UKR_LOCALE = 'UK';
export const GB_LOCALE = 'GB';

// Slicing ISODate returns format of YYYY-MM-dd
export const sliceTimeFromISODate = (ISODateString) => {
    if (typeof ISODateString !== 'string') {
        return null;
    }

    return ISODateString ? .slice(0, 10);
};

export const getLocaleForDateFormatting = (locale) => {
    // In our translation system, UK is for UNITED KINGDOM. But for Date.toLocaleDateString it is UKRAINIAN.
    if (locale.toUpperCase() === UKR_LOCALE) {
        return GB_LOCALE;
    }

    return locale;
};

export const getFormattedLocalizedDate = (date) => new Date(date).toLocaleDateString(
    getLocaleForDateFormatting(getLocaleCodeFromCookie() || DEFAULT_LOCALE.code), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    },
);

export const getFormattedNumericDate = (date) => new Date(date).toLocaleDateString('en-US');

export const convertMsToDays = (ms) => Math.ceil(ms / TIME_DENOMINATOR_DAY);

/**
 * @desc Returns object with remainder of hours, minutes and seconds for provided milliseconds
 */
export const getTimeRemainder = (milliseconds) => {
    const hours = Math.floor((milliseconds / (TIME_DENOMINATOR_HOUR)) % 24);
    const minutes = Math.floor((milliseconds / (TIME_DENOMINATOR_MINUTE)) % 60);
    const seconds = Math.floor((milliseconds / 1000) % 60);

    return {
        hours,
        minutes,
        seconds,
    };
};