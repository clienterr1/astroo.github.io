<template>
	<!-- if it is dragged over, show full-screen overlay backdrop -->
	<Teleport
		v-if="isDraggedOver"
		to="body"
	>
		<div class="drag-and-drop-overlay drag-and-drop-overlay--dragged-over">
			<ZyroSvgDeprecated
				class="drag-and-drop-overlay__icon"
				name="cloud"
			/>
			<p class="z-body z-body--strong">
				<slot name="drop-files-text">
					{{ $t('builder.assetManagerTabUserDragDropFiles') }}
				</slot>
			</p>
			<p class="drag-and-drop-overlay__maximum-asset-size z-body-small">
				{{ $t('builder.assetManagerTabUserMaximumImageSize') }}
				<br>
				{{ $t('builder.assetManagerTabUserMaximumDocumentSize') }}
			</p>
		</div>
	</Teleport>
	<!-- otherwise, show usual placeholder for drag and drop -->
	<div v-else>
		<div class="drag-and-drop-overlay">
			<ZyroSvgDeprecated
				class="drag-and-drop-overlay__icon"
				name="cloud"
			/>
			<p class="z-body z-body--strong">
				<slot name="drop-files-text">
					{{ $t('builder.assetManagerTabUserDragDropFiles') }}
				</slot>
			</p>
			<p class="drag-and-drop-overlay__or z-body">
				{{ $t('builder.assetManagerTabUserOr') }}
			</p>
			<div class="drag-and-drop-overlay__button">
				<slot name="placeholder-button">
					<ZyroButton
						theme="outline"
						size="xs"
						data-qa="chooseimage-btn-browsefiles"
						@click="$emit('open-file-dialog')"
					>
						{{ $t('builder.assetManagerTabUserChooseFiles') }}
					</ZyroButton>
				</slot>
			</div>
			<p class="drag-and-drop-overlay__maximum-asset-size z-body-small">
				{{ $t('builder.assetManagerTabUserMaximumImageSize') }}
				<br>
				{{ $t('builder.assetManagerTabUserMaximumDocumentSize') }}
			</p>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
	},

	props: {
		isDraggedOver: {
			type: Boolean,
			default: false,
		},
	},
});
</script>

<style lang="scss" scoped>
.drag-and-drop-overlay {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: $color-dark;
	pointer-events: none;
	background: $color-light;

	&__icon {
		$size: 64px;

		width: $size;
		height: $size;
		margin-bottom: 24px;
		stroke-width: 0.5;
	}

	&__or {
		margin: 8px 0;
	}

	&__button {
		pointer-events: all;
	}

	&--dragged-over {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: $z-index-drag-and-drop-overlay;
		color: $color-light;
		background: rgb(0 0 0 / 80%);
	}

	&__maximum-asset-size {
		margin-top: 16px;
		color: $color-gray;
		text-align: center;
	}
}
</style>
