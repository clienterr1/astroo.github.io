import {
    getPathParams
} from '@zyro-inc/site-modules/utils/page/getPathParams';

export const getPageIdFromPath = ({
    siteData,
    path,
}) => {
    if (!siteData) {
        return null;
    }

    const {
        meta,
        languages,
    } = siteData;

    const {
        locale,
        slug,
    } = getPathParams({
        path,
        languageKeys: Object.keys(languages),
        defaultLocale: meta.defaultLocale,
    });

    const {
        pages,
        homePageId,
    } = languages[locale];

    if (slug) {
        return Object.keys(pages).find((pageId) => pages[pageId].slug === slug) || homePageId;
    }

    return homePageId;
};