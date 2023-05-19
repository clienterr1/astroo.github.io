// Empty div Wrapper is need so that resize observer can detect height changes for correct element ref
<template>
	<div>
		<GridGallery
			v-if="hasGridImages"
			:key="renderKey"
			:grid-images="gridImages"
			:column-count="columnCount"
			:column-gap="columnGap"
			:mobile-column-count="mobileColumnCount"
			:mobile-column-gap="mobileColumnGap"
			:is-masonry-layout="isMasonryLayout"
			@image-load="handleGalleryImageLoad"
		/>
		<GridGalleryEmpty v-else />
	</div>
</template>

<script>
import {
	computed,
	defineComponent,
} from 'vue';
import {
	mapState,
	useStore,
} from 'vuex';

import GridGallery from '@zyro-inc/site-modules/components/elements/gallery/GridGallery.vue';
import { useGridGallery } from '@zyro-inc/site-modules/components/elements/gallery/useGridGallery';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';
import { useEditGridGallery } from '@/components/builder-controls/edit-gallery/useEditGridGallery';

import GridGalleryEmpty from '@/components/elements/GridGalleryEmpty.vue';

import { isDesktopSafari } from '@/utils/browserIdentifiers';

// A reasonable value to prevent massive images in builder (1224 / 4 * 2 for retina)
const MAX_WIDTH = 612;

export default defineComponent({
	name: 'GridGalleryProviderBuilder',

	components: {
		GridGallery,
		GridGalleryEmpty,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const {
			hasGridImages,
			columnCount,
			columnGap,
			isMasonryLayout,
			mobileColumnCount,
			mobileColumnGap,
		} = useGridGallery(props);

		const { showGalleryManager } = useEditGridGallery();

		const {
			state,
			getters,
		} = useStore();

		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		const currenElementId = computed(() => getters.currentElementId);

		const builderGridImages = computed(() => props.data.images.map((image) => {
			const src = getOptimizedSrc(image.origin, image.path, state.websiteId, {
				width: MAX_WIDTH,
				isLossless: true,
			});

			return {
				...image,
				src,
			};
		}));

		const handleGalleryImageLoad = () => {
			if (showGalleryManager.value) {
				updateElementHeightOnDevices({
					elementId: currenElementId.value,
				});
			}
		};

		return {
			hasGridImages,
			gridImages: builderGridImages,
			columnCount,
			columnGap,
			isMasonryLayout,
			mobileColumnCount,
			mobileColumnGap,
			handleGalleryImageLoad,
		};
	},

	data() {
		return {
			renderKey: 0,
		};
	},

	computed: {
		...mapState(['websiteId']),
	},

	watch: {
		columnGap() {
			// Rerender on each change in safari or else it wont rerender changed gaps
			if (isDesktopSafari) {
				this.renderKey += 1;
			}
		},
	},
});
</script>
