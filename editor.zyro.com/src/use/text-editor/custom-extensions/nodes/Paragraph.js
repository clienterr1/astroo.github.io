import Paragraph from '@tiptap/extension-paragraph';

import {
    TEXT_EDITOR_CLASS_BODY,
    TEXT_EDITOR_NODE_NAME_PARAGRAPH,
    TEXT_EDITOR_SUPPORTED_PARAGRAPH_CLASSES,
} from '@/constants';

export default Paragraph.extend({
    name: TEXT_EDITOR_NODE_NAME_PARAGRAPH,

    addAttributes() {
        return {
            className: {
                default: TEXT_EDITOR_CLASS_BODY,
                parseHTML: (element) => element.getAttribute('class'),
                renderHTML: (attributes) => {
                    if (!attributes.className || !TEXT_EDITOR_SUPPORTED_PARAGRAPH_CLASSES.includes(attributes.className)) {
                        return {
                            class: TEXT_EDITOR_CLASS_BODY,
                        };
                    }

                    return {
                        class: attributes.className,
                    };
                },
            },
        };
    },

    addCommands() {
        return {
            setParagraph: (attributes) => ({
                commands
            }) => commands.setNode(TEXT_EDITOR_NODE_NAME_PARAGRAPH, attributes),
        };
    },
});