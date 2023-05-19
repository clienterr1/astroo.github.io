import Link from '@tiptap/extension-link';
import {
    TEXT_EDITOR_DATA_ATTRIBUTE_LINKED_PAGE_ID
} from '@/constants';

export default Link.extend({
    addOptions() {
        return {
            ...Link.options,
            openOnClick: false,
            autolink: false,
        };
    },
    priority: 99,
    addAttributes() {
        return {
            ...this.parent ? .(),
            rel : {
                default: null,
            },
            title: {
                default: null,
            },
            download: {
                default: null,
            },
            style: {
                default: null,
            },
            [TEXT_EDITOR_DATA_ATTRIBUTE_LINKED_PAGE_ID]: {
                default: null,
            },
        };
    },
});