<template>
	<div
		ref="galleryLayoutRef"
		class="gallery-manager"
	>
		<DragDropOverlay
			v-if="isEmpty"
			class="gallery-manager__empty"
		>
			<template #drop-files-text>
				{{ $t('builder.assetManagerGalleryAddImagesWhenEmpty') }}
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
					{{ $t('builder.assetManagerGalleryAddImages') }}
				</ZyroButton>
			</template>
		</DragDropOverlay>
		<!-- Cannot be wrapper in a <div>, because overflow-y doesn't work on masonry anymore -->
		<template v-else>
			<ImagesControlBar @open-asset-manager="$emit('open-asset-manager')" />
			<HorizontalMasonry
				:images="imagesObject"
				@remove-from-gallery="removeImageFromGallery"
				@move-image="moveImage"
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
import {
	mapGetters,
	mapActions,
	mapState,
} from 'vuex';

import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import HorizontalMasonry from '@/components/builder-modals/modals/asset-manager/gallery/HorizontalMasonry.vue';
import { useAssets } from '@/use/useAssets';
import DragDropOverlay from '@/components/builder-modals/modals/asset-manager/user/DragDropOverlay.vue';
import ImagesControlBar from '@/components/builder-modals/modals/asset-manager/user/ImagesControlBar.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ImagesControlBar,
		HorizontalMasonry,
		DragDropOverlay,
	},

	props: {
		galleryId: {
			type: String,
			required: true,
		},
	},

	setup(props, context) {
		const {
			listenForDragAndDrop,
			assets,
			isDraggedOver,
		} = useAssets(props);
		const galleryLayoutReference = ref(null);
		const { updateElementHeightOnDevices } = useDeviceElementHeight();

		onMounted(() => {
			listenForDragAndDrop(galleryLayoutReference.value);
		});

		// To not handle all overlay actions, on drag, open asset manager.
		watch(isDraggedOver, () => context.emit('open-asset-manager'));

		return {
			galleryLayoutRef: galleryLayoutReference,
			assets,
			isDraggedOver,
			updateElementHeightOnDevices,
		};
	},

	computed: {
		...mapState(['websiteId']),
		...mapGetters(['siteElements']),
		images() {
			return this.siteElements[this.galleryId].images;
		},
		imagesObject() {
			return {
				...this.images.map((image) => ({
					url: getOptimizedSrc(image.origin, image.path, this.websiteId, {
						width: 200,
					}),
				})),
			};
		},
		isEmpty() {
			return Object.keys(this.imagesObject).length === 0;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		moveImage(settings) {
			const images = [...this.images];

			// Swap places
			images.splice(settings.newIndex, 0, images.splice(settings.oldIndex, 1)[0]);
			this.mergeCurrentElementData({
				elementData: {
					images,
				},
				pushToHistory: true,
			});
		},
		removeImageFromGallery(imageIndex) {
			const images = [...this.images];

			images.splice(imageIndex, 1);
			this.mergeCurrentElementData({
				elementData: {
					images,
				},
				pushToHistory: true,
			});

			this.updateElementHeightOnDevices({
				elementId: this.galleryId,
			});
		},
	},
});
</script>
<style lang="scss" scoped>
.gallery-manager {
	height: 100%;
	padding: 0 20px;

	&__empty {
		display: flex;
		justify-content: center;
		height: 100%;
	}
}
</style>
