import Bold from '@tiptap/extension-bold';

export default Bold.extend({
    parseHTML() {
        return [{
                tag: 'strong',
            },
            {
                tag: 'b',
                getAttrs: (node) => node.style.fontWeight !== 'normal' && null,
            },
        ];
    },
});