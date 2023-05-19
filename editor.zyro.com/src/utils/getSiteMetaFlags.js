import {
    ECOMMERCE_TYPE_ZYRO,
    ELEMENT_TYPE_EMBED,
    ELEMENT_TYPE_GALLERY,
    PAGE_TYPE_BLOG,
    SYSTEM_LOCALE,
} from '@zyro-inc/site-modules/constants';

const getLanguageDataEntries = ({
    siteData
}) => {
    const languageDataEntries = Object.entries(siteData.languages);

    // If only one language is active, that's the system language and we return it
    if (languageDataEntries.length === 1) {
        return languageDataEntries;
    }

    // If there are any other languages active, we do not return the system language
    const nonSystemLanguageDataEntries = languageDataEntries.filter(([languageKey]) => languageKey !== SYSTEM_LOCALE);

    return nonSystemLanguageDataEntries;
};

const getIsSiteWithOnePage = ({
    languageDataEntries
}) => languageDataEntries.every(([, {
    pages
}]) => Object.values(pages).length === 1);

const getIsSiteWithBlogPage = ({
    languageDataEntries
}) => languageDataEntries.some(([, {
    pages
}]) => {
    const isPageTypeBlog = Object.values(pages).some(({
        type
    }) => type === PAGE_TYPE_BLOG);

    return isPageTypeBlog;
});

const getIsSiteUsingEcommerce = ({
    siteData
}) => siteData.meta.ecommerceType === ECOMMERCE_TYPE_ZYRO;

const getDoesSiteHaveElementType = ({
    languageDataEntries,
    elementType,
}) => languageDataEntries.some(([, {
    elements
}]) => Object.values(elements).some(({
    type
}) => type === elementType));

const getIsSiteWithMultipleLanguages = ({
    languageDataEntries
}) => languageDataEntries.length > 1;

export const getSiteMetaFlags = ({
    siteData
}) => {
    const languageDataEntries = getLanguageDataEntries({
        siteData,
    });

    const isOnePageSite = getIsSiteWithOnePage({
        languageDataEntries,
    });
    const isUsingBlog = getIsSiteWithBlogPage({
        languageDataEntries,
    });
    const isUsingEcommerce = getIsSiteUsingEcommerce({
        siteData,
    });
    const isUsingEmbedCode = getDoesSiteHaveElementType({
        languageDataEntries,
        elementType: ELEMENT_TYPE_EMBED,
    });
    const isUsingGallery = getDoesSiteHaveElementType({
        languageDataEntries,
        elementType: ELEMENT_TYPE_GALLERY,
    });
    const isUsingMultiLanguage = getIsSiteWithMultipleLanguages({
        languageDataEntries,
    });

    return {
        isOnePageSite,
        isUsingBlog,
        isUsingEcommerce,
        isUsingEmbedCode,
        isUsingGallery,
        isUsingMultiLanguage,
    };
};