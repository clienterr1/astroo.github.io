import {
    SYSTEM_LOCALE
} from '@zyro-inc/site-modules/constants';

export const getPagePathFromId = ({
    pageId,
    siteData,
    locale = SYSTEM_LOCALE,
}) => {
    if (!siteData || !siteData.meta || !pageId) {
        return null;
    }

    const {
        meta,
        languages,
    } = siteData;

    const {
        defaultLocale
    } = meta;

    // Finding language which contains page by it's ID
    const languageData = languages[locale];

    const {
        pages,
        homePageId,
    } = languageData;

    if (!pages[pageId]) {
        return null;
    }

    // If page is in default or system locales, do not add language prefix
    if (locale === SYSTEM_LOCALE || locale === defaultLocale) {
        if (homePageId === pageId) {
            return '/';
        }

        return `/${pages[pageId].slug}`;
    }

    // If page is in other locale, add language prefix. Do not add page slug if page is home page
    if (homePageId === pageId) {
        return `/${locale}`;
    }

    return `/${locale}/${pages[pageId].slug}`;
};