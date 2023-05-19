import {
    computed,
    ref,
} from 'vue';

const popupComponentHistory = ref([]);

export const useEditBlockImageSlideshow = (props, context) => {
    const currentEditBlockSlideshowComponent = computed(
        () => popupComponentHistory.value[popupComponentHistory.value.length - 1] ? ? null,
    );

    const closeEditBlockSlideshowComponent = () => {
        popupComponentHistory.value.pop();

        if (popupComponentHistory.value.length === 0) {
            context.emit('close');
        }
    };

    const setEditBlockSlideshowComponent = (component) => {
        popupComponentHistory.value.push(component);
    };

    return {
        currentEditBlockSlideshowComponent,
        setEditBlockSlideshowComponent,
        closeEditBlockSlideshowComponent,
    };
};