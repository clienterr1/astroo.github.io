<template>
	<div class="controls">
		<div class="controls__wrapper">
			<ZyroButton
				v-qa="`builder-heatmap-show-${isPreviewEnabled ? 'less' : 'more'}`"
				theme="primary"
				size="xxs"
				color="black"
				class="controls__toggle"
				:disabled="showOverlay"
				@click="$emit('toggle')"
			>
				<template #icon>
					<Icon
						:name="toggleIcon"
						dimensions="16px"
						is-custom
					/>
				</template>
			</ZyroButton>
			<div class="controls__divider" />
			<div class="controls__legend">
				<div class="controls__label z-subheading">
					{{ $t('builder.AIHeatmapLessAttention') }}
				</div>
				<div class="controls__gradient" />
				<div class="controls__label z-subheading">
					{{ $t('builder.AIHeatmapMoreAttention') }}
				</div>
			</div>
			<div class="controls__info">
				<ZyroTooltip
					class="info"
					mode="dark"
					position="right"
					size="small"
					toggle-event="hover"
					is-on-modal
				>
					<template #trigger>
						<ZyroButton
							theme="primary"
							size="xxs"
							color="black"
							class="controls__info-icon"
						>
							<template #icon>
								<Icon
									name="info"
									dimensions="16px"
								/>
							</template>
						</ZyroButton>
					</template>
					<div class="controls__info-content z-body-small">
						{{ $t('builder.AIHeatmapTooltip') }}
					</div>
				</ZyroTooltip>
			</div>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroTooltip,
	},

	props: {
		isPreviewEnabled: {
			type: Boolean,
			required: true,
		},
		showOverlay: {
			type: Boolean,
			required: true,
		},
	},

	computed: {
		toggleIcon() {
			return this.isPreviewEnabled ? 'eye-open' : 'eye-closed';
		},
	},
});
</script>

<style lang="scss" scoped>
.controls {
	position: fixed;
	right: 0;
	bottom: 60px;
	left: 0;
	z-index: $z-index-controls-heatmap-controls;
	display: flex;
	justify-content: center;
	pointer-events: none;

	&__wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		color: $color-light;
		pointer-events: all;
		background-color: $color-dark;
		border-radius: $border-radius-small;
	}

	&__toggle {
		margin-right: 8px;
	}

	&__divider {
		width: 1px;
		height: 16px;
		background-color: $color-light;
	}

	&__legend {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__label {
		padding: 2px 12px 0;
	}

	&__gradient {
		width: 180px;
		height: 13px;
		margin: 0 4px;
		background:
			linear-gradient(
				270deg,
				$color-danger 0%,
				$color-warning 31.93%,
				$color-success 64.41%,
				$color-meteorite 100%
			);
		border-radius: $border-radius-xsmall;
	}

	&__info-content {
		max-width: 30vw;
	}
}
</style>
