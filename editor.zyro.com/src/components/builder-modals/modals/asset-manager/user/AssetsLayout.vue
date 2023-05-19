<template>
	<div
		ref="userLayoutRef"
		class="assets-layout"
		:class="{
			'assets-layout--content-centered': isNoAssetsFound,
			'assets-layout--content-shifted': selectedAssetsCount > 0
		}"
	>
		<ZyroLoader v-if="!hasServerAssetsLoaded" />
		<template v-else-if="!isNoAssetsFound">
			<AssetsGrid
				:assets="validAssetList"
				:is-gallery="isGallery"
				:current-tab="currentTab"
				:visible-categories="visibleCategories"
				:is-asset-select-button-hidden="isAssetSelectButtonHidden"
				@open-image-details="$emit('open-image-details', $event)"
				@select-image="$emit('select-image', $event)"
				@move-asset-to="$emit('move-asset-to', $event)"
				@rename-asset="$emit('rename-asset', $event)"
				@delete-asset="$emit('delete-asset', $event)"
			>
				<template
					v-if="currentTab.id === ASSETS_TAB_ID_MY_LIBRARY"
					#breadcrumbs
				>
					<AssetFolderBreadcrumbs />
				</template>
				<template
					v-if="currentTab.id === ASSETS_TAB_ID_MY_LIBRARY && currentDirectoryFolders.length"
					#folders
				>
					<FolderAssetsGrid
						:folders="currentDirectoryFolders"
						@open-directory="$emit('open-directory', $event)"
						@rename-asset="$emit('rename-asset', $event)"
						@delete-asset="$emit('delete-asset', $event)"
					/>
				</template>
			</AssetsGrid>
		</template>
		<GalleryAssetsControls
			v-if="selectedAssetsCount > 0"
			:selected-assets-count="selectedAssetsCount"
			class="assets-layout__gallery-assets-control"
			@select-all="selectAllGalleryImages"
			@deselect-all="deselectSelectedGalleryImages"
			@add-to-gallery="$emit('add-to-gallery')"
		/>
		<DragDropOverlay
			v-if="(isNoAssetsFound || isDraggedOver) && hasServerAssetsLoaded"
			class="assets-layout__drag-and-drop-overlay"
			:is-dragged-over="isDraggedOver"
			@open-file-dialog="$emit('open-file-dialog')"
		/>
		<!-- Dialogs -->
		<SystemDialogModal
			v-if="invalidAssetsBeingUploaded.length"
			:title="assetTooLargeModalConfig.title"
			:primary-button-text="$t('builder.assetManagerDialogTooCancel')"
			:secondary-button-text="$t('builder.assetManagerDialogSkipUnsupported')"
			@close="removeInvalidAssetsBeingUploaded"
			@click-primary="removeInvalidAssetsBeingUploaded"
			@click-secondary="continueAssetUpload"
		>
			{{ assetTooLargeModalConfig.descriptionOne }}
			<br>
			{{ assetTooLargeModalConfig.descriptionTwo }}
		</SystemDialogModal>
		<SystemDialogModal
			v-else-if="hasSomeAssetsFailedUploading"
			:title="$t('builder.assetManagerDialogSomethingWentWrong')"
			:primary-button-text="$t('builder.assetManagerDialogSkipUnsupported')"
			:secondary-button-text="$t('builder.assetManagerDialogRetry')"
			@close="deleteFailedAssets"
			@click-primary="deleteFailedAssets"
			@click-secondary="retryFailedAssets"
		>
			{{ $t('builder.assetManagerDialogSomeFailed') }}
		</SystemDialogModal>
		<AssetDeleteDialog />
	</div>
</template>

<script>
import {
	ref,
	onMounted,
	defineComponent,
	computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import AssetsGrid from '@/components/builder-modals/modals/asset-manager/user/AssetsGrid.vue';
import FolderAssetsGrid from '@/components/builder-modals/modals/asset-manager/user/FolderAssetsGrid.vue';
import DragDropOverlay from '@/components/builder-modals/modals/asset-manager/user/DragDropOverlay.vue';
import GalleryAssetsControls from '@/components/builder-modals/modals/asset-manager/user/GalleryAssetsControls.vue';
import AssetDeleteDialog from '@/components/builder-modals/modals/asset-manager/user/AssetDeleteDialog.vue';
import AssetFolderBreadcrumbs from '@/components/builder-modals/modals/asset-manager/user/AssetFolderBreadcrumbs.vue';
import SystemDialogModal from '@/components/builder-modals/modals/SystemDialogModal.vue';
import {
	ASSETS_CATEGORY_IMAGE,
	ASSETS_CATEGORY_DOCUMENT,
	ASSETS_IMAGE_SIZE_LIMIT_MB,
	ASSETS_DOCUMENT_SIZE_LIMIT_MB,
	ASSETS_TAB_ID_MY_LIBRARY,
	ASSETS_CATEGORIES,
} from '@/constants';
import { useAssets } from '@/use/useAssets';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';
import { useAssetManagerFolders } from '@/use/useAssetManagerFolders';

export default defineComponent({
	components: {
		DragDropOverlay,
		SystemDialogModal,
		ZyroLoader,
		AssetsGrid,
		FolderAssetsGrid,
		GalleryAssetsControls,
		AssetDeleteDialog,
		AssetFolderBreadcrumbs,
	},

	props: {
		isGallery: {
			type: Boolean,
			default: true,
		},
		validAssets: {
			type: Array,
			default: () => [],
		},
		currentTab: {
			type: Object,
			required: true,
		},
		visibleCategories: {
			type: Array,
			default: () => ASSETS_CATEGORIES,
			validator: (categories) => categories.every((category) => ASSETS_CATEGORIES.includes(category)),
		},
		isAssetSelectButtonHidden: {
			type: Boolean,
			default: false,
		},
	},

	emits: [
		'open-image-details',
		'select-image',
		'open-directory',
		'add-to-gallery',
		'open-file-dialog',
		'rename-asset',
		'delete-asset',
		'move-asset-to',
	],

	setup(props, context) {
		const {
			isDraggedOver,
			listenForDragAndDrop,
			deleteFailedAssets,
			invalidAssetsBeingUploaded,
			uploadAssets,
			removeInvalidAssetsBeingUploaded,
			retryFailedAssets,
			hasServerAssetsLoaded,
			selectAllGalleryImages,
			deselectSelectedGalleryImages,
			assets,
		} = useAssets(props, context);
		const {
			currentDirectoryValidAssets,
			currentDirectoryFolders,
			validAssetsWithPaths,
			folders,
		} = useAssetManagerFolders({
			assets: computed(() => props.validAssets),
		});

		const userLayoutReference = ref(null);
		const { t } = useI18n();

		const assetTooLargeFileConfig = {
			title: t('builder.assetManagerDialogAssetTooLargeTitleMixed'),
			descriptionOne: t('builder.assetManagerDialogAssetTooLargeLineOneDescriptionMixed'),
			descriptionTwo: t('builder.assetManagerDialogAssetTooLargeLineTwoDescriptionMixed', [
				ASSETS_IMAGE_SIZE_LIMIT_MB,
				ASSETS_DOCUMENT_SIZE_LIMIT_MB,
			]),
		};

		const assetTooLargeImageConfig = {
			title: t('builder.assetManagerDialogAssetTooLargeTitleImage'),
			descriptionOne: t('builder.assetManagerDialogAssetTooLargeLineOneDescriptionImage'),
			descriptionTwo: t('builder.assetManagerDialogAssetTooLargeLineTwoDescriptionImage', [ASSETS_IMAGE_SIZE_LIMIT_MB]),
		};

		const assetTooLargeDocumentConfig = {
			title: t('builder.assetManagerDialogAssetTooLargeTitleDocument'),
			descriptionOne: t('builder.assetManagerDialogAssetTooLargeLineOneDescriptionDocument'),
			descriptionTwo: t('builder.assetManagerDialogAssetTooLargeLineTwoDescriptionDocument', [ASSETS_DOCUMENT_SIZE_LIMIT_MB]),
		};

		const validAssetList = computed(() => (
			ASSETS_TAB_ID_MY_LIBRARY === props.currentTab.id ? currentDirectoryValidAssets.value : validAssetsWithPaths.value
		));

		onMounted(() => {
			listenForDragAndDrop(userLayoutReference.value);
		});

		return {
			ASSETS_TAB_ID_MY_LIBRARY,
			assets,
			isDraggedOver,
			deleteFailedAssets,
			retryFailedAssets,
			invalidAssetsBeingUploaded,
			userLayoutRef: userLayoutReference,
			hasServerAssetsLoaded,
			removeInvalidAssetsBeingUploaded,
			uploadAssets,
			selectAllGalleryImages,
			deselectSelectedGalleryImages,
			assetTooLargeFileConfig,
			assetTooLargeImageConfig,
			assetTooLargeDocumentConfig,
			currentDirectoryFolders,
			validAssetList,
			folders,
		};
	},

	computed: {
		selectedAssetsCount() {
			return this.assets.filter((asset) => asset.isGalleryImageSelected).length;
		},
		isNoAssetsFound() {
			return !this.assets.length && !this.folders.length;
		},
		hasSomeAssetsFailedUploading() {
			const failedToUploadAssets = this.assets.filter((asset) => asset.hasFailed);

			return failedToUploadAssets.length > 0;
		},
		assetTooLargeModalConfig() {
			const invalidAssetCategories = this.invalidAssetsBeingUploaded.map(({ category }) => category);
			const invalidAssetCategoriesUnique = new Set(invalidAssetCategories);

			if (invalidAssetCategoriesUnique.size > 1) {
				return this.assetTooLargeFileConfig;
			}

			switch (invalidAssetCategories[0]) {
			case ASSETS_CATEGORY_DOCUMENT: return this.assetTooLargeDocumentConfig;
			case ASSETS_CATEGORY_IMAGE: return this.assetTooLargeImageConfig;
			default: return this.assetTooLargeFileConfig;
			}
		},
	},

	methods: {
		...mapActionsNotifications({
			notify: NOTIFY,
		}),

		continueAssetUpload() {
			this.removeInvalidAssetsBeingUploaded();
			this.uploadAssets(this.invalidAssetsBeingUploaded);
		},
	},
});
</script>

<style lang="scss" scoped>
.assets-layout {
	$spacing: 22px;

	padding-bottom: 16px;

	// Account for navigation height
	height: calc(100% - 34px);
	overflow: auto;

	&--content-centered {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&--content-shifted {
		padding-bottom: 64px;
	}

	&__gallery-assets-control {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	&__drag-and-drop-overlay {
		// Fix zindexing in relation to other elements that have position: relative
		position: relative;
		grid-area: 1 / 1 / -1 / -1;
		margin: 0 $spacing $spacing;
	}
}
</style>
