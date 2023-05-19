import {
    BLOCK_SLOT_FOOTER,
    BLOCK_TYPE_HEADER,
    BLOCK_TYPE_ECOMMERCE_PRODUCT,
    BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
} from '@zyro-inc/site-modules/constants';
import {
    getLanguageSwitcherLanguages
} from '@zyro-inc/site-modules/utils/getLanguageSwitcherLanguages';
import {
    getEcwidPages
} from '@zyro-inc/site-modules/utils/getters/getEcwidPages';

const GLOBAL_BLOCK_TYPES = [
    BLOCK_TYPE_HEADER,
    BLOCK_TYPE_ECOMMERCE_PRODUCT,
    BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
];

export const getPageBlocks = ({
    siteBlocks,
    pageBlocksIds,
}) => Object.fromEntries(Object.entries(siteBlocks).filter(([
    blockId,
    {
        type,
        slot,
    },
]) => {
    const isPageBlock = pageBlocksIds.includes(blockId);
    const isGlobalBlock = GLOBAL_BLOCK_TYPES.includes(type);
    const isFooterBlock = slot === BLOCK_SLOT_FOOTER;

    return isPageBlock || isGlobalBlock || isFooterBlock;
}));

export const getPageElementsFromPageBlocks = ({
    siteElements,
    blocks,
}) => {
    const pageBlocksElementIds = Object.values(blocks).map(({
        components
    }) => components).flatMap((components) => components);

    return Object.fromEntries(Object.entries(siteElements).filter(([elementId]) => pageBlocksElementIds.includes(elementId)));
};

export const getPageData = ({
    siteData,
    locale,
    pageId,
}) => {
    const languageData = siteData.languages[locale];
    const pageData = languageData.pages[pageId];

    if (!pageData) {
        return null;
    }

    const pageBlocks = getPageBlocks({
        siteBlocks: languageData.blocks,
        pageBlocksIds: pageData.blocks,
    });
    const pageElements = getPageElementsFromPageBlocks({
        siteElements: languageData.elements,
        blocks: pageBlocks,
    });

    return {
        pages: languageData.pages,
        blocks: pageBlocks,
        elements: pageElements,
        nav: languageData.nav,
        currentLocale: locale,
        homePageId: languageData.homePageId,
        isNavHidden: languageData.isNavHidden,
        cookieBannerAcceptText: languageData.cookieBannerAcceptText,
        cookieBannerDisclaimer: languageData.cookieBannerDisclaimer,
        cookieBannerDeclineText: languageData.cookieBannerDeclineText,
        metaTitle: languageData.metaTitle,
        meta: siteData.meta,
        forms: siteData.forms,
        styles: siteData.styles,
        domain: siteData.domain,
        siteId: siteData.siteId,
        ecommerceShoppingCart: siteData.ecommerceShoppingCart,
        blogCategories: siteData.blogCategories,
        languageSwitcherLanguages: getLanguageSwitcherLanguages({
            languages: siteData.languages,
            defaultLocale: siteData.meta.defaultLocale,
        }),
        currentPageId: pageId,
        languageKeys: Object.keys(siteData.languages),
        ecwidPages: getEcwidPages({
            pages: languageData.pages,
            blocks: languageData.blocks,
        }) ? ? {},
    };
};