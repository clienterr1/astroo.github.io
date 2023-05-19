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
import BlockImageSlideshow from '@zyro-inc/site-modules/components/blocks/slideshow/BlockImageSlideshow.vue';
import { useImageSlideshow } from '@zyro-inc/site-modules/components/blocks/slideshow/useImageSlideshow';
import {
	ref,
	defineComponent,
	computed,
	onMounted,
	onUnmounted,
	toRefs,
} from 'vue';
import { useStore } from 'vuex';

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
			required: true,
		},
	},
	setup(props) {
		const { data } = toRefs(props);
		const {
			dispatch,
			state,
		} = useStore();
		const isTransitioning = ref(false);
		const slides = computed(() => data.value.slides);
		const isLoopEnabled = computed(() => data.value.isLoopEnabled);
		const isAutoplayEnabled = computed(() => data.value.isAutoplayEnabled);
		const autoplayInterval = computed(() => data.value.autoplayInterval);
		const dotColor = computed(() => data.value.settings.styles.navigationDotsColor);
		const arrowColor = computed(() => data.value.settings.styles.navigationArrowsColor);
		const isNavigationDotsVisible = computed(() => data.value.isNavigationDotsVisible);
		const isNavigationArrowsVisible = computed(() => data.value.isNavigationArrowsVisible);
		const desktopMinHeight = computed(() => data.value.desktop.minHeight);
		const mobileMinHeight = computed(() => data.value.mobile.minHeight);
		const websiteId = ref(state.websiteId);
		const {
			slideDirection,
			currentSlideIndex,
			slideshowRefs,
			canSlideToNext,
			canSlideToPrevious,
			slideToNext,
			slideToPrevious,
			slideTo,
			slideCount,
			resetAutoplayInterval,
			clearAutoplayInterval,
		} = useImageSlideshow({
			isAutoplayEnabled,
			isLoopEnabled,
			autoplayInterval,
			isTransitioning,
			slides,
		});

		const addSlides = (newSlides) => {
			dispatch('updateBlockData', {
				blockId: props.blockId,
				blockData: {
					slides: [
						...slides.value,
						...newSlides,
					],
				},
				merge: true,
			});
		};

		onMounted(() => {
			// Builder specfic
			// Props & methods that we want to access in other scopes using useImageSlideshow() composable
			slideshowRefs.value[`${props.blockId}`] = {
				canSlideToNext,
				canSlideToPrevious,
				slideToNext,
				slideToPrevious,
				slideTo,
				slideCount,
				currentSlideNumber: computed(() => currentSlideIndex.value + 1),
				addSlides,
			};
		});

		onUnmounted(() => {
			delete slideshowRefs.value[`${props.blockId}`];
		});

		return {
			canSlideToNext,
			canSlideToPrevious,
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
			websiteId,
		};
	},
});
</script>
