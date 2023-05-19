import {
    ref,
    watch,
    computed,
} from 'vue';

import {
    useDocumentVisibility
} from '@vueuse/core';

const slideshowRefs = ref({});

export const SLIDE_DIRECTION_FORWARD = 'forward';
export const SLIDE_DIRECTION_BACKWARD = 'backward';

export const useImageSlideshow = ({
    isAutoplayEnabled,
    isLoopEnabled,
    autoplayInterval,
    isTransitioning,
    slides,
} = {}) => {
    const currentSlideIndex = ref(0);
    const slideDirection = ref('');
    const autoplayTimer = ref(null);

    const slideCount = computed(() => slides.value.length);
    const isCurrentLastSlide = computed(() => currentSlideIndex.value === slides.value.length - 1);
    const isCurrentFirstSlide = computed(() => currentSlideIndex.value === 0);

    const canSlideToNext = computed(() => (!isCurrentLastSlide.value || isLoopEnabled.value) &&
        slideCount.value > 1 &&
        !isTransitioning.value);

    const canSlideToPrevious = computed(() => (!isCurrentFirstSlide.value || isLoopEnabled.value) &&
        slideCount.value > 1 &&
        !isTransitioning.value);

    const slideToNext = () => {
        if (!canSlideToNext.value) {
            return;
        }

        slideDirection.value = SLIDE_DIRECTION_FORWARD;
        if (isLoopEnabled.value && isCurrentLastSlide.value) {
            currentSlideIndex.value = 0;

            return;
        }

        currentSlideIndex.value += 1;
    };

    const slideToPrevious = () => {
        if (!canSlideToPrevious.value) {
            return;
        }

        slideDirection.value = SLIDE_DIRECTION_BACKWARD;
        if (isLoopEnabled.value && isCurrentFirstSlide.value) {
            currentSlideIndex.value = slides.value.length - 1;

            return;
        }

        currentSlideIndex.value -= 1;
    };

    const slideTo = (index) => {
        slideDirection.value = index > currentSlideIndex.value ? SLIDE_DIRECTION_FORWARD : SLIDE_DIRECTION_BACKWARD;
        currentSlideIndex.value = index;
    };

    const setAutoplayInterval = () => {
        autoplayTimer.value = setInterval(() => {
            if (!isLoopEnabled.value && isCurrentLastSlide.value) {
                return;
            }

            slideToNext();
        }, autoplayInterval.value * 1000);
    };

    const clearAutoplayInterval = () => {
        if (!autoplayTimer.value) return;

        clearInterval(autoplayTimer.value);
        autoplayTimer.value = null;
    };

    const resetAutoplayInterval = () => {
        clearAutoplayInterval();
        if (isAutoplayEnabled.value) {
            setAutoplayInterval();
        }
    };

    if (isAutoplayEnabled) {
        if (isAutoplayEnabled.value) {
            setAutoplayInterval();
        }

        watch(isAutoplayEnabled, () => {
            if (isAutoplayEnabled.value) {
                setAutoplayInterval();
            } else {
                clearAutoplayInterval();
            }
        });

        watch(useDocumentVisibility(), (documentState) => {
            if (documentState === 'visible') {
                setAutoplayInterval();
            } else {
                clearAutoplayInterval();
            }
        });
    }

    if (autoplayInterval) {
        watch(autoplayInterval, () => {
            resetAutoplayInterval();
        });
    }

    return {
        slideshowRefs,
        slideToNext,
        slideToPrevious,
        slideTo,
        slideDirection,
        slideCount,
        currentSlideIndex,
        slides,
        isLoopEnabled,
        isAutoplayEnabled,
        autoplayInterval,
        resetAutoplayInterval,
        setAutoplayInterval,
        clearAutoplayInterval,
        canSlideToNext,
        canSlideToPrevious,
    };
};