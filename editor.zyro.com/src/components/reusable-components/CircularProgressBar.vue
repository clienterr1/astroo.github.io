<template>
	<div class="circular-progress-bar-wrapper">
		<ZyroLoader
			v-if="isLoading"
			size="28px"
		/>
		<div
			v-else
			class="circular-progress-bar"
			:class="`circular-progress-bar--${incompleteLineColor}`"
		>
			<slot />
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

export default defineComponent({
	components: {
		ZyroLoader,
	},
	props: {
		percentage: {
			type: Number,
			default: 0,
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		incompleteLineColor: {
			type: String,
			default: 'grey',
			validator(value) {
				return [
					'grey',
					'white',
				].includes(value);
			},
		},
	},
});
</script>

<style lang="scss" scoped>
.circular-progress-bar-wrapper {
	pointer-events: none;
}

.circular-progress-bar {
	--border: 4px;
	--width: 28px;

	position: relative;
	display: inline-grid;
	place-content: center;
	width: var(--width);
	aspect-ratio: 1;
	font-size: 8px;
	font-weight: bold;
	background-color: transparent;

	&::before {
		position: absolute;
		inset: 0;
		content: "";
		background:
			radial-gradient(farthest-side, $color-success 98%, transparent) top/var(--border) var(--border) no-repeat,
			conic-gradient($color-success calc(v-bind(percentage) * 1%), transparent 0);
		border-radius: 50%;
		mask:
			radial-gradient(
				farthest-side,
				transparent calc(99% - var(--border)),
				$color-success calc(100% - var(--border))
			);
	}

	// adds rounded tips for the bar
	&::after {
		position: absolute;
		inset: calc(50% - var(--border) / 2);
		content: "";
		background: $color-success;
		border-radius: 50%;
		transform: rotate(calc(v-bind(percentage) * 3.6deg)) translateY(calc(50% - var(--width) / 2));
	}

	&--white {
		&::before {
			background-color: $color-light;
		}
	}

	&--grey {
		&::before {
			background-color: $color-gray-light;
		}
	}
}
</style>
