import {
    ref,
    computed,
} from 'vue';

import {
    getCode,
    CODE,
} from '@zyro-inc/site-modules/utils/getCode';

const lightboxImages = ref([]);
const currentLightboxImageIndex = ref(null);

export const useLightbox = () => {
    const isLightboxOpen = computed(() => lightboxImages.value.length > 0);

    const isImageGalleryMode = computed(() => lightboxImages.value.length > 1);

    const lastImageIndex = computed(() => lightboxImages.value.length - 1);

    const isLastImage = computed(
        () => currentLightboxImageIndex.value === lightboxImages.value.length - 1,
    );

    const isFirstImage = computed(() => currentLightboxImageIndex.value === 0);

    const currentLightboxImage = computed(
        () => lightboxImages.value[currentLightboxImageIndex.value],
    );

    const setCurrentLightboxImageIndex = (index) => {
        currentLightboxImageIndex.value = index;
    };

    /**
     * If passed images is not an array wraps the image into array
     * @param {Object | Array} images
     */
    const setLightboxImages = (images) => {
        lightboxImages.value = Array.isArray(images) ? images : [images];
    };

    const goToPreviousImage = () => (isFirstImage.value ?
        setCurrentLightboxImageIndex(lastImageIndex.value) :
        setCurrentLightboxImageIndex(currentLightboxImageIndex.value - 1));

    const goToNextImage = () => (isLastImage.value ?
        setCurrentLightboxImageIndex(0) :
        setCurrentLightboxImageIndex(currentLightboxImageIndex.value + 1));

    const closeLightbox = () => {
        setLightboxImages([]);
        setCurrentLightboxImageIndex(null);
    };

    const onLightboxClickOutside = () => {
        if (!isImageGalleryMode.value) {
            closeLightbox();
        }
    };

    /**
     * When you add images to lightbox it automatically triggers isLightboxOpen to true
     * @param {Object | Array} images
     * @param {Number} [index]
     */
    const addImagesToLightbox = (images, index = 0) => {
        setLightboxImages(images);
        setCurrentLightboxImageIndex(index);
    };

    const handleLightboxNav = (event) => {
        if (getCode(event) === CODE.ArrowRight) {
            goToNextImage();
        }

        if (getCode(event) === CODE.ArrowLeft) {
            goToPreviousImage();
        }

        if (getCode(event) === CODE.Escape) {
            closeLightbox();
        }
    };

    return {
        lightboxImages: computed(() => lightboxImages.value),
        currentLightboxImageIndex: computed(() => currentLightboxImageIndex.value),
        currentLightboxImage,
        lastImageIndex,
        isFirstImage,
        isLastImage,
        isLightboxOpen,
        isImageGalleryMode,
        setLightboxImages,
        setCurrentLightboxImageIndex,
        goToNextImage,
        goToPreviousImage,
        handleLightboxNav,
        closeLightbox,
        addImagesToLightbox,
        onLightboxClickOutside,
    };
};