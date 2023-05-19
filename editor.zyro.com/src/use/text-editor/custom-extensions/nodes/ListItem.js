import ListItem from '@tiptap/extension-list-item';

export default ListItem.extend({
    content: '(paragraph|heading) block*',
});