import {
    ref
} from 'vue';

const rightClickedGridBlockId = ref(null);
const copiedGridBlockId = ref(null);
const rightClickedElementId = ref(null);
const copiedElementId = ref(null);
const isElementCut = ref(false);

export const useGridContextMenu = () => ({
    rightClickedElementId,
    copiedElementId,
    isElementCut,
    rightClickedGridBlockId,
    copiedGridBlockId,
});