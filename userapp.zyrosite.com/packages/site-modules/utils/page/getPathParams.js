import {
    SYSTEM_LOCALE
} from '@zyro-inc/site-modules/constants';

// gets locale and slug from path
export const getPathParams = ({
    path,
    languageKeys = [],
    defaultLocale = 'system',
}) => {
    // Get 'path' segments as in 'url.com/segment1/segment2'
    // NOTE: 'segment1' can be either locale or page slug!
    // Clear '' segments as there can be multiple variations of path with '/' ie :
    // 'lang/slug/', '/lang/slug/', '/lang/slug' etc.
    const [segment1, segment2] = path.split('/').filter((segment) => segment !== '');

    if (!languageKeys || !languageKeys.length > 1) {
        return {
            locale: defaultLocale,
            slug: segment1,
        };
    }

    if (languageKeys.includes(segment1)) {
        return {
            locale: segment1,
            slug: segment2, // can be undefined - if path contains language prefix (i.e. '/lt')
        };
    }

    return {
        locale: defaultLocale ? ? SYSTEM_LOCALE, // can be undefined (multilanguage not initialized)
        slug: segment1, // can be undefined as well (for home pages)
    };
};