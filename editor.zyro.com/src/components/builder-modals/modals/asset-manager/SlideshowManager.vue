<template>
	<div
		ref="slideshowManagerRef"
		class="slideshow-manager"
	>
		<DragDropOverlay
			v-if="isEmpty"
			class="slideshow-manager__empty"
		>
			<template #drop-files-text>
				{{ $t('builder.assetManagerSlideshowAddImagesWhenEmpty') }}
			</template>
			<template #placeholder-button>
				<ZyroButton
					theme="primary"
					color="black"
					size="xs"
					data-qa="chooseimage-btn-browsefiles"
					@click="$emit('open-asset-manager')"
				>
					<template #icon-left>
						<Icon
							name="cloud_upload"
							dimensions="16px"
						/>
					</template>
					{{ $t('builder.assetManagerSlideshowAddImages') }}
				</ZyroButton>
			</template>
		</DragDropOverlay>
		<!-- Cannot be wrapper in a <div>, because overflow-y doesn't work on masonry anymore -->
		<template v-else>
			<ImagesControlBar @open-asset-manager="$emit('open-asset-manager')" />
			<HorizontalMasonry
				:images="imagesObject"
				@remove-from-gallery="removeSlide"
				@move-image="moveSlide"
			/>
		</template>
	</div>
</template>
<script>
import {
	onMounted,
	ref,
	watch,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';

import ZyroButton from '@/components/global/ZyroButton.vue';
import Icon from '@/components/global/Icon.vue';
import HorizontalMasonry from '@/components/builder-modals/modals/asset-manager/gallery/HorizontalMasonry.vue';
import { useAssets } from '@/use/useAssets';
import DragDropOverlay from '@/components/builder-modals/modals/asset-manager/user/DragDropOverlay.vue';
import ImagesControlBar from '@/components/builder-modals/modals/asset-manager/user/ImagesControlBar.vue';
import { useImageSlideshow } from '@zyro-inc/site-modules/components/blocks/slideshow/useImageSlideshow';
import { computed } from '@vue/reactivity';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ImagesControlBar,
		HorizontalMasonry,
		DragDropOverlay,
	},

	props: {
		slideshowId: {
			type: String,
			required: true,
		},
	},

	setup(props, context) {
		const {
			state,
			getters,
			dispatch,
		} = useStore();

		const {
			listenForDragAndDrop,
			assets,
			isDraggedOver,
		} = useAssets(props);

		const { slideshowRefs } = useImageSlideshow();
		const { slideTo } = slideshowRefs.value[props.slideshowId];

		const slideshowManagerRef = ref(null);

		onMounted(() => {
			listenForDragAndDrop(slideshowManagerRef.value);
		});

		// To not handle all overlay actions, on drag, open asset manager.
		watch(isDraggedOver, () => context.emit('open-asset-manager'));

		const images = computed(() => getters.currentBlock.slides);

		const imagesObject = computed(() => ({
			...images.value.map((image) => ({
				url: getOptimizedSrc(image.origin, image.path, state.websiteId, {
					width: 200,
				}),
			})),
		}));

		const isEmpty = computed(() => Object.keys(imagesObject.value).length === 0);

		const moveSlide = ({
			newIndex,
			oldIndex,
		}) => {
			const slides = [...images.value];

			slides.splice(newIndex, 0, slides.splice(oldIndex, 1)[0]);

			dispatch('updateBlockData', {
				blockId: props.slideshowId,
				blockData: {
					slides,
				},
				merge: true,
			});
		};

		const removeSlide = (slideIndex) => {
			dispatch('updateBlockData', {
				blockId: props.slideshowId,
				blockData: {
					slides: images.value.filter((_, index) => index !== slideIndex),
				},
				merge: true,
			});

			slideTo(0);
		};

		return {
			slideTo,
			slideshowManagerRef,
			assets,
			isDraggedOver,
			images,
			imagesObject,
			isEmpty,
			moveSlide,
			removeSlide,
		};
	},
});
</script>
<style lang="scss" scoped>
.slideshow-manager {
	height: 100%;
	padding: 0 20px;

	&__empty {
		display: flex;
		justify-content: center;
		height: 100%;
	}
}
</style>
