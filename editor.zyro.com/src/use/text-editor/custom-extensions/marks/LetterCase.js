import {
    Extension
} from '@tiptap/core';

import {
    TEXT_EDITOR_PROPERTY_LETTERCASE_MARK
} from '@/constants';

export default Extension.create({
    name: TEXT_EDITOR_PROPERTY_LETTERCASE_MARK,

    addOptions() {
        return {
            types: ['textStyle'],
        };
    },

    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                [TEXT_EDITOR_PROPERTY_LETTERCASE_MARK]: {
                    default: null,
                    renderHTML: (attributes) => {
                        if (!attributes.letterCase) {
                            return {};
                        }

                        return {
                            style: `text-transform: ${attributes.letterCase}`,
                        };
                    },
                    parseHTML: (element) => element.style.textTransform.replace(/["']+/g, ''),
                },
            },
        }, ];
    },

    addCommands() {
        return {
            toggleLetterCase: (letterCase) => ({
                commands
            }) => commands.toggleMark('textStyle', {
                letterCase,
            }),
        };
    },
});