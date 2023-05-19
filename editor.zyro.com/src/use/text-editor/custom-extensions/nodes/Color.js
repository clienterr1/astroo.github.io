import Color from '@tiptap/extension-color';

import {
    TEXT_EDITOR_NODE_NAME_HEADING,
    TEXT_EDITOR_NODE_NAME_PARAGRAPH,
    TEXT_EDITOR_PROPERTY_TEXT_STYLE,
    TEXT_EDITOR_PROPERTY_LIST_ITEM,
} from '@/constants';

export default Color.extend({
    addOptions() {
        return {
            types: [
                TEXT_EDITOR_NODE_NAME_HEADING,
                TEXT_EDITOR_NODE_NAME_PARAGRAPH,
                TEXT_EDITOR_PROPERTY_TEXT_STYLE,
                TEXT_EDITOR_PROPERTY_LIST_ITEM,
            ],
        };
    },
});