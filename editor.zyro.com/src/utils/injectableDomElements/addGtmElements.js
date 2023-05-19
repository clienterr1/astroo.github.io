import {
    addElementToHead
} from '@zyro-inc/site-modules/utils/addDomElements';
import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';

import {
    googleTagManagerScript,
    googleTagManagerNoScript,
} from '@zyro-inc/site-modules/utils/integrationScripts';

export const addGtmElements = () => {
    const gtmQuery = `+ '&gtm_auth=${import.meta.env.VITE_GTM_AUTH}&gtm_preview=${import.meta.env.VITE_GTM_PREVIEW}&gtm_cookies_win=x'`;
    const googleTagManagerHeadScript = {
        type: 'element',
        tagName: 'script',
        properties: {
            [ELEMENT_DATA_ATTRIBUTE]: 'script-gtm',
        },
        children: [{
            type: 'text',
            value: googleTagManagerScript({
                containerId: import.meta.env.VITE_GTM_ID,
                gtmQuery,
            }),
        }, ],
    };

    const gtmNoScriptQuery = `&gtm_auth=${import.meta.env.VITE_GTM_AUTH}&gtm_preview=${import.meta.env.VITE_GTM_PREVIEW}&gtm_cookies_win=x`;
    const googleTagManagerBodyNoscript = {
        type: 'element',
        tagName: 'noscript',
        properties: {
            [ELEMENT_DATA_ATTRIBUTE]: 'noscript-gtm',
        },
        children: [{
            type: 'text',
            value: googleTagManagerNoScript({
                containerId: import.meta.env.VITE_GTM_ID,
                gtmQuery: gtmNoScriptQuery,
            }),
        }, ],
    };

    addElementToHead(googleTagManagerHeadScript);
    addElementToHead(googleTagManagerBodyNoscript);
};