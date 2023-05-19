<template>
	<div class="upload-bar">
		<p class="upload-bar__drag-drop-text z-body-small">
			<ZyroSvgDeprecated name="cloud-small" />
			{{ $t('builder.assetManagerTabUserDragDropBar') }}
		</p>
		<ZyroButton
			v-qa="'assetmanager-addimage'"
			theme="primary"
			size="xs"
			color="black"
			@click="onAddImagesClick"
		>
			<template #icon-left>
				<Icon
					name="add"
					dimensions="16px"
				/>
			</template>
			{{ $t('builder.assetManagerGalleryAddImages') }}
		</ZyroButton>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EventLogApi from '@/api/EventLogApi';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		ZyroSvgDeprecated,
	},
	emits: ['open-asset-manager'],

	methods: {
		onAddImagesClick() {
			this.$emit('open-asset-manager');
			EventLogApi.logEvent({
				eventName: 'builder.image_gallery.add_images',
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.upload-bar {
	display: flex;
	grid-area: 1/1/2/2;
	align-items: center;
	justify-content: space-between;
	width: 100%;

	// Avoid layout shift
	min-height: 40px;
	margin: 14px 0 22px;

	&__info {
		display: flex;
		align-items: center;
		padding-left: 60px;
	}

	&__separator {
		align-self: stretch;
		width: 1px;
		margin: 0 20px;
		background-color: $color-gray-light;
	}

	&__count {
		display: inline-block;
		min-width: 2ch;
		text-align: right;
	}

	&__drag-drop-text {
		display: flex;
		align-items: center;
		padding: 10px 20px;

		:deep(svg) {
			margin-right: 10px;
		}
	}
}
</style>
