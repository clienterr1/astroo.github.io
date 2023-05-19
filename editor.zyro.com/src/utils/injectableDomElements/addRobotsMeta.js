import {
    addElementToHead
} from '@zyro-inc/site-modules/utils/addDomElements';
import {
    ELEMENT_DATA_ATTRIBUTE
} from '@zyro-inc/site-modules/constants';

export const addRobotsMeta = () => {
    const elementNode = {
        type: 'element',
        tagName: 'meta',
        properties: {
            name: 'robots',
            content: 'noindex',
            [ELEMENT_DATA_ATTRIBUTE]: 'robots',
        },
    };

    addElementToHead(elementNode);
};