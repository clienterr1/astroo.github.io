<template>
	<div class="asset-details-layout">
		<AssetManagerGoBackButton @button-click="$emit('close')" />

		<div class="asset-details-layout__content">
			<div
				class="asset-details-layout__image-container"
				:class="{ 'asset-details-layout__image-container--boxed-grid': isAssetCategoryImage(asset) }"
			>
				<template v-if="isAssetCategoryImage(asset)">
					<img
						ref="image"
						:src="asset.urlBase64 ? asset.urlBase64 : asset.url"
						class="asset-details-layout__image"
						@load="updateImageDimensions"
					>

					<ZyroButton
						v-if="!isAssetSelectButtonHidden"
						theme="primary"
						color="blue"
						:title="$t('builder.assetManagerMediaLayoutSelectItem')"
						class="asset-details-layout__button-select-item"
						@click="$emit('select-asset', asset.url)"
					>
						{{ $t('builder.assetManagerMediaLayoutSelectItem') }}
					</ZyroButton>
				</template>

				<ZyroSvgDeprecated
					v-else
					name="file"
				/>
			</div>

			<div class="asset-details-layout__image-details">
				<div>
					<AssetsLayoutItem
						:topic="$t('builder.assetManagerMediaLayoutDetailTabFileName')"
						:subtopic="asset.name"
						class="asset-details-layout__assets-layout-item"
					/>

					<AssetsLayoutItem
						:topic="$t('builder.assetManagerMediaLayoutDetailTabExtension')"
						:subtopic="assetExtension"
						class="asset-details-layout__assets-layout-item"
					/>

					<AssetsLayoutItem
						:topic="$t('builder.assetManagerMediaLayoutDetailTabPath')"
						:subtopic="asset.url"
						class="asset-details-layout__assets-layout-item"
					/>

					<AssetsLayoutItem
						v-if="isAssetCategoryImage(asset)"
						:topic="$t('builder.assetManagerMediaLayoutDetailTabDimensions')"
						:subtopic="`${imageWidth} x ${imageHeight} ${$t('builder.assetManagerMediaLayoutPixels')}`"
						class="asset-details-layout__assets-layout-item"
					/>
					<ZyroFieldInput
						v-if="isAssetCategoryImage(asset)"
						:label="$t('builder.editImage.tabSeo.textFieldLabel')"
						:model-value="assetAltTag"
						class="asset-details-layout__alt-input"
						:class="{ 'asset-details-layout__alt-input--save': isAltTagSaveButtonShown }"
						input-data-qa="img-alt-text-input"
						maxlength="125"
						@update:model-value="updateImgAltTag"
					>
						<template #sublabel>
							<p class="asset-details-layout__alt-sublabel">
								{{ $t('builder.editImage.tabSeo.label') }}
							</p>
						</template>
						<template #suffix>
							<span class="asset-details-layout__alt-save-button">
								<ZyroButton
									v-if="isAltTagSaveButtonShown"
									@click="saveAltTag"
								>
									{{ $t('common.save') }}
								</ZyroButton>
							</span>
						</template>
					</ZyroFieldInput>

					<ZyroSeparator class="asset-details-layout__separator" />

					<ZyroButton
						v-qa="'asset-delete-btn'"
						size="xs"
						color="error-red"
						@click="handleDeleteClick"
					>
						<template #icon-left>
							<Icon
								name="delete"
								dimensions="16px"
							/>
						</template>
						{{ $t('builder.assetManagerMediaLayoutDeleteThisItem') }}
					</ZyroButton>
				</div>
			</div>
		</div>
		<AssetDeleteDialog @close="$emit('close')" />
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import {
	defineComponent,
	ref,
} from 'vue';
import { mapState } from 'vuex';

import { getExtension } from '@zyro-inc/site-modules/utils/modifyString';
import { getImageResolution } from '@zyro-inc/site-modules/utils/getImageResolution';
import AssetDeleteDialog from '@/components/builder-modals/modals/asset-manager/user/AssetDeleteDialog.vue';
import {
	useAssets,
	isAssetCategoryImage,
} from '@/use/useAssets';
import AssetManagerGoBackButton from '@/components/builder-modals/modals/asset-manager/user/AssetManagerGoBackButton.vue';
import AssetsLayoutItem from '@/components/builder-modals/modals/asset-manager/user/AssetsLayoutItem.vue';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroSeparator,
		ZyroSvgDeprecated,
		ZyroFieldInput,
		AssetDeleteDialog,
		AssetsLayoutItem,
		AssetManagerGoBackButton,
	},
	props: {
		asset: {
			type: Object,
			required: true,
		},
		isAssetSelectButtonHidden: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'close',
		'select-image',
		'update-img-alt-tag',
	],
	setup(props, context) {
		const {
			assets,
			isDeleteAssetModalOpened,
			isAssetBeingDeleted,
			assetsToDelete,
			updateUsedImageAltTag,
		} = useAssets(props, context);

		const isAltTagSaveButtonShown = ref(false);
		const assetAltTag = ref(props.asset.altTag || '');

		const handleDeleteClick = () => {
			assetsToDelete.value = [props.asset];

			if (!isDeleteAssetModalOpened.value) {
				isDeleteAssetModalOpened.value = true;
			}
		};

		const saveAltTag = () => {
			context.emit('update-img-alt-tag', {
				asset: props.asset,
				newAltTag: assetAltTag.value,
			});

			// Function that updates all website elements that use image with updated alt tag
			updateUsedImageAltTag({
				asset: props.asset,
				newAltTag: assetAltTag.value,
			});

			isAltTagSaveButtonShown.value = false;
		};

		const updateImgAltTag = (value) => {
			assetAltTag.value = value;
			isAltTagSaveButtonShown.value = true;
		};

		return {
			isAltTagSaveButtonShown,
			isDeleteAssetModalOpened,
			isAssetBeingDeleted,
			assets,
			assetAltTag,
			saveAltTag,
			isAssetCategoryImage,
			handleDeleteClick,
			updateImgAltTag,
		};
	},

	data() {
		return {
			imageWidth: '-',
			imageHeight: '-',
		};
	},

	computed: {
		...mapState(['websiteId']),

		assetExtension() {
			// TODO: Need to debug on which case this.asset.url is undefined and make sure it's always set
			if (!this.asset.url) {
				return this.$t('builder.assetManagerMediaLayoutDetailTabExtensionUndefined');
			}

			return getExtension(this.asset.url);
		},
	},

	methods: {
		...mapActionsNotifications({
			notify: NOTIFY,
		}),

		async updateImageDimensions() {
			const {
				naturalWidth,
				naturalHeight,
			} = await getImageResolution(this.asset.url);

			this.imageWidth = naturalWidth || this.asset?.width;
			this.imageHeight = naturalHeight || this.asset?.height;
		},
	},
});
</script>

<style lang="scss" scoped>
$navigation-height: 20px;
$navigation-margin-top: 16px;
$navigation-margin-bottom: 16px;

.asset-details-layout {
	height: 100%;
	padding: 0 24px 24px;

	&__content {
		display: flex;
		height: calc(100% - #{$navigation-height + $navigation-margin-bottom + $navigation-margin-top});
	}

	&__image-container {
		position: relative;
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 24px;
		margin-right: 24px;
		background-color: $color-gray-light;
		border-radius: 5px;

		&--boxed-grid {
			background-image: url("../../../../../assets/images/image-backdrop.png");
			background-size: 24px 24px;
		}
	}

	&__image {
		object-fit: contain;
		max-width: 100%;
		max-height: 100%;
	}

	&__button-select-item {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
	}

	&__image-details {
		flex-basis: 340px;
		flex-shrink: 0;
		height: 100%;
		overflow-y: auto;
	}

	&__assets-layout-item {
		margin-bottom: 16px;
	}

	&__separator {
		margin: 24px 0;
	}

	&__alt-sublabel {
		margin-bottom: 8px;
		font-size: 14px;
		color: $color-gray;
		word-break: break-word;
	}

	&__alt-input {
		:deep(.zyro-field-wrapper__suffix) {
			margin-left: 0;
		}

		&--save {
			:deep(.zyro-input__input) {
				padding-right: 65px;
			}
		}
	}

	&__alt-save-button {
		position: absolute;
		right: 16px;
	}
}
</style>
