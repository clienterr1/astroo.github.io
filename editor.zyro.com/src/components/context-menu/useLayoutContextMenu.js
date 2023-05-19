import {
    ref
} from 'vue';

const selectedLayoutBlockId = ref(null);
const copiedLayoutBlockId = ref(null);
const selectedLayoutElementId = ref(null);
const copiedElementId = ref(null);
const isElementCut = ref(false);

export const useLayoutContextMenu = () => ({
    selectedLayoutBlockId,
    copiedLayoutBlockId,
    selectedLayoutElementId,
    copiedElementId,
    isElementCut,
});