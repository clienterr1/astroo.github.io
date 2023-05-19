import {
    getOptimizedSrc
} from '@zyro-inc/site-modules/utils/getSrcsets';
import {
    isAppPrerendering
} from '@zyro-inc/site-modules/utils/prerenderingFlags';
import {
    getIsInIframe
} from '@zyro-inc/site-modules/utils/getIsInIframe';
import {
    DEFAULT_HTML_LANG_VALUE,
    SYSTEM_LOCALE,
    PREVIEW_SUBDOMAINS,
} from '@zyro-inc/site-modules/constants';

import {
    DEFAULT_FAVICON,
    ZYROSITE_SUBDOMAINS,
} from '@/components/metas/constants';
import {
    FONT_TYPE_CUSTOM,
    FONT_TYPE_GOOGLE,
} from '@zyro-inc/site-modules/utils/font';

export const getHrefLangLinks = ({
    locales,
    defaultLocale,
    url,
}) => {
    if (!locales.length) {
        return [{
            href: url,
            hreflang: 'x-default',
            rel: 'alternate',
        }, ];
    }

    return locales.map((locale) => {
        const isDefaultLocale = locale === defaultLocale;

        return {
            href: isDefaultLocale ? url : `${url}${locale}`,
            hreflang: isDefaultLocale ? 'x-default' : locale,
            rel: 'alternate',
        };
    });
};

export const getCanonicalUrlFromWindow = ({
    domain
}) => (
    domain ? window.location.href.replace(window.location.host, domain) : window.location.href
);

export const getStaticHeadData = ({
    currentPageData,
    blocks,
    elements,
    meta,
    currentLocale,
    canonicalUrl,
    siteId,
    languageMetaTitle,
}) => {
    const pageBlocks = currentPageData ? .blocks.reduce((blocksArray, blockId) => [
        ...blocksArray,
        blocks[blockId],
    ], []);

    const pageElements = pageBlocks ? .reduce((allElements, block) => [
        ...allElements,
        ...(block ? .components ? .map((elementId) => elements[elementId]) ? ? []),
    ], []);

    const pageVideoElements = pageElements ? .filter((elementData) => elementData ? .type === 'GridVideo');

    const hasMatchingVideoSrc = (text) => pageVideoElements ? .some((elementData) => elementData ? .settings ? .src.includes(text));

    const {
        faviconOrigin,
        faviconPath,
        metaHtmlLanguage,
        metaTitle: siteMetaTitle,
        ogImageOrigin: siteOgImageOrigin,
        ogImagePath: siteOgImagePath,
        ogImageAlt: siteOgImageAlt,
    } = meta;

    const {
        name: pageName,
        meta: pageMeta,
    } = currentPageData ? ? {};

    const {
        title: pageMetaTitle,
        description: pageMetaDescription,
        keywords: pageKeywords,
        ogImageOrigin: pageOgImageOrigin,
        ogImagePath: pageOgImagePath,
        ogImageAlt: pageOgImageAlt,
        noindex: pageNoindex,
    } = pageMeta ? ? {};

    // siteName is used both as a suffix for page title and also as meta og tag

    const siteName = languageMetaTitle || siteMetaTitle;
    const pageTitle = pageMetaTitle || pageName;
    const title = siteName ? `${pageTitle} | ${siteName}` : pageTitle;

    const currentSeoLocale = currentLocale === SYSTEM_LOCALE ? undefined : currentLocale;

    const lang = currentSeoLocale || metaHtmlLanguage || DEFAULT_HTML_LANG_VALUE.value;

    const ogImageOrigin = pageOgImageOrigin || siteOgImageOrigin;
    const ogImagePath = pageOgImagePath || siteOgImagePath;
    const ogImageAlt = pageOgImageAlt || siteOgImageAlt;

    const ogImageUrl = getOptimizedSrc(ogImageOrigin, ogImagePath, siteId, {
        width: 1200,
        height: 630,
        format: 'jpeg',
    });

    const faviconUrl = getOptimizedSrc(faviconOrigin, faviconPath, siteId, {
        width: 32,
        height: 32,
        format: 'png',
    }) ? ? DEFAULT_FAVICON;

    return {
        title,
        description: pageMetaDescription,
        keywords: pageKeywords,
        lang,
        siteName,
        ogImageAlt,
        ogImageUrl,
        faviconUrl,
        canonicalUrl,
        pageNoindex,
        hasEcwid: pageBlocks ? .some((elementData) => elementData ? .type === 'BlockEcwidStore'),
        hasInstagram: pageElements ? .some((elementData) => elementData ? .type === 'GridInstagramFeed'),
        hasMap: pageElements ? .some((elementData) => elementData ? .type === 'GridMap'),
        hasVimeo: hasMatchingVideoSrc('vimeo.com'),
        hasYoutube: hasMatchingVideoSrc('youtube.com'),
        hasMessenger: !!meta.facebookMessenger,
    };
};

export const getClientHeadData = ({
    domain,
    pageNoindex,
}) => {
    const isSiteEngineOrigin = window.origin.includes(
        import.meta.env.VITE_PREVIEW_URL);
    const isFreeDomainOrigin = ZYROSITE_SUBDOMAINS.some((zyrositeDomain) => window.origin.includes(zyrositeDomain));
    const isPreviewDomainOrigin = PREVIEW_SUBDOMAINS.some((previewDomain) => window.origin.includes(previewDomain));
    const noindex = !!pageNoindex || ((isFreeDomainOrigin || isPreviewDomainOrigin) && !isAppPrerendering);

    const shouldRedirectToCanonical =
        import.meta.env.PROD &&
        domain &&
        domain !== window.location.hostname &&
        !isFreeDomainOrigin &&
        !isPreviewDomainOrigin &&
        !isAppPrerendering &&
        !getIsInIframe() &&
        !isSiteEngineOrigin;

    return {
        shouldRedirectToCanonical,
        noindex,
    };
};

export const getHeadData = ({
    currentPageData,
    blocks,
    elements,
    meta,
    currentLocale,
    domain,
    siteId,
    canonicalUrl,
    languageMetaTitle,
}) => {
    const staticHeadData = getStaticHeadData({
        currentPageData,
        blocks,
        elements,
        meta,
        currentLocale,
        domain,
        siteId,
        languageMetaTitle,
        canonicalUrl,
    });
    const clientHeadData = getClientHeadData({
        domain,
        pageNoindex: staticHeadData.pageNoindex,
    });

    return {
        ...staticHeadData,
        ...clientHeadData,
    };
};

export const getFontsData = ({
    fonts
}) => {
    const googleFontsRaw = fonts.filter(({
        type,
        weights,
    }) => type === FONT_TYPE_GOOGLE && weights.length) || [];
    const googleFonts = googleFontsRaw.map((font) => ({
        ...font,
        weights: [
            ...new Set([
                '400',
                ...font.weights.map((weight) => weight.toString()),
            ]),
        ],
    }));
    const customFonts = fonts.filter(({
        type
    }) => type === FONT_TYPE_CUSTOM) || [];

    return {
        googleFonts,
        customFonts,
    };
};