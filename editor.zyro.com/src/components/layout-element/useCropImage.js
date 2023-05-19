import {
    ref,
    computed,
} from 'vue';
import {
    useStore
} from 'vuex';

const croppedImageId = ref(null);
const cropScale = ref(null);

export const useCropImage = () => {
    const {
        getters
    } = useStore();
    const siteElements = computed(() => getters.siteElements);

    const exitCropMode = () => {
        croppedImageId.value = null;
        cropScale.value = null;
    };

    const enterCropMode = (id) => {
        croppedImageId.value = id;
        cropScale.value = Number.parseFloat(siteElements.value[id].desktop.crop ? .scale) || 1;
    };

    return {
        croppedImageId: computed(() => croppedImageId.value),
        cropScale,
        exitCropMode,
        enterCropMode,
    };
};