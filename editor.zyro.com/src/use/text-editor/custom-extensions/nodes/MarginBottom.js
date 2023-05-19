import {
    Extension
} from '@tiptap/core';

import '@tiptap/extension-text-style';
import {
    TEXT_EDITOR_NODE_NAME_HEADING,
    TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';

export default Extension.create({
    name: 'marginBottom',

    addOptions() {
        return {
            types: [
                TEXT_EDITOR_NODE_NAME_HEADING,
                TEXT_EDITOR_NODE_NAME_PARAGRAPH,
            ],
        };
    },

    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                marginBottom: {
                    default: null,
                    parseHTML: (element) => element.style.marginBottom.replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.marginBottom) {
                            return {};
                        }

                        return {
                            style: `margin-bottom: ${attributes.marginBottom}`,
                        };
                    },
                },
            },
        }, ];
    },
});