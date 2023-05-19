<template>
	<ZyroModal
		max-width="1200px"
		max-height="90vh"
		:title="title"
		content-padding="0"
		no-overflow
		use-flex-for-content
		class="asset-manager"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER"
		data-portal="asset-manager"
		@close-modal="handleCloseModal"
	>
		<GalleryManager
			v-if="isGalleryManagerOpen"
			:gallery-id="galleryId"
			@open-asset-manager="isGalleryManagerOpen = false"
		/>

		<SlideshowManager
			v-else-if="isSlideshowManagerOpen"
			:slideshow-id="slideshowId"
			@open-asset-manager="isSlideshowManagerOpen = false"
		/>

		<template v-else>
			<div
				v-show="!isAssetBeingViewed"
				class="asset-manager__navigation"
			>
				<AssetManagerGoBackButton
					v-if="galleryId"
					@button-click="handleBackButtonClick"
				/>
				<ZyroButton
					v-if="isBackButtonVisible"
					v-qa="'asset-manager-back-button'"
					class="asset-manager__back-button"
					theme="plain"
					color="black"
					@click="isBackButtonVisible = false"
				>
					<template #icon-left>
						<ZyroSvgDeprecated
							name="chevron"
							direction="left"
						/>
					</template>
					{{ $t('builder.assetManagerBackToList') }}
				</ZyroButton>

				<div
					v-else
					class="asset-manager__tab-navigation"
				>
					<div class="asset-manager__tabs">
						<div>
							<ZyroTabs
								:tabs="tabsLeft"
								:current-tab="currentTab"
								@update:current-tab="currentTab = $event"
							/>
						</div>

						<span
							v-if="tabsRight.length"
							class="asset-manager__separator"
						/>

						<div>
							<ZyroTabs
								:tabs="tabsRight"
								:current-tab="currentTab"
								class="asset-manager__right-tabs"
								@update:current-tab="currentTab = $event"
							/>
						</div>
					</div>
					<div class="asset-manager__buttons">
						<ZyroButton
							v-if="currentTab.id === ASSETS_TAB_ID_MY_LIBRARY"
							v-qa="`assetmanager-create-folder`"
							theme="plain"
							size="xs"
							color="black"
							class="asset-manager__folder-button"
							@click="addNewFolder"
						>
							<template #icon-left>
								<Icon
									name="folder-plus"
									dimensions="16px"
									is-custom
								/>
							</template>
							{{ $t('builder.foldersCreateFolder') }}
						</ZyroButton>

						<ZyroButton
							v-qa="'assetmanager-uploadimage'"
							theme="primary"
							size="xs"
							color="black"
							class="asset-manager__upload-button"
							@click="$refs.fileInput.click()"
						>
							{{ $t('builder.assetManagerTabUserUploadFiles') }}
						</ZyroButton>
					</div>
				</div>
			</div>

			<AssetDetailsLayout
				v-if="isAssetBeingViewed"
				:asset="assetBeingViewed"
				:is-asset-select-button-hidden="isAssetSelectButtonHidden"
				@select-asset="selectImage"
				@update-img-alt-tag="updateImgAltTag"
				@close="assetBeingViewed = null"
			/>

			<template v-else>
				<AssetsLayout
					v-show="isAssetsLayoutVisible"
					:is-gallery="isGallery"
					:valid-assets="visibleAssets"
					:current-tab="currentTab"
					:visible-categories="visibleCategories"
					:is-asset-select-button-hidden="isAssetSelectButtonHidden"
					@open-image-details="assetBeingViewed = $event"
					@open-file-dialog="$refs.fileInput.click()"
					@select-image="selectImage"
					@add-to-gallery="addSelectedImagesToGallery"
					@open-directory="setCurrentDirectory"
					@move-asset-to="handleMoveClick"
					@delete-asset="handleDeleteClick"
					@rename-asset="handleRenameClick"
				/>
				<UnsplashLayout
					v-show="currentTab.id === ASSETS_TAB_ID_UNSPLASH"
					:is-preview-open="isBackButtonVisible"
					:is-gallery="isGallery"
					@toggle-preview="isBackButtonVisible = $event"
					@select-image="selectImage"
				/>
			</template>
		</template>

		<input
			v-show="false"
			ref="fileInput"
			type="file"
			data-qa="builder-input-image"
			name="images"
			multiple
			@change="onSelectFiles($event)"
		>
	</ZyroModal>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';
import {
	mapActions,
	mapState,
	useStore,
} from 'vuex';
import { useI18n } from 'vue-i18n';
import { useAssetManagerFolders } from '@/use/useAssetManagerFolders';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTabs from '@/components/global/ZyroTabs.vue';

import { addBreadcrumb } from '@sentry/browser';
import { getImageSrc } from '@zyro-inc/site-modules/utils/getImageSrc';
import {
	getFileNameFromURL,
	getExtension,
} from '@zyro-inc/site-modules/utils/modifyString';

import { getImagePathOrigin } from '@zyro-inc/site-modules/utils/images';
import GalleryManager from '@/components/builder-modals/modals/asset-manager/GalleryManager.vue';
import SlideshowManager from '@/components/builder-modals/modals/asset-manager/SlideshowManager.vue';
import UnsplashLayout from '@/components/builder-modals/modals/asset-manager/unsplash/UnsplashLayout.vue';
import AssetDetailsLayout from '@/components/builder-modals/modals/asset-manager/user/AssetDetailsLayout.vue';
import AssetsLayout from '@/components/builder-modals/modals/asset-manager/user/AssetsLayout.vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER,
} from '@zyro-inc/site-modules/constants';
import { logDownload } from '@/api/UnsplashApi';
import {
	ASSETS_TAB_ID_DOCUMENTS,
	ASSETS_TAB_ID_IMAGES,
	ASSETS_TAB_ID_MY_LIBRARY,
	ASSETS_TAB_ID_UNSPLASH,
	ASSETS_CATEGORY_IMAGE,
	ASSETS_IMAGE_FILE_TYPES,
	ASSETS_CATEGORIES,
	UNSPLASH_QUALITY_SETTINGS,
} from '@/constants';
import {
	useAssets,
	isAssetCategoryDocument,
	isAssetCategoryImage,
} from '@/use/useAssets';
import AssetManagerGoBackButton from '@/components/builder-modals/modals/asset-manager/user/AssetManagerGoBackButton.vue';
import { getImageResolution } from '@zyro-inc/site-modules/utils/getImageResolution';
import { getFilesInDirectory } from '@/utils/assets';

const USER_LAYOUT_TABS = [
	ASSETS_TAB_ID_MY_LIBRARY,
	ASSETS_TAB_ID_IMAGES,
	ASSETS_TAB_ID_DOCUMENTS,
];

// https://unsplash.com/documentation#supported-parameters

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		ZyroModal,
		ZyroSvgDeprecated,
		ZyroTabs,
		GalleryManager,
		SlideshowManager,
		UnsplashLayout,
		AssetsLayout,
		AssetDetailsLayout,
		AssetManagerGoBackButton,
	},

	props: {
		isSlideshow: {
			type: Boolean,
			default: false,
		},
		slideshowId: {
			type: String,
			default: null,
		},
		isGallery: {
			type: Boolean,
			default: false,
		},
		galleryId: {
			type: String,
			default: null,
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
		'select-image',
		'select-image',
		'select-images',
	],

	setup(props) {
		const { dispatch } = useStore();
		const {
			onSelectFiles,
			assets,
			deselectSelectedGalleryImages,
			isDeleteAssetModalOpened,
			assetsToDelete,
			folderToDelete,
		} = useAssets(props);
		const {
			addNewFolder,
			currentDirectory,
			moveFileTo,
			setAssetName,
			setImageAltTag,
			validAssetsWithPaths,
			assetPaths,
		} = useAssetManagerFolders({
			assets,
		});
		const { t } = useI18n();
		const isGalleryManagerOpen = ref(false);
		const isBackButtonVisible = ref(false);

		const isImagesTabEnabled = props.visibleCategories.includes(ASSETS_CATEGORY_IMAGE);
		const tabsRight = [
			...(props.isAssetSelectButtonHidden
				? []
				: [
					{
						isDisabled: !isImagesTabEnabled,
						title: t('builder.assetManagerTabFreeImages'),
						id: ASSETS_TAB_ID_UNSPLASH,
					},
				]),
		];

		const tabsLeft = [
			{
				title: t('builder.assetManagerTabMyLibrary'),
				id: ASSETS_TAB_ID_MY_LIBRARY,
			},
			{
				title: t('builder.assetManagerTabImages'),
				id: ASSETS_TAB_ID_IMAGES,
				isDisabled: !isImagesTabEnabled,
			},
			{
				title: t('builder.assetManagerTabDocuments'),
				id: ASSETS_TAB_ID_DOCUMENTS,
			},
		];

		const setCurrentDirectory = (path) => dispatch('assets/setCurrentDirectory', path);
		const handleBackButtonClick = () => {
			isBackButtonVisible.value = false;
			isGalleryManagerOpen.value = true;
			setCurrentDirectory('/');
		};

		const handleMoveClick = ({
			newPath,
			asset,
		}) => {
			const assetNameWithHash = getFileNameFromURL(asset.url, true);

			moveFileTo({
				id: assetNameWithHash,
				path: asset.path,
				newPath,
			});
		};

		const handleDeleteClick = (asset) => {
			const isFolder = asset.path.endsWith('/');

			isDeleteAssetModalOpened.value = true;

			if (isFolder) {
				folderToDelete.value = asset;
				assetsToDelete.value = getFilesInDirectory({
					directory: asset.path,
					assets: assets.value,
					assetPaths: assetPaths.value,
					includeFromSubfolders: true,
				});
			} else {
				assetsToDelete.value = [asset];
			}
		};

		const handleRenameClick = ({
			asset,
			newName,
		}) => {
			if (!newName || newName === asset.name) {
				return;
			}

			setAssetName({
				newName,
				id: asset.id,
			});
		};

		const updateImgAltTag = ({
			asset,
			newAltTag,
		}) => {
			setImageAltTag({
				newAltTag,
				id: asset.id,
			});
		};

		deselectSelectedGalleryImages();

		return {
			ASSETS_TAB_ID_MY_LIBRARY,
			ASSETS_TAB_ID_UNSPLASH,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER,
			tabsLeft,
			tabsRight,
			onSelectFiles,
			assets,
			isBackButtonVisible,
			isGalleryManagerOpen,
			deselectSelectedGalleryImages,
			addNewFolder,
			currentDirectory,
			setCurrentDirectory,
			handleMoveClick,
			handleDeleteClick,
			handleRenameClick,
			updateImgAltTag,
			validAssetsWithPaths,
			handleBackButtonClick,
		};
	},

	data() {
		return {
			assetBeingViewed: null,
			isSlideshowManagerOpen: this.isSlideshow,
			currentTab: null,
			selectedGalleryImages: [],
		};
	},

	computed: {
		...mapState(['websiteId']),
		validAssets() {
			return this.assets.filter((asset) => !asset.hasFailed);
		},

		documentAssets() {
			return this.validAssets.filter(isAssetCategoryDocument);
		},

		imageAssets() {
			return this.validAssets.filter(isAssetCategoryImage);
		},

		visibleAssets() {
			if (this.currentTab.id === ASSETS_TAB_ID_DOCUMENTS) {
				return this.documentAssets;
			}

			if (this.currentTab.id === ASSETS_TAB_ID_IMAGES) {
				return this.imageAssets;
			}

			return this.validAssets;
		},

		isAssetBeingViewed() {
			return !!this.assetBeingViewed;
		},

		title() {
			if (this.isGalleryManagerOpen) {
				return this.$t('builder.assetManagerGalleryGallery');
			}

			if (this.isSlideshowManagerOpen) {
				return this.$t('builder.assetManagerSlideshowSlideshow');
			}

			return this.$t('builder.assetManagerMediaLibrary');
		},

		isAssetsLayoutVisible() {
			if (!this.currentTab) {
				return true;
			}

			return USER_LAYOUT_TABS.includes(this.currentTab.id);
		},
	},

	created() {
		const [myLibraryTab] = this.tabsLeft;

		this.currentTab = myLibraryTab;
		this.isGalleryManagerOpen = this.isGallery;
	},

	methods: {
		...mapActions('assets', ['setCurrentDirectory']),
		/**
		 * @param {(string|object)} image url string when comes directly from storage or object when comes from unsplash
		 */
		async selectImage(image) {
			const isCurrentTabUnsplash = this.currentTab.id === ASSETS_TAB_ID_UNSPLASH;

			let imageUrl = '';
			let alt = '';

			if (isCurrentTabUnsplash) {
				if (image?.links?.download_location) {
				// Needed by Unsplash TOS whenever image is selected
					logDownload({
						imageJson: image,
					});
				}

				// Get image url
				imageUrl = `${image.urls.raw}${UNSPLASH_QUALITY_SETTINGS}`;
				// Set alt for unsplash image
				alt = image.alt_description;
			} else {
				imageUrl = image;
				alt = this.validAssetsWithPaths.find((asset) => asset.url === image)?.altTag || '';
			}

			// This is needed to prevent image selection while it's being uploaded and url is not returned from S3
			if (!imageUrl) {
				return;
			}

			if (this.isGallery) {
				// Go back to gallery manager if in gallery mode
				this.isGalleryManagerOpen = true;
				this.resetState();
			}

			if (this.isSlideshow) {
				// Go back to slideshow manager if in slideshow mode
				this.isSlideshowManagerOpen = true;
				this.resetState();
			}

			addBreadcrumb({
				category: 'SELECT_IMAGE',
				data: {
					imageUrl,
					isGallery: this.isGallery,
					isUnsplash: isCurrentTabUnsplash,
				},
				level: 'debug',
				type: 'debug',
			});

			this.setCurrentDirectory('/');

			const {
				origin,
				path,
			} = getImagePathOrigin(imageUrl);
			const fileType = getExtension(path);

			if (image.category && image.category === ASSETS_CATEGORY_IMAGE) {
				this.$emit('update-target', '_blank');
			}

			if (ASSETS_IMAGE_FILE_TYPES.includes(fileType)) {
				const fullSizeSrc = getImageSrc(origin, path, this.websiteId);
				// Resolution is needed for image cropping
				const {
					naturalWidth,
					naturalHeight,
				} = await getImageResolution(fullSizeSrc);

				this.$emit('select-image', {
					fullResolutionWidth: naturalWidth,
					fullResolutionHeight: naturalHeight,
					origin,
					path,
					url: imageUrl,
					alt,
				});

				return;
			}

			this.$emit('select-image', {
				origin,
				path,
				url: imageUrl,
				alt,
			});
		},

		// No need to handle unsplash here
		addSelectedImagesToGallery() {
			const newGalleryImages = this.assets
				.filter((image) => image.isGalleryImageSelected && image.url)
				.map(({ url }) => ({
					...getImagePathOrigin(url),
					// Since we do not have any alt texts for uploaded images, we set alt to empty string
					alt: '',
				}));

			this.$emit('select-images', newGalleryImages);
			this.isGalleryManagerOpen = true;
			this.resetState();
		},

		resetState() {
			const [myLibraryTab] = this.tabsLeft;

			this.currentTab = myLibraryTab;
			this.assetBeingViewed = null;
			this.isBackButtonVisible = false;
			this.setCurrentDirectory('/');
			this.deselectSelectedGalleryImages();
		},
		handleCloseModal() {
			this.$emit('close');
			this.setCurrentDirectory('/');
			this.isDeleteAssetModalOpened = false;
		},
	},
});
</script>

<style lang="scss" scoped>
.asset-manager {
	@media screen and (max-width: $media-mobile) {
		:deep(.modal) {
			max-width: 100vw;
		}
	}

	&__navigation {
		padding: 0 24px;
	}

	&__back-button {
		margin-bottom: 12px;
	}

	&__tab-navigation {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
			padding-bottom: 8px;
			border-bottom: 1px solid $color-gray-border;
		}
	}

	&__tabs {
		display: flex;
		align-items: center;
		margin-top: 8px;

		@media screen and (max-width: $media-mobile) {
			margin-top: 0;
		}
	}

	&__right-tabs {
		&#{&} {
			border: none;
		}
	}

	&__separator {
		width: 1px;
		height: 16px;
		margin: 0 24px;
		background-color: $color-gray-border;

		@media screen and (max-width: $media-mobile) {
			margin: 0 8px;
		}
	}

	&__buttons {
		display: flex;
		align-items: center;
	}

	&__upload-button {
		margin-left: 24px;

		@media screen and (max-width: $media-mobile) {
			min-height: 26px;
			padding: 4px 20px;
		}
	}

	&__folder-button {
		:deep() {
			border: none;
		}
	}
}
</style>
