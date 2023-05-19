<template>
	<div
		class="height-controller"
		:style="computedStyles"
		:class="{
			'is-active' : eventInfo,
			'height-controller--is-hovered': isResizable
		}"
		@mousedown="startResizing"
	>
		<div
			class="height-controller__background"
		>
			<template v-if="eventInfo && eventInfo.yCurrent">
				<div class="height-controller__line-ending" />
				<div class="height-controller__middle-line" />
				<div class="height-controller__value z-body-small">
					{{ computedValue }} px
				</div>
				<div class="height-controller__middle-line" />
				<div class="height-controller__line-ending" />
			</template>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({

	props: {
		value: {
			type: Number,
			default: 0,
		},
		linearity: {
			type: Number,
			default: 2.5,
		},
		isResizable: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'select-current-block',
		'start-resizing',
		'stop-resizing',
	],

	data() {
		return {
			eventInfo: null,
		};
	},

	computed: {
		...mapState('gui', ['isMobileScreen']),
		computedValue() {
			return Math.max(this.eventInfo?.yCurrent
				? this.value
				+ Math.floor(((this.eventInfo.yCurrent - this.eventInfo.yStart) / this.linearity))
				: this.value, 0);
		},
		computedStyles() {
			return {
				'--height-controller-height': `${this.computedValue}px`,
				'--cursor-style': this.isMobileScreen ? 'pointer' : 'row-resize',
			};
		},
	},

	methods: {
		startResizing(event) {
			// We can't resize on mobile builder, so select the current block instead
			if (this.isMobileScreen) {
				this.$emit('select-current-block');

				return;
			}

			if (!this.isResizable) {
				return;
			}

			this.eventInfo = {
				yStart: event.clientY,
			};
			window.addEventListener('mousemove', this.resizeElement);
			window.addEventListener('mouseup', this.stopResizing);
			this.$emit('start-resizing');
		},
		resizeElement(event) {
			this.eventInfo = {
				...this.eventInfo,
				yCurrent: event.clientY,
			};
		},
		stopResizing() {
			window.removeEventListener('mouseup', this.stopResizing);
			window.removeEventListener('mousemove', this.resizeElement);
			this.$emit('stop-resizing', this.computedValue);
			this.eventInfo = null;
		},
	},
});
</script>

<style lang="scss" scoped>
.height-controller {
	// How much to expand height controller outwards
	$height-controller-expansion: 6px;

	position: relative;
	z-index: $z-index-controls-margin-control;
	height: var(--height-controller-height);
	cursor: var(--cursor-style);
	transition: background-color 0.2s $transition-timing-easing-standard;

	&--is-hovered {
		&:hover {
			background-color: rgba($color-azure, 0.1);
		}
	}

	&.is-active {
		background-color: rgba($color-azure, 0.2);
	}

	&__background {
		position: absolute;
		top: $height-controller-expansion * -0.5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: calc(var(--height-controller-height) + #{$height-controller-expansion});
		padding: $height-controller-expansion * 0.5 0;
	}

	&__line-ending {
		position: relative;
		display: block;
		flex: 0 1 2px;
		width: 20px;
		background-color: $color-azure;
		border-radius: 2px;
	}

	&__value {
		padding: 2px 4px;
		margin: 0;
		color: $color-light;
		background-color: $color-azure;
		border-radius: 2px;
	}

	&__middle-line {
		flex: 0 100 100%;
		border-left: 1px dashed $color-azure;
	}
}
</style>
