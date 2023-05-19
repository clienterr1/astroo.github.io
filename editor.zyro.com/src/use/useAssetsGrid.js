import {
    ASSETS_THUMBNAIL_WIDTH
} from '@/constants';
import {
    useElementBounding
} from '@vueuse/core';
import {
    computed
} from 'vue';

export function useAssetsGrid({
    wrapperRef,
    mappedAssets,
}) {
    const {
        width
    } = useElementBounding(wrapperRef);

    // Based on container's width count how many asset thumbnails can be fitted in a row.
    // then segment assets into rows[] that will be used in virtual list. Instead of providing each
    // asset as a separate item, we provide a row of n items as a single item - this allows
    // to overcome useVirtualList limitation where it can only handle 1 item per row.
    const totalThumbnailCountInRow = computed(() => Math.floor(width.value / ASSETS_THUMBNAIL_WIDTH));

    const dynamicallySegmentedAssets = computed(() => {
        if (!wrapperRef.value) return [];

        return mappedAssets.value.reduce((chunkList, asset, i) => {
                const chunkIndex = Math.floor(i / totalThumbnailCountInRow.value);

                const chunkListCopy = [...chunkList];

                chunkListCopy[chunkIndex] = [
                    ...(chunkListCopy[chunkIndex] || []),
                    asset,
                ];

                return chunkListCopy;
            }, [])
            .map((chunk, chunkIndex, chunkList) => {
                if (chunkIndex !== chunkList.length - 1) return chunk;
                if (chunk.length === totalThumbnailCountInRow.value) return chunk;

                // placeholder items are required for last row to have same styling as other rows
                // each asset thumbnails width is 100% meaning that asset thumbnail count must match
                // throughout whole chunkList array
                const placeholderItemsCount = totalThumbnailCountInRow.value - chunk.length;

                return [
                    ...chunk,
                    ...Array(placeholderItemsCount).fill({
                        type: 'placeholder',
                    }),
                ];
            });
    });

    return {
        dynamicallySegmentedAssets,
    };
}