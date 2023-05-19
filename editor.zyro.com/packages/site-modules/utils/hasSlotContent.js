import {
    Comment
} from 'vue';

export const hasSlotContent = (slot, slotProps = {}) => {
    if (!slot) return false;

    return slot(slotProps).some((vnode) => {
        if (Array.isArray(vnode.children)) {
            return !!vnode.children.length;
        }

        return vnode.type !== Comment;
    });
};