import {
    isAppPrerendering,
    isAppHydrating,
} from '@zyro-inc/site-modules/utils/prerenderingFlags';
import {
    addCustomElements
} from '@zyro-inc/site-modules/utils/customElements';
import {
    bustImageUrlCache
} from '@/utils/bustImageUrlCache';

import {
    addCustomFontsFontFaces,
    constructGoogleFontsHref,
} from '@zyro-inc/site-modules/utils/font';
import {
    PRECONNECT_ECWID,
    PRECONNECT_YOUTUBE,
    PRECONNECT_VIMEO,
    PRECONNECT_MAP,
    PRECONNECT_INSTAGRAM,
} from '@/components/metas/constants';
import {
    getIntegrationElements
} from '@/utils/getIntegrationElements';
import {
    addElementToBody,
    addElementToHead,
} from '@zyro-inc/site-modules/utils/addDomElements';
import {
    getHrefLangLinks,
    getFontsData,
} from '@/components/metas/getHeadData';
import {
    BODY_ELEMENTS_BY_ELEMENT_ID,
    ELEMENT_DATA_ATTRIBUTE,
} from '@zyro-inc/site-modules/constants';

export const addElementsToDom = (elements) => {
    elements.forEach((element) => {
        if (BODY_ELEMENTS_BY_ELEMENT_ID.includes(element.properties[ELEMENT_DATA_ATTRIBUTE])) {
            return addElementToBody(element);
        }

        return addElementToHead(element);
    });
};

const getPreconnectLinkElements = ({
    hasEcwid,
    hasYoutube,
    hasVimeo,
    hasMap,
    hasInstagram,
}) => {
    const preconnectLinks = [
        import.meta.env.VITE_ASSETS_ORIGIN,
        ...(hasEcwid ? PRECONNECT_ECWID : []),
        ...(hasYoutube ? PRECONNECT_YOUTUBE : []),
        ...(hasVimeo ? PRECONNECT_VIMEO : []),
        ...(hasMap ? PRECONNECT_MAP : []),
        ...(hasInstagram ? PRECONNECT_INSTAGRAM : []),
    ];

    return preconnectLinks.map((href) => ({
        type: 'element',
        tagName: 'link',
        properties: {
            rel: 'preconnect',
            href,
            [ELEMENT_DATA_ATTRIBUTE]: href,
        },
    }));
};

const getGenericHeadElements = (headData) => {
    const {
        title,
        description,
        keywords,
        siteName,
        ogImageAlt,
        ogImageUrl,
        faviconUrl,
        shouldRedirectToCanonical,
        canonicalUrl,
        noindex,
    } = headData;

    const headElements = {
        title: {
            tagName: 'title',
            children: [{
                type: 'text',
                value: title,
            }, ],
        },
        'og:title': {
            tagName: 'meta',
            properties: {
                content: title,
                property: 'og:title',
            },
        },
        'og:type': {
            tagName: 'meta',
            properties: {
                content: 'website',
                property: 'og:type',
            },
        },
        'og:url': {
            tagName: 'meta',
            properties: {
                content: canonicalUrl,
                property: 'og:url',
            },
        },
        canonical: {
            tagName: 'link',
            properties: {
                rel: 'canonical',
                href: canonicalUrl,
            },
        },
        'twitter:card': {
            tagName: 'meta',
            properties: {
                name: 'twitter:card',
                content: 'summary_large_image',
            },
        },
        'twitter:title': {
            tagName: 'meta',
            properties: {
                name: 'twitter:title',
                content: title,
            },
        },
        favicon: {
            tagName: 'link',
            properties: {
                rel: 'icon',
                href: faviconUrl,
            },
        },
        'apple-touch-icon': {
            tagName: 'link',
            properties: {
                rel: 'apple-touch-icon',
                href: faviconUrl,
            },
        },
        wappalyzer: {
            tagName: 'meta',
            properties: {
                name: 'generator',
                content: 'Hostinger Website builder',
            },
        },
    };

    if (siteName) {
        headElements['og:site_name'] = {
            tagName: 'meta',
            properties: {
                content: siteName,
            },
        };
    }

    if (description) {
        headElements.description = {
            tagName: 'meta',
            properties: {
                name: 'description',
                content: description,
            },
        };

        headElements['og:description'] = {
            tagName: 'meta',
            properties: {
                content: description,
                property: 'og:description',
            },
        };

        headElements['twitter:description'] = {
            tagName: 'meta',
            properties: {
                name: 'twitter:description',
                content: description,
            },
        };
    }

    if (keywords && keywords.length) {
        headElements.keywords = {
            tagName: 'meta',
            properties: {
                name: 'keywords',
                content: keywords.join(', '),
            },
        };
    }

    if (ogImageUrl) {
        headElements['og:image'] = {
            tagName: 'meta',
            properties: {
                content: bustImageUrlCache(ogImageUrl),
                property: 'og:image',
            },
        };
        headElements['og:image:alt'] = {
            tagName: 'meta',
            properties: {
                content: ogImageAlt,
            },
        };
        headElements['twitter:image'] = {
            tagName: 'meta',
            properties: {
                name: 'twitter:image',
                content: bustImageUrlCache(ogImageUrl),
            },
        };
        headElements['twitter:image:alt'] = {
            // twitter:image:alt should be always last as it breaks other metas on iMessage
            tagName: 'meta',
            properties: {
                name: 'twitter:image:alt',
                content: ogImageAlt,
            },
        };
    }

    if (noindex) {
        headElements.robots = {
            tagName: 'meta',
            properties: {
                name: 'robots',
                content: 'noindex',
            },
        };
    }

    // We redirect to the canonical URL of the page if site is accessed NOT via
    // zyro subdomain and domain does not match the hostname
    // (for ex., domain = 'domain.com', but site is accessed via 'www.domain.com' -> we redirect to 'domain.com')
    // As well, we do not generate the redirect during prerender - so prerender would work properly
    // (for ex., custom domain starts to redirect to zyro subdomain)
    if (shouldRedirectToCanonical) {
        headElements['http-equiv'] = {
            tagName: 'meta',
            properties: {
                'http-equiv': 'refresh',
                content: `0; url=${canonicalUrl}`,
            },
        };
    }

    return Object.entries(headElements).map(([
        elementKey,
        {
            tagName,
            properties,
            children,
        },
    ]) => ({
        type: 'element',
        tagName,
        properties: {
            ...properties,
            [ELEMENT_DATA_ATTRIBUTE]: elementKey,
        },
        children: children ? ? [],
    }));
};

const getGoogleFontLinkElements = (href) => {
    const googleFontsLinkElementData = {
        'gstatic-preconnect': {
            tagName: 'link',
            properties: {
                href: import.meta.env.VITE_CDN_ORIGIN,
                rel: 'preconnect',
                crossorigin: true,
            },
        },
        'google-fonts-preload': {
            tagName: 'link',
            properties: {
                href,
                rel: 'preload',
                as: 'style',
            },
        },
        'google-fonts-stylesheet': {
            tagName: 'link',
            properties: {
                href,
                rel: 'stylesheet',
                referrerpolicy: 'no-referrer',
            },
        },
    };

    return Object.entries(googleFontsLinkElementData).map(([
        elementKey,
        {
            tagName,
            properties,
        },
    ]) => ({
        type: 'element',
        tagName,
        properties: {
            ...properties,
            [ELEMENT_DATA_ATTRIBUTE]: elementKey,
        },
    }));
};

export const getHrefLangLinkElements = ({
    locales,
    defaultLocale,
    url,
}) => {
    const hrefLangLinks = getHrefLangLinks({
        locales,
        defaultLocale,
        url,
    });

    return hrefLangLinks.map((link) => ({
        type: 'element',
        tagName: 'link',
        properties: {
            rel: link.rel,
            hreflang: link.hreflang,
            href: link.href,
        },
    }));
};

export const addIntegrationElements = ({
    siteMeta,
    areCookiesAllowed,
}) => {
    const integrationElements = getIntegrationElements({
        siteMeta,
        areCookiesAllowed,
    });

    addElementsToDom(integrationElements);
};

export const addDocumentElements = ({
    meta,
    languageKeys,
    headData,
    fonts,
    siteId,
    areCookiesAllowed,
}) => {
    const {
        googleFonts,
        customFonts,
    } = getFontsData({
        fonts,
    });

    let googleFontLinkElements = [];

    if (googleFonts.length > 0) {
        const googleFontFacesHref = constructGoogleFontsHref({
            googleFonts,
            origin: import.meta.env.VITE_CDN_ORIGIN,
        });

        googleFontLinkElements = getGoogleFontLinkElements(googleFontFacesHref);
    }

    if (customFonts.length > 0) {
        addCustomFontsFontFaces({
            customFonts,
            siteId,
        });
    }

    const hrefLangLocales = languageKeys.filter((locale) => locale !== 'system');
    const {
        defaultLocale
    } = meta;
    const {
        canonicalUrl
    } = headData;

    const headElements = [
        ...getPreconnectLinkElements(headData),
        ...getHrefLangLinkElements({
            locales: hrefLangLocales,
            defaultLocale,
            url: canonicalUrl,
        }),
        ...getGenericHeadElements(headData),
        ...googleFontLinkElements,
    ];

    addIntegrationElements({
        siteMeta: meta,
        areCookiesAllowed,
    });
    addElementsToDom(headElements);

    // custom elements should be added to </head> and </body> only during preview or in SPA mode
    // otherwise, scripts could be injected and executed multiple times
    if (!isAppPrerendering && !isAppHydrating && meta ? .customMeta) {
        addCustomElements(meta.customMeta);
    }

    document.documentElement.setAttribute('lang', headData.lang);
};