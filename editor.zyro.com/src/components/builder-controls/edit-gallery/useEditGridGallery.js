import {
    ref
} from 'vue';

const showGalleryManager = ref(false);

export const useEditGridGallery = () => ({
    showGalleryManager,
});