<template>
	<div
		v-if="isHiddenDesktop || isHiddenMobile"
		class="visibility-tooltip"
	>
		<ZyroTooltip
			v-if="isTooltipShown"
			class="visibility-tooltip__tooltip"
			position="left"
			size="small"
			toggle-event="hover"
			content-position="absolute"
			:forced-position="{
				right: '60px',
				top: '14px',
				'white-space': 'nowrap'
			}"
			:use-portal="false"
			mode="dark"
		>
			<template #trigger>
				<ZyroSvgDeprecated
					name="eye-closed"
					class="visibility-tooltip__icon"
					dimensions="32px"
				/>
			</template>
			{{ isHiddenMobile ? $t('builder.hiddenOnMobile') : $t('builder.hiddenOnDesktop') }}
		</ZyroTooltip>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroTooltip,
	},
	props: {
		isHiddenDesktop: {
			type: Boolean,
			required: true,
		},
		isHiddenMobile: {
			type: Boolean,
			required: true,
		},
		isTooltipShown: {
			type: Boolean,
			default: true,
		},
	},
});
</script>

<style lang="scss" scoped>
.visibility-tooltip {
	position: absolute;
	z-index: $z-index-controls-section-control;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	width: 100%;
	height: 100%;
	background:
		repeating-linear-gradient(
			45deg,
			rgba(0, 0, 0, 15%),
			rgba(0, 0, 0, 15%) 16px,
			rgba(0, 0, 0, 23%) 16px,
			rgba(0, 0, 0, 23%) 32px
		);

	&__tooltip {
		padding: 16px;
	}

	&__icon {
		padding: 8px;
		color: $color-light;
		background: $color-dark;
		border-radius: $border-radius-round;
	}
}
</style>
