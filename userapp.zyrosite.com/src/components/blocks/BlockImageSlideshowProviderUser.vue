<template>
	<BlockImageSlideshow
		:slides="slides"
		:is-loop-enabled="isLoopEnabled"
		:current-slide-index="currentSlideIndex"
		:slide-direction="slideDirection"
		:dot-color="dotColor"
		:is-navigation-arrows-visible="isNavigationArrowsVisible"
		:is-navigation-dots-visible="isNavigationDotsVisible"
		:arrow-color="arrowColor"
		:is-next-button-disabled="!canSlideToNext"
		:is-previous-button-disabled="!canSlideToPrevious"
		:desktop-min-height="desktopMinHeight"
		:mobile-min-height="mobileMinHeight"
		:website-id="websiteId"
		@transition-start="isTransitioning = true"
		@transition-end="isTransitioning = false"
		@mouseenter="clearAutoplayInterval"
		@mouseleave="resetAutoplayInterval"
		@next-slide="slideToNext"
		@previous-slide="slideToPrevious"
		@dot-click="slideTo"
	/>
</template>

<script>
import {
	ref,
	defineComponent,
	computed,
	toRefs,
} from 'vue';
import BlockImageSlideshow from '@zyro-inc/site-modules/components/blocks/slideshow/BlockImageSlideshow.vue';
import { useImageSlideshow } from '@zyro-inc/site-modules/components/blocks/slideshow/useImageSlideshow';

export default defineComponent({
	components: {
		BlockImageSlideshow,
	},
	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
		websiteId: {
			type: String,
			required: true,
		},
	},
	setup(props) {
		const { data } = toRefs(props);
		const isTransitioning = ref(false);
		const desktopHeight = computed(() => `${data.value.desktop.minHeight}px`);
		const mobileHeight = computed(() => `${data.value.mobile.minHeight}px`);
		const dotColor = computed(() => data.value.settings.styles.navigationDotsColor);
		const arrowColor = computed(() => data.value.settings.styles.navigationArrowsColor);
		const slides = computed(() => data.value.slides);
		const isLoopEnabled = computed(() => data.value.isLoopEnabled);
		const isAutoplayEnabled = computed(() => data.value.isAutoplayEnabled);
		const autoplayInterval = computed(() => data.value.autoplayInterval);
		const isNavigationDotsVisible = computed(() => data.value.isNavigationDotsVisible);
		const isNavigationArrowsVisible = computed(() => data.value.isNavigationArrowsVisible);
		const desktopMinHeight = computed(() => data.value.desktop.minHeight);
		const mobileMinHeight = computed(() => data.value.mobile.minHeight);

		const {
			slideDirection,
			currentSlideIndex,
			canSlideToNext,
			canSlideToPrevious,
			slideToNext,
			slideToPrevious,
			slideTo,
			resetAutoplayInterval,
			clearAutoplayInterval,
		} = useImageSlideshow({
			isAutoplayEnabled,
			isLoopEnabled,
			autoplayInterval,
			isTransitioning,
			slides,
		});

		return {
			canSlideToNext,
			canSlideToPrevious,
			desktopHeight,
			mobileHeight,
			slides,
			currentSlideIndex,
			slideDirection,
			isLoopEnabled,
			isTransitioning,
			resetAutoplayInterval,
			dotColor,
			arrowColor,
			isNavigationDotsVisible,
			isNavigationArrowsVisible,
			clearAutoplayInterval,
			slideToNext,
			slideToPrevious,
			slideTo,
			desktopMinHeight,
			mobileMinHeight,
		};
	},
});
</script>
