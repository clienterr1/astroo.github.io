<template>
	<button
		ref="resizeButton"
		class="resize-handle"
		:class="`resize-handle--${type}`"
		:style="`--resize-movement-length: ${resizeMovementLength}px`"
	>
		<ZyroSvgDeprecated
			name="chevron"
			direction="up"
			class="resize-handle__icon"
			:class="{ 'resize-handle__icon--disabled': hasError }"
		/>
		<ZyroSvgDeprecated
			name="chevron"
			direction="down"
		/>
	</button>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapGetters } from 'vuex';

import { defineComponent } from 'vue';

const HANDLE_ANIMATION_THRESHOLD = 5;

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
	},

	props: {
		type: {
			type: String,
			default: 'default',
		},
		resizeDirection: {
			type: Number,
			default: 0,
		},

	},

	computed: {
		...mapGetters('gui', ['isMobileMode']),
		hasError() {
			return this.type === 'error';
		},
		resizeMovementLength() {
			return this.resizeDirection * HANDLE_ANIMATION_THRESHOLD;
		},
	},
});
</script>

<style lang="scss" scoped>
.resize-handle {
	display: flex;
	flex-direction: column;
	padding: 4px 20px;
	color: $color-light;
	cursor: row-resize;
	background: $color-azure; // default color
	border-radius: $border-radius-xsmall;
	transition: background 0.2s $transition-timing-easing-standard, transform 0.1s ease-out;
	transform: translateY(var(--resize-movement-length));

	// Resize handle types
	&--primary {
		background: $color-primary;
	}

	&--error {
		background: $color-primary;
	}

	&__icon {
		margin-bottom: 4px;
		transition: opacity 0.2s linear;

		&--disabled {
			opacity: 0.4;
		}
	}
}
</style>
