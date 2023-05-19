<template>
	<div
		class="grid-resizer"
		:style="computedStyles"
	>
		<div class="grid-resizer__outline" />
		<div
			v-for="triggerPosition in triggerPositions"
			:key="triggerPosition"
			class="grid-resizer__handle"
			:class="triggerPosition"
			@mousedown="startResizing($event, triggerPosition)"
		>
			<div :class="`${triggerPosition}__dot`" />
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({

	props: {
		value: {
			type: Number,
			default: null,
		},
		elementAlignment: {
			type: String,
			default: 'right',
		},
		maxWidth: {
			type: Number,
			default: 200,
		},
	},
	emits: [
		'start-resizing',
		'resize',
		'stop-resizing',
	],

	data() {
		return {
			eventInfo: {},
		};
	},

	computed: {
		triggerPositions() {
			if (this.elementAlignment === 'none') {
				return [];
			}

			if (this.elementAlignment === 'flex-start') {
				return ['right'];
			}

			if (this.elementAlignment === 'flex-end') {
				return ['left'];
			}

			return [
				'left',
				'right',
			];
		},
		computedStyles() {
			return {
				'--width-controller-width': this.computedWidth ? `${this.computedWidth}px` : this.value,
			};
		},
		computedWidth() {
			if (!this.eventInfo) {
				return this.value;
			}

			const MIN_WIDTH = 30;

			if (this.eventInfo.triggerPosition === 'left') {
				return Math.min(
					Math.max(this.value - (this.eventInfo.xCurrent - this.eventInfo.xStart), MIN_WIDTH),
					this.maxWidth,
				);
			}

			return Math.min(
				Math.max(this.value + this.eventInfo.xCurrent - this.eventInfo.xStart, MIN_WIDTH),
				this.maxWidth,
			);
		},
	},

	methods: {
		startResizing(event, triggerPosition) {
			this.eventInfo = {
				xStart: event.clientX,
				triggerPosition,
			};
			window.addEventListener('mousemove', this.resizeElement);
			window.addEventListener('mouseup', this.stopResizing);
			this.$emit('start-resizing');
		},
		resizeElement(event) {
			this.eventInfo = {
				...this.eventInfo,
				xCurrent: event.clientX,
			};
			this.$emit('resize', this.computedWidth);
		},
		stopResizing() {
			window.removeEventListener('mouseup', this.stopResizing);
			window.removeEventListener('mousemove', this.resizeElement);
			this.$emit('stop-resizing', this.computedWidth);
			this.eventInfo = null;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "BlockGridResizer";

.grid-resizer {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: var(--width-controller-width, 100%);
}
</style>
