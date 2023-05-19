import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    DIRECTION_LEFT,
    DIRECTION_RIGHT,
    useBlockSlideshow,
} from '@zyro-inc/site-modules/components/blocks/slideshow/useBlockSlideshow';

const popupComponentHistory = ref([]);

export const useEditBlockSlideshow = (props, context) => {
    const {
        state,
        getters,
    } = useStore();
    const {
        setActiveSlide,
        setSlidingDirection,
        activeSlidesTransitioning,
        activeSlides,
    } = useBlockSlideshow(props);

    const currentEditBlockSlideshowComponent = computed(
        () => popupComponentHistory.value[popupComponentHistory.value.length - 1] ? ? null,
    );

    const currentBlockId = computed(() => state.currentBlockId);

    const currentBlock = computed(() => getters.currentBlock);

    const websiteBlocks = computed(() => getters.siteBlocks);

    const currentSlideshowSlideId = computed(() => activeSlides.value[currentBlockId.value]);

    const currentSlideshowSlidesCount = computed(() => currentBlock.value.slides.length);

    const currentSlideshowSlideName = computed(
        () => currentBlock.value.slides.find((slide) => slide
            .blockId === activeSlides.value[currentBlockId.value]) ? .name ? ? currentBlock.value.slides[0].name,
    );

    const isCurrentSlideshowTransitioning = computed(
        () => activeSlidesTransitioning.value[currentBlockId.value],
    );

    const currentSlideshowActiveSlideIndex = computed(() => {
        const activeSlideIndex = websiteBlocks.value ? .[currentBlockId.value] ? .slides.findIndex(
            (slide) => activeSlides ? .value ? .[currentBlockId.value] === slide.blockId,
        );

        return activeSlideIndex === -1 ? 0 : activeSlideIndex;
    });

    const currentSlideshowNextSlideIndex = computed(() => {
        const nextIndex = currentSlideshowActiveSlideIndex.value + 1;

        return nextIndex <= currentSlideshowSlidesCount.value - 1 ?
            nextIndex :
            0;
    });

    const currentSlideshowPreviousSlideIndex = computed(() => {
        const previousIndex = currentSlideshowActiveSlideIndex.value - 1;

        return previousIndex >= 0 ? previousIndex : currentSlideshowSlidesCount.value - 1;
    });

    const setCurrentActiveSlideById = (slideId) => {
        setActiveSlide({
            slideshowId: currentBlockId.value,
            slideId,
        });
    };

    const goToNextSlideInCurrentActiveSlideshow = () => {
        if (isCurrentSlideshowTransitioning.value) {
            return;
        }

        setSlidingDirection(DIRECTION_RIGHT);

        const nextSlideId = getters.currentBlock.slides[currentSlideshowNextSlideIndex.value].blockId;

        setCurrentActiveSlideById(nextSlideId);
    };

    const goToPreviousSlideInCurrentActiveSlideshow = () => {
        if (isCurrentSlideshowTransitioning.value) {
            return;
        }

        setSlidingDirection(DIRECTION_LEFT);

        const nextSlideId = getters.currentBlock.slides[currentSlideshowPreviousSlideIndex.value].blockId;

        setCurrentActiveSlideById(nextSlideId);
    };

    const closeEditBlockSlideshowComponent = () => {
        popupComponentHistory.value.pop();

        if (popupComponentHistory.value.length === 0) {
            context.emit('close');
        }
    };

    const setEditBlockSlideshowComponent = (component) => {
        popupComponentHistory.value.push(component);
    };

    const openSlideBackgroundEdit = (slideId) => {
        setCurrentActiveSlideById(slideId);
        setEditBlockSlideshowComponent('EditBlockSlideshowSlideBackground');
    };

    return {
        currentEditBlockSlideshowComponent,
        currentBlockId,
        websiteBlocks,
        currentSlideshowSlideName,
        currentSlideshowActiveSlideIndex,
        currentSlideshowSlideId,
        setActiveSlide,
        goToNextSlideInCurrentActiveSlideshow,
        goToPreviousSlideInCurrentActiveSlideshow,
        setEditBlockSlideshowComponent,
        openSlideBackgroundEdit,
        closeEditBlockSlideshowComponent,
    };
};