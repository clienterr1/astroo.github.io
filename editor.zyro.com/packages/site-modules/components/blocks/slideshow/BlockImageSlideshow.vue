<template>
	<div class="slideshow">
		<TransitionGroup
			:name="`slide-${slideDirection}`"
			@leave="$emit('transition-start')"
			@after-leave="$emit('transition-end')"
		>
			<img
				v-for="(slide, index) in slides"
				v-show="currentSlideIndex === index"
				:key="`${slide.path}-${index}`"
				:alt="slide.alt || ''"
				class="slide"
				:src="getOptimizedSrc(
					slide.origin,
					slide.path,
					websiteId,
					{ width: FULL_WIDTH, })"
			>
		</TransitionGroup>
		<button
			v-if="isNextSlideButtonVisible"
			class="slideshow-nav-button slideshow-nav-button--right"
			:disabled="isNextButtonDisabled"
			:class="{ 'is-transitioning': isTransitioning, }"
			@click="$emit('next-slide')"
		>
			<svg
				width="14"
				height="26"
				viewBox="0 0 14 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 25L13 13L1 1"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<button
			v-if="isPreviousSlideButtonVisible"
			class="slideshow-nav-button slideshow-nav-button--left"
			:disabled="isPreviousButtonDisabled"
			:class="{ 'is-transitioning': isTransitioning, }"
			@click="$emit('previous-slide')"
		>
			<svg
				width="14"
				height="26"
				viewBox="0 0 14 26"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 25L13 13L1 1"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<div
			v-if="isNavigationDotsVisible"
			class="slideshow__dots"
		>
			<button
				v-for="(slide, index) in slides"
				:key="`${slide.path}-${index}`"
				class="dot"
				:class="{ 'dot--current': currentSlideIndex === index }"
				@click="$emit('dot-click', index)"
			/>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { SLIDE_DIRECTION_FORWARD } from '@zyro-inc/site-modules/components/blocks/slideshow/useImageSlideshow';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';
import { FULL_WIDTH } from '@zyro-inc/site-modules/utils/getGridItemSize';

export default defineComponent({
	props: {
		slides: {
			type: Array,
			required: true,
		},
		isLoopEnabled: {
			type: Boolean,
			default: false,
		},
		currentSlideIndex: {
			type: Number,
			default: 0,
		},
		slideDirection: {
			type: String,
			default: SLIDE_DIRECTION_FORWARD,
		},
		arrowColor: {
			type: String,
			default: 'rgb(255, 255, 255)',
		},
		dotColor: {
			type: String,
			default: 'rgb(255, 255, 255)',
		},
		isNextButtonDisabled: {
			type: Boolean,
			default: false,
		},
		isPreviousButtonDisabled: {
			type: Boolean,
			default: false,
		},
		isNavigationArrowsVisible: {
			type: Boolean,
			default: true,
		},
		isNavigationDotsVisible: {
			type: Boolean,
			default: true,
		},
		isTransitioning: {
			type: Boolean,
			default: false,
		},
		desktopMinHeight: {
			type: Number,
			required: true,
		},
		mobileMinHeight: {
			type: Number,
			required: true,
		},
		websiteId: {
			type: String,
			required: true,
		},
	},
	emits: [
		'transition-start',
		'transition-end',
		'next-slide',
		'previous-slide',
		'dot-click',
	],
	setup() {
		return {
			FULL_WIDTH,
			getOptimizedSrc,
		};
	},
	computed: {
		isNextSlideButtonVisible() {
			if (this.isLoopEnabled) {
				return this.isNavigationArrowsVisible;
			}

			const isLastSlide = this.currentSlideIndex === this.slides.length - 1;

			return this.isNavigationArrowsVisible && !isLastSlide;
		},
		isPreviousSlideButtonVisible() {
			if (this.isLoopEnabled) {
				return this.isNavigationArrowsVisible;
			}

			const isFirstSlide = this.isNavigationArrowsVisible && this.currentSlideIndex === 0;

			return this.isNavigationArrowsVisible && !isFirstSlide;
		},
	},
});
</script>

<style scoped lang='scss'>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.slide {
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
	transform-origin: center center;
	transform: scale(1.01);
}

.slideshow {
	position: relative;
	z-index: 1;
	width: 100%;

	// --header-height handling is required when header is transparent
	min-height: calc(var(--block-height-on-resize, v-bind(desktopMinHeight)) * 1px + var(--header-height, 0px));
	margin-top: calc(-1 * var(--header-height));
	overflow: hidden;
	overflow-anchor: none;

	&-nav-button {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: 2;
		padding: 0 56px;
		color: v-bind(arrowColor);
		cursor: pointer;
		background-color: transparent;

		&--left {
			left: 0;
			transform: rotate(180deg);
		}

		&--right {
			right: 0;
		}

		&:hover {
			opacity: 0.8;

			&.is-transitioning {
				cursor: default;
			}
		}
	}

	&__dots {
		position: absolute;
		bottom: 32px;
		left: 50%;
		z-index: 2;
		display: flex;
		gap: 8px;
		transform: translateX(-50%);

		.dot {
			width: 10px;
			height: 10px;
			cursor: pointer;
			background-color: v-bind(dotColor);
			border-radius: 50px;
			opacity: 0.5;

			&--current {
				opacity: 1;
			}
		}
	}
}

@include site-engine-mobile {
	.slideshow {
		min-height: calc(var(--block-height-on-resize, v-bind(mobileMinHeight)) * 1px + var(--header-height, 0px));

		&-nav-button {
			padding: 28px;
		}
	}
}

.slide-forward-enter-active,
.slide-forward-leave-active,
.slide-backward-enter-active,
.slide-backward-leave-active {
	transition: all 0.6s ease;
}

.slide-forward-leave-active,
.slide-backward-leave-active {
	position: absolute;
	left: 0;
}

.slide-forward-enter-from {
	transform: translateX(100%);
}

.slide-forward-leave-to {
	transform: translateX(-100%);
}

.slide-backward-enter-from {
	transform: translateX(-100%);
}

.slide-backward-leave-to {
	transform: translateX(100%);
}
</style>
