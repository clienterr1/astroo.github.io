import {
    Editor
} from '@tiptap/vue-3';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import FontFamily from '@tiptap/extension-font-family';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import OrderedList from '@tiptap/extension-ordered-list';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

import {
    ref,
    computed,
} from 'vue';

import {
    Link,
    LetterCase,
    LetterSpacing,
    Heading,
    Paragraph,
    ListItem,
    FontSize,
    MarginBottom,
    FontWeight,
    Bold,
    LineHeight,
    Color,
} from '@/use/text-editor/custom-extensions/extensions';

import {
    TEXT_EDITOR_NODE_NAME_HEADING,
    TEXT_EDITOR_NODE_NAME_PARAGRAPH,
} from '@/constants';

import {
    rehype
} from 'rehype';
import {
    visit
} from 'unist-util-visit';
import {
    REHYPE_SETTINGS
} from '@zyro-inc/site-modules/constants/rehypeSettings';
import styleToObject from 'style-to-object';

// Removes width & height affecting styling because it conflicts with our native Layout element size logic
const removeSizeStyling = () => (tree) => {
    visit(tree, 'element', (node) => {
        if (!node.properties ? .style) return;

        const {
            width,
            'max-width': maxWidth,
            'min-width': minWidth,
            height,
            'max-height': maxHeight,
            'min-height': minHeight,
            ...restStyles
        } = styleToObject(node.properties.style);

        const cssStyles = Object.entries(restStyles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');

        // eslint-disable-next-line no-param-reassign
        node.properties.style = cssStyles;
    });
};

const config = {
    useBuiltInExtensions: false,
    editorProps: {
        transformPastedText(text) {
            // \u00A0 is unicode value for non-breaking space
            return text.replace(/\u00A0/g, ' ');
        },
        transformPastedHTML(html) {
            const cleanedHtml = rehype()
                .data('settings', REHYPE_SETTINGS)
                .use(removeSizeStyling)
                .processSync(html)
                .toString();

            // \u00A0 is unicode value for non-breaking space
            return cleanedHtml.replace(/\u00A0/g, ' ');
        },
    },
    parseOptions: {
        preserveWhitespace: true,
    },
    extensions: [
        Document,
        Text,
        Heading,
        Paragraph,
        HardBreak,
        TextStyle,
        Color,
        Bold,
        Italic,
        Underline,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        LineHeight,
        History,
        LetterCase,
        LetterSpacing,
        FontSize,
        FontFamily,
        FontWeight,
        MarginBottom,
    ],
};

const editor = ref(null);

export const useTextEditor = () => {
    const initializeEditor = (content) => {
        editor.value = new Editor({
            ...config,
            content,
        });
    };

    const removeEditor = () => {
        editor.value = null;
    };

    // Text editor utils
    const isAllTextNodeSelected = computed(() => {
        if (!editor.value.view ? .state ? .selection) {
            return false;
        }

        const {
            $anchor,
            $head,
        } = editor.value.view.state.selection;

        const allContentSelectedFromLeftToRight = $anchor.parentOffset === 0 && $head.parentOffset === $head.parent.content.size;
        const allContentSelectedFromRightToLeft = $head.parentOffset === 0 && $anchor.parentOffset === $anchor.parent.content.size;

        return allContentSelectedFromLeftToRight || allContentSelectedFromRightToLeft;
    });

    const getInlineStyleValue = (customStyleAttribute) => {
        if (!editor.value) {
            return null;
        }

        return editor.value.getAttributes('textStyle')[customStyleAttribute] || editor.value.getAttributes(TEXT_EDITOR_NODE_NAME_PARAGRAPH)[customStyleAttribute] || editor.value.getAttributes(TEXT_EDITOR_NODE_NAME_HEADING)[customStyleAttribute] || null;
    };

    const setCaretPositionToEnd = () => {
        editor.value.commands.focus('end');
    };

    const insertHTMLToEnd = (content) => {
        editor.value.commands.setContent(`${editor.value.getHTML()}${content}`);
    };

    return {
        editor,
        initializeEditor,
        removeEditor,
        setCaretPositionToEnd,
        insertHTMLToEnd,
        isAllTextNodeSelected,
        getInlineStyleValue,
    };
};