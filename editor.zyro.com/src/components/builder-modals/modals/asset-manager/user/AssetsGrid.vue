<template>
	<div
		v-bind="containerProps"
		class="assets-grid"
	>
		<div
			v-bind="wrapperProps"
			ref="wrapperRef"
			class="assets-grid__wrapper"
		>
			<slot name="breadcrumbs" />
			<slot name="folders" />
			<div
				v-for="({ data }, id) in list"
				:key="id"
				class="assets-grid__assets-row"
			>
				<AssetThumbnail
					v-for="asset in data"
					:key="asset.id"
					:is-asset-select-button-hidden="isAssetSelectButtonHidden || asset.isCategoryDifferentFromView"
					:asset="asset"
					:is-gallery="isGallery"
					:current-tab="currentTab"
					@open-image-details="$emit('open-image-details', asset)"
					@select="$emit('select-image', asset.url)"
					@move-asset-to="$emit('move-asset-to', {
						newPath: $event,
						asset
					})"
					@rename-asset="$emit('rename-asset', {
						asset,
						newName: $event,
					})"
					@delete-asset="$emit('delete-asset', asset)"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import AssetThumbnail from '@/components/builder-modals/modals/asset-manager/user/AssetThumbnail.vue';
import {
	ASSETS_CATEGORY_DOCUMENT,
	ASSETS_CATEGORY_IMAGE,
	ASSETS_CATEGORIES,
} from '@/constants';

import {
	computed,
	ref,
} from 'vue';
import { useVirtualList } from '@vueuse/core';
import { useAssetsGrid } from '@/use/useAssetsGrid';

const props = defineProps({
	assets: {
		type: Array,
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
	visibleCategories: {
		type: Array,
		default: () => ASSETS_CATEGORIES,
		validator: (categories) => categories.every((category) => ASSETS_CATEGORIES.includes(category)),
	},
	isAssetSelectButtonHidden: {
		type: Boolean,
		default: false,
	},
});

defineEmits([
	'open-image-details',
	'select-image',
	'move-asset-to',
	'rename-asset',
	'delete-asset',
]);

const wrapperRef = ref();
const ASSET_THUMBNAIL_HEIGHT = 260;
const ASSET_THUMBNAIL_GAP = 8;

const isAssetCategoryDifferentThanView = ({ assetCategory }) => {
	const isDocumentCategoryVisible = props.visibleCategories.includes(ASSETS_CATEGORY_DOCUMENT);
	const isImageCategoryVisible = props.visibleCategories.includes(ASSETS_CATEGORY_IMAGE);

	if (!isDocumentCategoryVisible) {
		return assetCategory === ASSETS_CATEGORY_DOCUMENT;
	}

	if (!isImageCategoryVisible) {
		return assetCategory === ASSETS_CATEGORY_IMAGE;
	}

	return false;
};

const mappedAssets = computed(() => props.assets.map((asset) => {
	const isCategoryDifferentFromView = isAssetCategoryDifferentThanView({
		assetCategory: asset.category,
	});

	return {
		...asset,
		isCategoryDifferentFromView,
	};
}));

const { dynamicallySegmentedAssets } = useAssetsGrid({
	mappedAssets,
	wrapperRef,
});

const {
	list,
	containerProps,
	wrapperProps,
} = useVirtualList(
	dynamicallySegmentedAssets,
	{
		// This has to match exact height of asset row otherwise jittering will occur
		itemHeight: ASSET_THUMBNAIL_HEIGHT + ASSET_THUMBNAIL_GAP,
	},
);

</script>

<style scoped lang="scss">
.assets-grid {
	height: 100%;

	&__assets-row {
		display: flex;
		justify-content: flex-start;
		height: calc(v-bind(ASSET_THUMBNAIL_HEIGHT) * 1px);
		gap: 8px;
		padding: 0 20px;
		margin-bottom: calc(v-bind(ASSET_THUMBNAIL_GAP) * 1px);
	}
}

@media screen and (max-width: 420px) {
	.assets-grid {
		&__assets-row {
			justify-content: center;
			gap: 0;
		}
	}
}
</style>
