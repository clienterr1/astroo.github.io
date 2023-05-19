import {
    Extension
} from '@tiptap/core';
import '@tiptap/extension-text-style';

export default Extension.create({
    name: 'letterSpacing',

    addOptions() {
        return {
            types: [
                'textStyle',
                'heading',
                'paragraph',
            ],
        };
    },

    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                letterSpacing: {
                    default: null,
                    parseHTML: (element) => element.style.letterSpacing.replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.letterSpacing) {
                            return {};
                        }

                        return {
                            style: `letter-spacing: ${attributes.letterSpacing}`,
                        };
                    },
                },
            },
        }, ];
    },

    addCommands() {
        return {
            setMarkLetterSpacing: (letterSpacing) => ({
                    chain
                }) => chain()
                .setMark('textStyle', {
                    letterSpacing,
                })
                .run(),
            unsetMarkLetterSpacing: () => ({
                    chain
                }) => chain()
                .setMark('textStyle', {
                    letterSpacing: null,
                })
                .removeEmptyTextStyle()
                .run(),
        };
    },
});