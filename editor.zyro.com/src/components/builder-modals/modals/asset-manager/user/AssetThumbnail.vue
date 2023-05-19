<template>
	<div
		class="asset-thumbnail"
		:class="{ 'asset-thumbnail--placeholder': asset.type === 'placeholder' }"
	>
		<div
			v-if="isLoading"
		>
			<div class="asset-thumbnail__loader-image">
				<div
					v-if="asset.transferProgress === 100"
					class="asset-thumbnail__checkmark-icon-container"
				>
					<ZyroSvgDeprecated name="check-mark-blue" />
				</div>
				<UploadLoader
					class="user-image__loader-svg"
					:progress="asset.transferProgress"
				/>
			</div>

			<div class="asset-thumbnail__loader-name" />
			<div class="asset-thumbnail__loader-description" />
		</div>

		<div v-else>
			<div
				v-qa="`asset-thumbnail-container-${assetName}`"
				class="asset-thumbnail__thumbnail-container"
				:class="{ 'asset-thumbnail__thumbnail-container--boxed-grid': isAssetCategoryImage(asset) }"
				@click="$emit('open-image-details')"
			>
				<img
					v-if="isAssetCategoryImage(asset)"
					ref="image"
					loading="lazy"
					:src="asset.urlBase64 ? asset.urlBase64 : optimizedImageUrl"
					class="asset-thumbnail__thumbnail"
				>

				<ZyroSvgDeprecated
					v-else
					class="asset-thumbnail__document-icon"
					name="file-small"
				/>

				<ZyroButton
					v-if="asset.url && !isAssetSelectButtonHidden"
					v-qa="`asset-thumbnail-select-button-${assetName}`"
					class="asset-thumbnail__add-to-page-button"
					color="blue"
					theme="primary"
					@click.stop="$emit('select')"
				>
					{{ $t('builder.assetManagerSelectAsset') }}
				</ZyroButton>

				<div class="asset-thumbnail__hover-backdrop" />

				<button
					v-qa="`asset-thumbnail-details-button-${assetName}`"
					class="asset-thumbnail__details-button"
				>
					{{ $t('builder.assetManagerThumbnailDetails') }}
				</button>
			</div>

			<ZyroCheckbox
				v-if="isGallery && !isAssetSelectButtonHidden"
				class="asset-thumbnail__gallery-checkbox"
				:model-value="asset.isGalleryImageSelected"
				theme="blue"
				@update:model-value="toggleGalleryImageCheckbox(asset.id)"
			/>

			<div class="asset-thumbnail__data-wrapper">
				<div class="asset-thumbnail__text-wrapper">
					<AssetNameInput
						v-if="isAssetBeingRenamed"
						:asset-name="assetName"
						@toggle-input="toggleInput"
					/>
					<p
						v-else
						class="asset-thumbnail__name z-body-small"
						:title="assetName"
					>
						{{ assetName }}
					</p>
					<p class="asset-thumbnail__description z-body-small">
						{{ asset.url ? getExtension(asset.url).toUpperCase() : '-' }}
					</p>
				</div>
				<AssetControls
					:disabled="isAssetBeingUploaded"
					:current-tab="currentTab"
					@rename-asset="isAssetBeingRenamed = !isAssetBeingRenamed"
					@delete-asset="$emit('delete-asset')"
					@move-asset-to="$emit('move-asset-to', $event)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroCheckbox from '@/components/global/ZyroCheckbox.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	mapState,
	useStore,
} from 'vuex';
import AssetControls from '@/components/builder-modals/modals/asset-manager/user/AssetControls.vue';
import AssetNameInput from '@/components/builder-modals/modals/asset-manager/user/AssetNameInput.vue';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';
import {
	getExtension,
	getFileNameFromURL,
} from '@zyro-inc/site-modules/utils/modifyString';

import { ASSETS_THUMBNAIL_WIDTH } from '@/constants';
import {
	useAssets,
	isAssetCategoryImage,
} from '@/use/useAssets';
import UploadLoader from '@/components/builder-modals/modals/asset-manager/user/UploadLoader.vue';
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroCheckbox,
		ZyroSvgDeprecated,
		UploadLoader,
		AssetControls,
		AssetNameInput,
	},
	props: {
		asset: {
			type: Object,
			required: true,
		},
		isGallery: {
			type: Boolean,
			default: false,
		},
		currentTab: {
			type: Object,
			required: true,
		},
		isAssetSelectButtonHidden: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'select',
		'open-image-details',
		'move-asset-to',
		'rename-asset',
		'delete-asset',
	],
	setup(props, context) {
		const { getters } = useStore();
		const {
			toggleGalleryImageCheckbox,
			uploadingAssetCount,
		} = useAssets();
		const isAssetBeingRenamed = ref(false);

		const assetPaths = computed(() => getters['assets/assetPaths']);
		const isAssetAddedToAssetPaths = computed(() => Object.values(assetPaths.value).some((data) => data.path === props.asset.path));
		const assetName = computed(() => props.asset.name);
		const isAssetBeingUploaded = computed(() => !!uploadingAssetCount.value > 0 && !isAssetAddedToAssetPaths.value);

		const toggleInput = (newName) => {
			context.emit('rename-asset', newName);
			isAssetBeingRenamed.value = !isAssetBeingRenamed.value;
		};

		return {
			toggleGalleryImageCheckbox,
			isAssetCategoryImage,
			isAssetBeingRenamed,
			isAssetBeingUploaded,
			assetName,
			toggleInput,
		};
	},

	data() {
		return {
			isReadyToBeShown: false,
		};
	},

	computed: {
		...mapState(['websiteId']),

		optimizedImageUrl() {
			if (!this.isAssetCategoryImage(this.asset)) {
				return this.asset.url;
			}

			return getOptimizedSrc('assets', getFileNameFromURL(this.asset.url), this.websiteId, {
				width: ASSETS_THUMBNAIL_WIDTH,
			});
		},

		isLoading() {
			return (this.asset.transferProgress !== 100 || !this.isReadyToBeShown) && !this.asset.isFetchedFromServer;
		},
	},

	watch: {
		'asset.transferProgress': function watchTransferProgress(loadPercentage) {
			if (loadPercentage === 100) {
				setTimeout(() => {
					this.isReadyToBeShown = true;
				}, 2000);
			}
		},
	},

	created() {
		this.isReadyToBeShown = this.asset.transferProgress === 100;
	},

	methods: {
		getFileNameFromURL,
		getExtension,
	},
});
</script>

<style lang="scss" scoped>
.asset-thumbnail {
	position: relative;
	width: 100%;
	height: 260px;
	padding: 8px;
	border: 1px solid $color-gray-border;
	border-radius: 3px;

	&--placeholder {
		width: 100%;
		opacity: 0;
		pointer-events: none;
	}

	&__data-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		max-width: 200px;
	}

	&__text-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 155px;
	}

	&__loader-image {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 194px;
		margin-bottom: 8px;
		background-color: $color-gray-light;
		border-radius: 3px;
	}

	&__checkmark-icon-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	&__loader-name {
		width: 148px;
		height: 16px;
		margin-bottom: 4px;
		background-color: $color-gray-light;
		border-radius: 3px;
	}

	&__loader-description {
		width: 72px;
		height: 8px;
		background-color: $color-gray-light;
		border-radius: 3px;
	}

	&__details-button {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 40px;
		color: $color-light;
		cursor: pointer;
		background-color: rgba($color-dark, 0.6);
		opacity: 0;
		transition: background-color 0.3s, opacity 0.3s;

		&:hover {
			background-color: $color-dark;
		}
	}

	&__hover-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		background-color: $color-dark;
		opacity: 0;
		transition: opacity 0.3s;
	}

	&__add-to-page-button {
		position: absolute;
		top: 50%;
		left: 50%;
		z-index: 5;
		opacity: 0;
		transition: opacity 0.3s;
		transform: translate(-50%, -50%);
	}

	&__gallery-checkbox {
		position: absolute;
		top: 16px;
		right: 16px;
		z-index: 10;
	}

	&__thumbnail-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 194px;
		margin-bottom: 8px;
		cursor: pointer;
		background-color: $color-gray-light;
		border-radius: 3px;

		&--boxed-grid {
			background-image: url("../../../../../assets/images/image-backdrop.png");
			background-size: 24px 24px;
		}

		&:hover {
			.asset-thumbnail {
				&__details-button {
					opacity: 1;
				}

				&__hover-backdrop {
					opacity: 0.2;
				}

				&__add-to-page-button {
					opacity: 1;
				}
			}
		}
	}

	&__thumbnail {
		max-width: 100%;
		max-height: 100%;
	}

	&__document-icon {
		color: $color-gray;
	}

	&__name {
		width: 100%;
		margin-bottom: 6px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__description {
		font-size: 12px;
		color: $color-gray;
	}
}

@media screen and (max-width: 420px) {
	.asset-thumbnail {
		max-width: 100%;

		&__thumbnail {
			width: 100%;
			object-fit: contain;
		}
	}
}
</style>
