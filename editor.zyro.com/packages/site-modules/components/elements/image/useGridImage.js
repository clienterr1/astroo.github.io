import {
    computed
} from 'vue';

import {
    clamp
} from '@zyro-inc/site-modules/utils/clamp';
import {
    getExtension
} from '@zyro-inc/site-modules/utils/modifyString';

// Hardcoded reasonable value to prevent massive images in builder
export const MAX_WIDTH = 1920;

export const getImageWidth = ({
    isAspectRatioBiggerThanContainer,
    scale,
    containerHeight,
    containerWidth,
    naturalImageHeight,
    naturalImageWidth,
}) => {
    // If false then image width is 100%
    if (isAspectRatioBiggerThanContainer) {
        const percentChange = containerHeight / naturalImageHeight;

        return Math.round(naturalImageWidth * percentChange * scale);
    }

    // If image width is 100% container width
    return Math.round(containerWidth * scale);
};

export const getImageHeight = ({
    isAspectRatioBiggerThanContainer,
    scale,
    containerHeight,
    containerWidth,
    naturalImageHeight,
    naturalImageWidth,
}) => {
    if (!isAspectRatioBiggerThanContainer) {
        const percentChange = containerWidth / naturalImageWidth;

        return Math.round(naturalImageHeight * percentChange * scale);
    }

    // If false then image height is 100%
    return Math.round(containerHeight * scale);
};

const calculatePercentageWithOffset = ({
    offsetInPx,
    imageSize,
    containerSize,
    offsetInPercent,
}) => {
    if (!offsetInPx) {
        return offsetInPercent;
    }

    const onePercentInPixels = (imageSize - containerSize) / 100;
    const offset = clamp(offsetInPercent + offsetInPx / onePercentInPixels, 0, 100);

    return offset;
};

export const convertOffsetPercentageToPixels = ({
    imageSize,
    containerSize,
    offset,
}) => {
    const overflowAmount = containerSize - imageSize;

    return overflowAmount * (offset / 100);
};

export const computeCSSVars = ({
    prefix,
    left,
    top,
    scale,
    isAspectRatioLargerThanContainer,
}) => ({
    [`--${prefix}-left`]: `${left}px`,
    [`--${prefix}-top`]: `${top}px`,
    [`--${prefix}-scale`]: scale,
    [`--${prefix}-width`]: isAspectRatioLargerThanContainer ? 'auto' : '100%',
    [`--${prefix}-height`]: isAspectRatioLargerThanContainer ? '100%' : 'auto',
});

export const calculateCropParams = ({
    left,
    top,
    imageWidth,
    imageHeight,
    containerWidth,
    containerHeight,
}) => ({
    left: Math.round(Math.abs(left)),
    top: Math.round(Math.abs(top)),
    right: Math.round(imageWidth - containerWidth - Math.abs(left)),
    bottom: Math.round(imageHeight - containerHeight - Math.abs(top)),
    imageWidth,
    imageHeight,
});

const shrinkDownResolution = (width, height) => {
    if (width > MAX_WIDTH) {
        const scale = MAX_WIDTH / width;

        return {
            width: Math.round(width * scale),
            height: Math.round(height * scale),
        };
    }

    return {
        width,
        height,
    };
};

export const useGridImage = (props, context, {
    mouseDeltaY,
    mouseDeltaX,
    href,
} = {}) => {
    /**
     * These can change when image changes, in that case we need them to be reactive
     * Since builder loads smaller images we need to shrink down the resolution to match builder
     * So calculations are correct
     */
    const shrunkDownImageResolution = computed(() => shrinkDownResolution(props.data.fullResolutionWidth, props.data.fullResolutionHeight));
    const naturalImageWidth = computed(() => shrunkDownImageResolution.value.width);
    const naturalImageHeight = computed(() => shrunkDownImageResolution.value.height);

    const getImageAspectRatio = () => naturalImageWidth.value / naturalImageHeight.value;

    // #region Desktop crop data
    const desktopCropData = computed(() => props.data.desktop ? .crop);
    const desktopPosition = computed(() => props.renderedPosition || props.data.desktop);
    const desktopWidth = computed(() => desktopPosition.value.width);
    const desktopHeight = computed(() => desktopPosition.value.height);

    const desktopContainerAspectRatio = computed(() => desktopWidth.value / desktopHeight.value);

    const isDesktopAspectRatioLargerThanContainer = computed(() => getImageAspectRatio() > desktopContainerAspectRatio.value);

    // Rendered image sizes
    const desktopImageWidth = computed(() => getImageWidth({
        isAspectRatioBiggerThanContainer: isDesktopAspectRatioLargerThanContainer.value,
        scale: desktopCropData.value.scale,
        containerHeight: desktopHeight.value,
        containerWidth: desktopWidth.value,
        naturalImageHeight: naturalImageHeight.value,
        naturalImageWidth: naturalImageWidth.value,
    }));

    const desktopImageHeight = computed(() => getImageHeight({
        isAspectRatioBiggerThanContainer: isDesktopAspectRatioLargerThanContainer.value,
        scale: desktopCropData.value.scale,
        containerHeight: desktopHeight.value,
        containerWidth: desktopWidth.value,
        naturalImageHeight: naturalImageHeight.value,
        naturalImageWidth: naturalImageWidth.value,
    }));

    // Desktop top
    const desktopTopPercentWithOffset = computed(() => calculatePercentageWithOffset({
        offsetInPx: -mouseDeltaY ? .value,
        imageSize: desktopImageHeight.value,
        containerSize: desktopHeight.value,
        offsetInPercent: desktopCropData.value.top,
    }));

    const desktopTop = computed(() => convertOffsetPercentageToPixels({
        imageSize: desktopImageHeight.value,
        containerSize: desktopHeight.value,
        offset: desktopTopPercentWithOffset.value,
    }));

    // Desktop left
    const desktopLeftPercentWithOffset = computed(() => calculatePercentageWithOffset({
        offsetInPx: -mouseDeltaX ? .value,
        imageSize: desktopImageWidth.value,
        containerSize: desktopWidth.value,
        offsetInPercent: desktopCropData.value.left,
    }));

    const desktopLeft = computed(() => convertOffsetPercentageToPixels({
        imageSize: desktopImageWidth.value,
        containerSize: desktopWidth.value,
        offset: desktopLeftPercentWithOffset.value,
    }));

    // Crop offsets for backend and for overlay
    const desktopCropParams = computed(() => calculateCropParams({
        left: desktopLeft.value,
        top: desktopTop.value,
        imageWidth: desktopImageWidth.value,
        imageHeight: desktopImageHeight.value,
        containerWidth: desktopWidth.value,
        containerHeight: desktopHeight.value,
    }));

    // #endregion

    // #region Mobile crop data
    // Fallback to desktop
    const mobileCropData = computed(() => props.data.mobile.crop || desktopCropData.value);
    const mobilePosition = computed(() => props.renderedPosition || props.data.mobile);
    const mobileWidth = computed(() => mobilePosition.value.width);
    const mobileHeight = computed(() => mobilePosition.value.height);

    const mobileContainerAspectRatio = computed(() => mobileWidth.value / mobileHeight.value);

    const isMobileAspectRatioLargerThanContainer = computed(() => getImageAspectRatio() > mobileContainerAspectRatio.value);

    // Rendered image sizes
    const mobileImageWidth = computed(() => getImageWidth({
        isAspectRatioBiggerThanContainer: isMobileAspectRatioLargerThanContainer.value,
        scale: mobileCropData.value.scale,
        containerHeight: mobileHeight.value,
        containerWidth: mobileWidth.value,
        naturalImageHeight: naturalImageHeight.value,
        naturalImageWidth: naturalImageWidth.value,
    }));

    const mobileImageHeight = computed(() => getImageHeight({
        isAspectRatioBiggerThanContainer: isMobileAspectRatioLargerThanContainer.value,
        scale: mobileCropData.value.scale,
        containerHeight: mobileHeight.value,
        containerWidth: mobileWidth.value,
        naturalImageHeight: naturalImageHeight.value,
        naturalImageWidth: naturalImageWidth.value,
    }));

    // Mobile top
    const mobileTopPercentWithOffset = computed(() => calculatePercentageWithOffset({
        offsetInPx: -mouseDeltaY ? .value,
        imageSize: mobileImageHeight.value,
        containerSize: mobileHeight.value,
        offsetInPercent: mobileCropData.value.top,
    }));

    const mobileTop = computed(() => convertOffsetPercentageToPixels({
        imageSize: mobileImageHeight.value,
        containerSize: mobileHeight.value,
        offset: mobileTopPercentWithOffset.value,
    }));

    // Mobile left
    const mobileLeftPercentWithOffset = computed(() => calculatePercentageWithOffset({
        offsetInPx: -mouseDeltaX ? .value,
        imageSize: mobileImageWidth.value,
        containerSize: mobileWidth.value,
        offsetInPercent: mobileCropData.value.left,
    }));

    const mobileLeft = computed(() => convertOffsetPercentageToPixels({
        imageSize: mobileImageWidth.value,
        containerSize: mobileWidth.value,
        offset: mobileLeftPercentWithOffset.value,
    }));

    // Crop offsets for backend and for overlay
    const mobileCropParams = computed(() => calculateCropParams({
        left: mobileLeft.value,
        top: mobileTop.value,
        imageWidth: mobileImageWidth.value,
        imageHeight: mobileImageHeight.value,
        containerWidth: mobileWidth.value,
        containerHeight: mobileHeight.value,
    }));

    // #endregion
    const cropCSSVars = computed(() => {
        const isCroppable = ![
            'svg',
            'ico',
            'gif',
        ].includes(getExtension(props.data.settings.path));

        if (!desktopCropData.value || !naturalImageWidth.value || !naturalImageHeight.value || !isCroppable) {
            return null;
        }

        const desktopCSSVars = computeCSSVars({
            prefix: 'desktop',
            left: desktopLeft.value,
            top: desktopTop.value,
            scale: desktopCropData.value.scale,
            isAspectRatioLargerThanContainer: isDesktopAspectRatioLargerThanContainer.value,
        });

        const mobileCSSVars = computeCSSVars({
            prefix: 'mobile',
            left: mobileLeft.value,
            top: mobileTop.value,
            scale: mobileCropData.value.scale,
            isAspectRatioLargerThanContainer: isMobileAspectRatioLargerThanContainer.value,
        });

        return {
            ...desktopCSSVars,
            ...mobileCSSVars,
        };
    });

    return {
        href,
        cropCSSVars,
        desktopCropParams,
        mobileCropParams,
        desktopTop,
        desktopLeft,
        mobileLeft,
        mobileTop,
        desktopTopPercentWithOffset,
        desktopLeftPercentWithOffset,
    };
};