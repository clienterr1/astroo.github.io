<template>
	<div class="gallery-assets-controls">
		<div class="gallery-assets-controls__left-controls">
			<p class="z-body-small">
				{{ selectedAssetsCount }}
				{{ $t('builder.assetManagerGalleryControlsItemsSelected') }}
			</p>

			<ZyroButton
				theme="plain"
				class="gallery-assets-controls__button"
				size="md"
				icon-left="deselect-all"
				@click="$emit('deselect-all')"
			>
				{{ $t('builder.assetManagerGalleryControlsDeselectAll') }}
			</ZyroButton>

			<ZyroButton
				theme="plain"
				class="gallery-assets-controls__button"
				size="md"
				@click="$emit('select-all')"
			>
				<template #icon-left>
					<Icon
						name="select-all"
						dimensions="16px"
						is-custom
					/>
				</template>
				{{ $t('builder.assetManagerGalleryControlsSelectAll') }}
			</ZyroButton>
		</div>

		<ZyroButton
			theme="primary"
			class="gallery-assets-controls__button"
			color="blue"
			@click="$emit('add-to-gallery')"
		>
			{{ $t('builder.assetManagerAddToGallery') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
	},

	props: {
		selectedAssetsCount: {
			type: Number,
			required: true,
		},
	},
});
</script>

<style lang="scss" scoped>
	.gallery-assets-controls {
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 16px 24px;
		background-color: $color-light;
		border-top: 1px solid $color-gray-border;
		border-bottom-right-radius: 15px;
		border-bottom-left-radius: 15px;

		&__left-controls {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		&__button {
			margin-left: 40px;
		}
	}
</style>
