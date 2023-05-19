import {
    computed
} from 'vue';

export const useBlockEcommerceProduct = (props) => {
    const productId = computed(() => props.data.product.id);
    const blockStyle = computed(() => props.data.settings ? .styles);
    const textColorVars = computed(() => props.data.textColorVars);
    const blockButtonText = computed(() => props.data.buttonText);
    const blockButtonStyle = computed(() => props.data.buttonStyle);
    const blockButtonType = computed(() => props.data.buttonType);
    const blockButtonBorderWidth = computed(() => props.data.buttonBorderWidth);
    const navigationArrowsColor = computed(() => props.data.navigationArrowsColor);
    const navigationThumbnailArrowsColor = computed(() => props.data.navigationThumbnailArrowsColor);
    const galleryPlacement = computed(() => props.data.galleryPlacement);
    const imageRatio = computed(() => props.data.imageRatio);
    const imageBorderRadius = computed(() => props.data.imageBorderRadius);
    const isQuantityPickerEnabled = computed(() => props.data.isQuantityPickerEnabled ? ? true);

    return {
        productId,
        blockStyle,
        blockButtonText,
        blockButtonStyle,
        blockButtonType,
        blockButtonBorderWidth,
        textColorVars,
        imageBorderRadius,
        navigationArrowsColor,
        navigationThumbnailArrowsColor,
        galleryPlacement,
        imageRatio,
        isQuantityPickerEnabled,
    };
};