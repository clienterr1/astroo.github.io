import {
    ref
} from 'vue';
import {
    debounce
} from '@zyro-inc/site-modules/utils/debounce';

const isWindowResizing = ref(false);
const RESIZING_CHECK_TIMEOUT_TIME = 200;

const debounceResizingEnd = debounce(() => {
    isWindowResizing.value = false;
}, RESIZING_CHECK_TIMEOUT_TIME);

export const useIsWindowBeingResized = () => {
    const setIsWindowBeingResized = () => {
        isWindowResizing.value = true;

        debounceResizingEnd();
    };

    return {
        isWindowResizing,
        setIsWindowBeingResized,
    };
};