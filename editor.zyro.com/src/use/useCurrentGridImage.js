import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    useCurrentElementRef
} from '@/use/useCurrentElementRef';

import {
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';

export const useCurrentGridImage = () => {
    const {
        getters,
        dispatch,
    } = useStore();
    const {
        currentElementRef
    } = useCurrentElementRef();
    const currentElement = computed(() => getters.currentElement);
    const isMobileMode = computed(() => getters['gui/isMobileMode']);

    const elementPositionKey = computed(() => (isMobileMode.value ? ELEMENT_POSITION_KEY_MOBILE : ELEMENT_POSITION_KEY_DESKTOP));

    const resetProportions = () => {
        const currentGridImage = currentElementRef.value.querySelector('img');
        const {
            naturalWidth,
            naturalHeight,
        } = currentGridImage;

        const aspectRatio = naturalWidth / naturalHeight;

        dispatch('mergeCurrentElementData', {
            elementData: {
                [elementPositionKey.value]: {
                    height: Math.round(currentElement.value[elementPositionKey.value].width / aspectRatio),
                },
            },
            pushToHistory: true,
        });
    };

    return {
        resetProportions,
    };
};