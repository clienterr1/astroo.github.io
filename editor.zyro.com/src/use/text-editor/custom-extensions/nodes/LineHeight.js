import {
    Extension
} from '@tiptap/core';

import '@tiptap/extension-text-style';
import {
    TEXT_EDITOR_NODE_NAME_HEADING,
    TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';

const LINE_HEIGHT_MOBILE_VAR = '--lineHeightMobile';
const LINE_HEIGHT_DESKTOP_VAR = '--lineHeightDesktop';

export default Extension.create({
    name: 'lineHeight',

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
                lineHeightMobile: {
                    parseHTML: (element) => element.style.getPropertyValue(LINE_HEIGHT_MOBILE_VAR).replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.lineHeightMobile) {
                            return {};
                        }

                        return {
                            style: `${LINE_HEIGHT_MOBILE_VAR}: ${attributes.lineHeightMobile}`,
                        };
                    },
                },
                lineHeightDesktop: {
                    parseHTML: (element) => element.style.getPropertyValue(LINE_HEIGHT_DESKTOP_VAR).replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.lineHeightDesktop) {
                            return {};
                        }

                        return {
                            style: `${LINE_HEIGHT_DESKTOP_VAR}: ${attributes.lineHeightDesktop}`,
                        };
                    },
                },
            },
        }, ];
    },

    addCommands() {
        return {
            setLineHeight: (lineHeight, isMobileMode) => ({
                chain
            }) => {
                const newLineHeight = isMobileMode ? {
                    lineHeightMobile: lineHeight,
                } : {
                    lineHeightDesktop: lineHeight,
                };

                return chain()
                    .setMark('textStyle', newLineHeight)
                    .run();
            },
        };
    },
});