import {
    bootIntercom
} from '@/utils/intercomIntegration';
import {
    addElementToBody
} from '@zyro-inc/site-modules/utils/addDomElements';
import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';

export const addIntercomScript = ({
    intercomUserData
}) => {
    const intercomScriptNode = {
        type: 'element',
        tagName: 'script',
        properties: {
            src: `https://widget.intercom.io/widget/${import.meta.env.VITE_INTERCOM_APP_ID}`,
            [ELEMENT_DATA_ATTRIBUTE]: 'intercom-integration',
        },
    };

    const intercomElement = addElementToBody(intercomScriptNode);

    intercomElement.addEventListener('load', () => {
        bootIntercom(intercomUserData);
    });
};