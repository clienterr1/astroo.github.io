<template>
	<GridGallery
		:grid-images="gridImages"
		:is-lightbox-enabled="isLightboxEnabled"
		:column-count="columnCount"
		:column-gap="columnGap"
		:mobile-column-count="mobileColumnCount"
		:mobile-column-gap="mobileColumnGap"
		:is-masonry-layout="isMasonryLayout"
		@image-click="handleGalleryImageClick"
		@image-load="$emit('image-load')"
	/>
</template>

<script>
import {
	ref,
	computed,
	defineComponent,
	onMounted,
	onUnmounted,
} from 'vue';
import { useStore } from 'vuex';

import GridGallery from '@zyro-inc/site-modules/components/elements/gallery/GridGallery.vue';
import { useGridGallery } from '@zyro-inc/site-modules/components/elements/gallery/useGridGallery';
import { useLightbox } from '@zyro-inc/site-modules/components/lightbox/useLightbox';
import { MEDIA_MOBILE_BREAKPOINT } from '@zyro-inc/site-modules/constants';
import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';
import {
	getOptimizedSrc,
	getGridGallerySrcset,
} from '@zyro-inc/site-modules/utils/getSrcsets';
import { parseCSSSides } from '@zyro-inc/site-modules/utils/parseCSSSides';

const IMAGE_CLICK_ACTION_LIGHTBOX = 'lightbox';

export default defineComponent({
	name: 'GridGalleryProviderUser',

	components: {
		GridGallery,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		mobileBlockPadding: {
			type: String,
			default: '0px',
		},
		elementWidth: {
			type: Number,
			default: null,
		},
		elementHeight: {
			type: Number,
			default: null,
		},
	},

	setup(props) {
		const {
			columnCount,
			columnGap,
			isMasonryLayout,
			mobileColumnCount,
			mobileColumnGap,
		} = useGridGallery(props);
		const { getters } = useStore();
		const { addImagesToLightbox } = useLightbox();
		const mobilePadding = computed(() => {
			const { right } = parseCSSSides(props.mobileBlockPadding ?? '');

			return Number.parseInt(right, 10) || 0;
		});

		// Have reactive column count
		const isMobileScreen = ref(false);
		const setIsMobileScreen = () => {
			isMobileScreen.value = window.matchMedia(`(max-width: ${MEDIA_MOBILE_BREAKPOINT}px)`).matches;
		};

		onMounted(() => {
			setIsMobileScreen();
			window.addEventListener('resize', setIsMobileScreen);
		});

		onUnmounted(() => {
			window.removeEventListener('resize', setIsMobileScreen);
		});

		const reactiveColumnCount = computed(() => (isMobileScreen.value ? mobileColumnCount.value : columnCount.value));
		// -------

		const imageWidth = computed(() => Math.ceil((columnGap.value + props.elementWidth) / reactiveColumnCount.value) - columnGap.value);

		// Only add height (=== imageWidth) if not in masonry view
		const imageHeight = computed(() => !isMasonryLayout.value && imageWidth.value);

		// Set sizes property only for GRID websites
		const sizes = computed(() => [
			`(min-width: ${MEDIA_MOBILE_BREAKPOINT}px) ${imageWidth.value}px`,
			`${100 / reactiveColumnCount.value}vw`,
		].join(', '));

		const userGridImages = computed(() => props.data.images.map((image) => {
			const src = computed(() => getOptimizedSrc(image.origin, image.path, getters.siteId, {
				width: imageWidth.value,
				height: imageHeight.value,
			}));

			const srcset = computed(() => getGridGallerySrcset(image.origin, image.path, getters.siteId, {
				width: imageWidth.value,
				height: imageHeight.value,
				columnCount: reactiveColumnCount.value,
				columnGap: columnGap.value,
				mobilePadding: mobilePadding.value,
				isMasonryLayout: isMasonryLayout.value,
			}));

			return {
				...image,
				src: src.value,
				srcset: srcset.value,
				sizes: sizes.value,
				width: imageWidth.value,
				height: imageHeight.value,
			};
		}));

		const isLightboxEnabled = computed(
			() => props.data.settings.imageClickAction === IMAGE_CLICK_ACTION_LIGHTBOX,
		);

		const handleGalleryImageClick = (index) => {
			if (isLightboxEnabled.value) {
				const imagesWithSrc = props.data.images.map((image) => ({
					alt: image.alt,
					src: getImageSrc(image.origin, image.path, getters.siteId),
				}));

				addImagesToLightbox(imagesWithSrc, index);
			}
		};

		return {
			gridImages: userGridImages,
			isLightboxEnabled,
			handleGalleryImageClick,
			columnCount,
			columnGap,
			isMasonryLayout,
			mobileColumnCount,
			mobileColumnGap,
		};
	},
});
</script>
