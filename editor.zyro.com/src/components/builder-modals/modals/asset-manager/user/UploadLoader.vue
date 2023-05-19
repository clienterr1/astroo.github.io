<!-- https://medium.com/@pppped/how-to-code-a-responsive-circular-percentage-chart-with-svg-and-css-3632f8cd7705 -->

<template>
	<svg
		:style="computedStyles"
		viewBox="0 0 36 36"
		class="upload-loader"
	>
		<path
			class="upload-loader__circle"
			stroke-dasharray="100, 100"
			d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
		/>
		<path
			ref="progressCircle"
			class="upload-loader__circle upload-loader__progress-circle"
			stroke-dasharray="0, 100"
			d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831"
		/>
	</svg>
</template>

<script>
import { defineComponent } from 'vue';

const ANIMATION_TIME = 250;

export default defineComponent({

	props: {
		progress: {
			type: Number,
			default: 33,
		},
	},
	emits: ['animation-finished'],

	computed: {
		computedStyles() {
			return {
				'--transition-time': `${ANIMATION_TIME}ms`,
				'--progress': this.progress,
			};
		},
	},

	watch: {
		progress(newValue) {
			/**
			 * When the internet is really fast the upload progress just goes from 0 to 100
			 * and the circles look broken
			 * This allows circle animation to be visible
			 */
			if (newValue === 100) {
				setTimeout(() => {
					this.$emit('animation-finished');
				}, ANIMATION_TIME);
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.upload-loader {
	$size: 60px;

	display: block;
	width: 100%;
	max-width: $size;
	height: 100%;
	max-height: $size;
	margin: auto;

	&__circle {
		fill: none;
		stroke: $color-light;
		stroke-linecap: round;
		stroke-width: 3;
	}

	&__progress-circle {
		stroke: $color-azure;
		stroke-dasharray: var(--progress) 100;
		transition: var(--transition-time);
	}
}

</style>
