import {
    Extension
} from '@tiptap/core';
import '@tiptap/extension-text-style';

export default Extension.create({
    name: 'fontWeight',

    addOptions() {
        return {
            types: ['textStyle'],
        };
    },

    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                fontWeight: {
                    default: null,
                    parseHTML: (element) => element.style.fontWeight.replace(/["']+/g, ''),
                    renderHTML: (attributes) => {
                        if (!attributes.fontWeight) {
                            return {};
                        }

                        return {
                            style: `font-weight: ${attributes.fontWeight}`,
                        };
                    },
                },
            },
        }, ];
    },

    addCommands() {
        return {
            setFontWeight: (fontWeight) => ({
                    chain
                }) => chain()
                .setMark('textStyle', {
                    fontWeight,
                })
                .run(),
            unsetFontWeight: () => ({
                    chain
                }) => chain()
                .setMark('textStyle', {
                    fontWeight: null,
                })
                .removeEmptyTextStyle()
                .run(),
        };
    },
});