import {
    computed
} from 'vue';

export const useGridGallery = (props) => {
    const hasGridImages = computed(() => props.data.images.length > 0);
    const columnCount = computed(() => Number.parseInt(props.data.desktop.columnCount, 10));
    const columnGap = computed(() => Number.parseInt(props.data.desktop.columnGap, 10));
    const mobileColumnCount = computed(() => Number.parseInt(props.data.mobile.columnCount, 10));
    const mobileColumnGap = computed(() => Number.parseInt(props.data.mobile.columnGap, 10));
    const isMasonryLayout = computed(() => props.data.settings.layout === 'masonry');

    return {
        hasGridImages,
        columnCount,
        columnGap,
        isMasonryLayout,
        mobileColumnCount,
        mobileColumnGap,
    };
};