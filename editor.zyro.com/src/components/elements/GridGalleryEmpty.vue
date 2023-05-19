<template>
	<div class="empty-gallery">
		<p class="empty-gallery__title z-body z-body--strong">
			{{ $t('builder.editGallery.emptyBlockTitle') }}
		</p>
		<p class="empty-gallery__explanation z-body">
			{{ $t('builder.editGallery.emptyBlockExplanation') }}
		</p>
		<ZyroButton
			theme="primary"
			color="black"
			size="xs"
			class="drag-and-drop-overlay__button"
			@click="showGalleryManager = true"
		>
			{{ $t('builder.editGallery.manageButton') }}
		</ZyroButton>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import { useEditGridGallery } from '@/components/builder-controls/edit-gallery/useEditGridGallery';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
	},

	setup() {
		const { showGalleryManager } = useEditGridGallery();

		return {
			showGalleryManager,
		};
	},
});
</script>
<style lang="scss" scoped>
.empty-gallery {
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 8px;
	text-align: center;
	background: $color-gray-light;

	&__title {
		margin-bottom: 8px;
	}

	&__explanation {
		margin-bottom: 24px;
		color: $color-gray;
	}
}
</style>
