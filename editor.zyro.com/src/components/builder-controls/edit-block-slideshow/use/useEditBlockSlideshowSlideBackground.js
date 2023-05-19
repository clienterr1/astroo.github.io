import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    useEditBlockSlideshow
} from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshow';

export const useEditBlockSlideshowSlideBackground = (props, context) => {
    const {
        dispatch
    } = useStore();
    const {
        websiteBlocks,
        currentSlideshowSlideId,
    } = useEditBlockSlideshow(props, context);

    const currentSlideshowSlideBackground = computed(
        () => websiteBlocks.value[currentSlideshowSlideId.value].background ? ? {
            color: 'rgb(255, 255, 255)',
            current: 'color',
        },
    );

    const setSlideBackground = (background) => {
        dispatch('updateBlockData', {
            blockId: currentSlideshowSlideId.value,
            blockData: {
                background,
            },
            merge: true,
        });
    };

    return {
        currentSlideshowSlideBackground,
        setSlideBackground,
    };
};