import {
    isAppPrerendering
} from '@zyro-inc/site-modules/utils/prerenderingFlags';
import {
    facebookMessengerScript,
    facebookPixelScript,
    facebookPixelNoScript,
    googleAnalyticsScript,
    googleAnalyticsScriptAsync,
    googleTagManagerScript,
    googleTagManagerNoScript,
    hotjarScript,
    jivoChatScriptAsync,
} from '@zyro-inc/site-modules/utils/integrationScripts';
import {
    FACEBOOOK_MESSENGER_SCRIPT_VERSION
} from '@/components/metas/constants';
import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';
import {
    addElementsToDom
} from '@/utils/addDocumentElements';

export const getIntegrationElements = ({
    siteMeta,
    areCookiesAllowed,
}) => {
    if (isAppPrerendering) return [];

    const integrationElements = {};

    if (areCookiesAllowed && siteMeta.facebookPixel) {
        integrationElements['noscript-fb-pixel'] = {
            tagName: 'noscript',
            children: [{
                type: 'text',
                value: facebookPixelNoScript(siteMeta.facebookPixel),
            }, ],
        };
    }

    if (areCookiesAllowed && siteMeta.googleTagManager) {
        integrationElements['noscript-gtm'] = {
            tagName: 'noscript',
            children: [{
                type: 'text',
                value: googleTagManagerNoScript(siteMeta.googleTagManager),
            }, ],
        };
    }

    if (areCookiesAllowed && siteMeta.facebookPixel) {
        integrationElements['script-fb-pixel'] = {
            tagName: 'script',
            children: [{
                type: 'text',
                value: facebookPixelScript(siteMeta.facebookPixel),
            }, ],
        };
    }

    if (areCookiesAllowed && siteMeta.googleTagManager) {
        integrationElements['script-gtm'] = {
            tagName: 'script',
            children: [{
                type: 'text',
                value: googleTagManagerScript({
                    containerId: siteMeta.googleTagManager,
                }),
            }, ],
        };
    }

    if (areCookiesAllowed && siteMeta.googleAnalytics) {
        integrationElements['script-google-analytics'] = {
            tagName: 'script',
            children: [{
                type: 'text',
                value: googleAnalyticsScript({
                    containerId: siteMeta.googleAnalytics,
                }),
            }, ],
        };

        integrationElements['script-google-analytics-async'] = {
            tagName: 'script',
            properties: {
                src: googleAnalyticsScriptAsync(siteMeta.googleAnalytics),
            },
        };
    }

    if (areCookiesAllowed && siteMeta.hotjar) {
        integrationElements['script-hotjar'] = {
            tagName: 'script',
            children: [{
                type: 'text',
                value: hotjarScript(siteMeta.hotjar),
            }, ],
        };
    }

    if (siteMeta.jivoChat) {
        integrationElements['script-jivochat'] = {
            tagName: 'script',
            properties: {
                src: jivoChatScriptAsync(siteMeta.jivoChat),
            },
        };
    }

    if (siteMeta.facebookMessenger) {
        integrationElements['fb-messenger'] = {
            tagName: 'script',
            children: [{
                type: 'text',
                value: facebookMessengerScript({
                    version: FACEBOOOK_MESSENGER_SCRIPT_VERSION,
                    locale: siteMeta.facebookMessengerLocale,
                }),
            }, ],
        };

        integrationElements['fb-messenger-async'] = {
            tagName: 'script',
            properties: {
                defer: true,
                crossorigin: 'anonymous',
                src: `https://connect.facebook.net/${siteMeta.facebookMessengerLocale}/sdk.js`,
            },
        };
    }

    return Object.entries(integrationElements)
        .map(([
            elementKey,
            {
                tagName,
                properties = {},
                children = [],
            },
        ]) => ({
            type: 'element',
            tagName,
            properties: {
                ...properties,
                [ELEMENT_DATA_ATTRIBUTE]: elementKey,
            },
            children,
        }));
};

export const addIntegrationsElements = ({
    siteMeta
}) => {
    const integrationElements = getIntegrationElements({
        siteMeta,
    });

    addElementsToDom(integrationElements);
};