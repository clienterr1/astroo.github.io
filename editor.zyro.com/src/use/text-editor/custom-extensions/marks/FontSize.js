import {
    Extension
} from '@tiptap/core';

import '@tiptap/extension-text-style';
import {
    TEXT_EDITOR_NODE_NAME_HEADING,
    TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';

const FONT_SIZE_MOBILE_VAR = '--fontSizeMobile';
const FONT_SIZE_DESKTOP_VAR = '--fontSizeDesktop';

export default Extension.create({
    name: 'fontSize',

    addOptions() {
        return {
            types: [
                TEXT_EDITOR_NODE_NAME_HEADING,
                TEXT_EDITOR_NODE_NAME_PARAGRAPH,
                'textStyle',
            ],
        };
    },

    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontSizeMobile: {
                    parseHTML: (element) => element.style.getPropertyValue(FONT_SIZE_MOBILE_VAR).replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.fontSizeMobile) {
                            return {};
                        }

                        return {
                            style: `${FONT_SIZE_MOBILE_VAR}: ${attributes.fontSizeMobile}`,
                        };
                    },
                },
                fontSizeDesktop: {
                    parseHTML: (element) => element.style.getPropertyValue(FONT_SIZE_DESKTOP_VAR).replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.fontSizeDesktop) {
                            return {};
                        }

                        return {
                            style: `${FONT_SIZE_DESKTOP_VAR}: ${attributes.fontSizeDesktop}`,
                        };
                    },
                },
            },
        }, ];
    },

    addCommands() {
        return {
            setMarkFontSize: (fontSize, isMobileMode) => ({
                chain
            }) => {
                const newFontSize = isMobileMode ? {
                    fontSizeMobile: fontSize,
                } : {
                    fontSizeDesktop: fontSize,
                };

                return chain()
                    .setMark('textStyle', newFontSize)
                    .run();
            },

            unsetMarkFontSize: () => ({
                    chain
                }) => chain()
                .setMark('textStyle', {
                    fontSizeMobile: null,
                    fontSizeDesktop: null,
                })
                .removeEmptyTextStyle()
                .run(),
        };
    },
});