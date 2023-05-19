import cloneDeep from 'lodash.clonedeep';
import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    EDIT_OPTION_ID,
    CHANGE_BACKGROUND_OPTION_ID,
    DEFAULT_SLIDE,
    DELETE_OPTION_ID,
    DUPLICATE_OPTION_ID,
    MAX_SLIDE_COUNT,
    MIN_SLIDE_COUNT,
} from '@/components/builder-controls/edit-block-slideshow/editBlockSlideshowConstants';

import {
    useEditBlockSlideshow
} from '@/components/builder-controls/edit-block-slideshow/use/useEditBlockSlideshow';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    cloneBlock
} from '@/utils/siteDataUtils';

import {
    useI18n
} from 'vue-i18n';

export const useManageBlockSlideshowSlides = (props, context) => {
    const {
        state,
        dispatch,
    } = useStore();
    const {
        currentSlideshowActiveSlideIndex,
        setActiveSlide,
        websiteBlocks,
        currentBlockId,
    } = useEditBlockSlideshow(props, context);
    const {
        t
    } = useI18n();

    const MANAGE_SLIDES_POPUP_OPTIONS = [{
            id: EDIT_OPTION_ID,
            icon: 'rename',
            title: t('common.rename'),
            text: t('common.rename'),
        },
        {
            id: CHANGE_BACKGROUND_OPTION_ID,
            icon: 'droplet',
            title: t('common.changeBackground'),
            text: t('common.changeBackground'),
        },
        {
            id: DUPLICATE_OPTION_ID,
            icon: 'duplicate',
            title: t('common.duplicate'),
            text: t('common.duplicate'),
        },
        {
            id: DELETE_OPTION_ID,
            icon: 'trash',
            title: t('common.delete'),
            text: t('common.delete'),
        },
    ];

    const isDeleteSlideModalVisible = ref(false);
    const slideToDelete = ref(null);

    const currentSlideshowSlides = computed(() => websiteBlocks.value[currentBlockId.value].slides);

    const currentSlideshowSlideCount = computed(() => currentSlideshowSlides.value.length);

    const currentSlideshowSlideNames = computed(
        () => currentSlideshowSlides.value.map((slide) => slide.name),
    );

    const hasCurrentSlideshowReachedMaxCount = computed(
        () => currentSlideshowSlideCount.value >= MAX_SLIDE_COUNT,
    );

    const hasCurrentSlideshowReachedMinCount = computed(
        () => currentSlideshowSlideCount.value <= MIN_SLIDE_COUNT,
    );

    const manageSlideshowPopupOptions = computed(
        () => MANAGE_SLIDES_POPUP_OPTIONS.filter((option) => {
            if (hasCurrentSlideshowReachedMinCount.value) {
                return option.id !== DELETE_OPTION_ID;
            }

            if (hasCurrentSlideshowReachedMaxCount.value) {
                return option.id !== DUPLICATE_OPTION_ID;
            }

            return option;
        }),
    );

    const toggleDeleteSlideModal = (slide = null) => {
        isDeleteSlideModalVisible.value = !isDeleteSlideModalVisible.value;
        slideToDelete.value = slide;
    };

    const setCurrentActiveSlideById = (slideId) => {
        setActiveSlide({
            slideshowId: currentBlockId.value,
            slideId,
        });
    };

    const updateCurrentSlideshowSlides = (newSlides) => {
        dispatch('updateBlockData', {
            blockId: currentBlockId.value,
            blockData: {
                slides: newSlides,
            },
            merge: true,
        });
    };

    const addSlide = () => {
        // TODO: refactor to reuse block copying logic
        if (hasCurrentSlideshowReachedMaxCount.value) {
            return;
        }

        const newSlideshowSlideId = generateRandomId();
        const slideMetadata = {
            name: `${t('common.slide')} ${currentSlideshowSlideCount.value + 1}`,
        };
        const slide = cloneDeep(DEFAULT_SLIDE.slide);
        const elements = cloneDeep(DEFAULT_SLIDE.components);
        const slideElements = Object.fromEntries(elements
            .map((component) => {
                const componentId = generateRandomId();

                slide.components.push(componentId);
                slide.zindexes.push(componentId);

                return [
                    componentId,
                    component,
                ];
            }));

        dispatch('addBlock', {
            slideshowBlockId: currentBlockId.value,
            blockId: newSlideshowSlideId,
            blockData: slide,
            elements: slideElements,
            slideMetadata,
        });

        setCurrentActiveSlideById(newSlideshowSlideId);
    };

    const duplicateSlide = (slide) => {
        if (hasCurrentSlideshowReachedMaxCount.value) {
            return;
        }

        const {
            newBlockId,
            newBlock,
            newElements,
        } = cloneBlock({
            siteData: state.website,
            blockId: slide.blockId,
            fromLocale: state.currentLocale,
            toLocale: state.currentLocale,
        });

        const slideMetadata = {
            name: `${slide.name} - ${t('common.copy')}`,
        };

        dispatch('addBlock', {
            slideshowBlockId: currentBlockId.value,
            blockId: newBlockId,
            blockData: newBlock,
            elements: newElements,
            slideMetadata,
        });

        setCurrentActiveSlideById(newBlockId);
    };

    const editSlide = ({
        oldValue,
        newValue,
    }) => {
        if (oldValue.name === newValue.name) {
            return;
        }

        const currentSlidesCopy = [...currentSlideshowSlides.value];

        currentSlidesCopy
            .find((slide) => slide.blockId === newValue.blockId).name = newValue.name;

        updateCurrentSlideshowSlides(currentSlidesCopy);
    };

    const removeSlide = (slideToRemove) => {
        dispatch('removeBlock', {
            blockId: slideToRemove.blockId,
            rootBlock: false,
        });

        toggleDeleteSlideModal();
    };

    const manageSlidesValidator = (slideName) => {
        if (!slideName) {
            return {
                isValid: false,
                error: t('validate.emptyValue'),
            };
        }

        if (currentSlideshowSlideNames.value.includes(slideName)) {
            return {
                isValid: false,
                error: t('editSlideshow.manageSlides.validation.alreadyExists'),
            };
        }

        return {
            isValid: true,
            error: '',
        };
    };

    return {
        isDeleteSlideModalVisible,
        slideToDelete,
        currentSlideshowSlides,
        currentSlideshowSlideNames,
        currentSlideshowActiveSlideIndex,
        manageSlideshowPopupOptions,
        hasCurrentSlideshowReachedMaxCount,
        toggleDeleteSlideModal,
        setCurrentActiveSlideById,
        updateCurrentSlideshowSlides,
        addSlide,
        duplicateSlide,
        editSlide,
        removeSlide,
        manageSlidesValidator,
    };
};