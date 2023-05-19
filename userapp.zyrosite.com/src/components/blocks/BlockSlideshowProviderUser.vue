<template>
	<BlockSlideshow
		ref="slideshowRef"
		class="block-slideshow"
		:slides="slidesWithSrc"
		:current-slide-index="currentSlideIndex"
		:current-sliding-direction="currentSlidingDirection"
		:slideshow-settings="slideshowSettings"
		:is-previous-slide-navigation-visible="isPreviousSlideNavigationVisible"
		:is-next-slide-navigation-visible="isNextSlideNavigationVisible"
		:slides-count="slidesCount"
		@previous-slide:click="handlePreviousSlideClick"
		@next-slide:click="handleNextSlideClick"
		@indicator:click="handleDotSlideClick"
		@transition-start="setIsSlideTransitioning(true)"
		@transition-end="setIsSlideTransitioning(false)"
	>
		<template #default="{ slide }">
			<BlockGridUser
				:block-id="slide.blockId"
				:class="{ 'block-grid--mobile-full-height': slideshowSettings.isMobileFullScreenHeightEnabled }"
				:data="slide.data"
				:current-locale="currentLocale"
			/>
		</template>
	</BlockSlideshow>
</template>
<script>
import {
	onBeforeUnmount,
	onMounted,
	ref,
	defineComponent,
} from 'vue';
import { mapGetters } from 'vuex';

import BlockSlideshow from '@zyro-inc/site-modules/components/blocks/slideshow/BlockSlideshow.vue';
import {
	DIRECTION_LEFT,
	useBlockSlideshow,
} from '@zyro-inc/site-modules/components/blocks/slideshow/useBlockSlideshow';
import {
	getFullWidthSrcset,
	getOptimizedSrc,
} from '@zyro-inc/site-modules/utils/getSrcsets';
import { moveDirection } from '@zyro-inc/site-modules/utils/moveDirection';
import BlockGridUser from '@/components/block-grid/BlockGridUser.vue';

export default defineComponent({
	components: {
		BlockSlideshow,
		BlockGridUser,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		blocks: {
			type: Object,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		currentLocale: {
			type: String,
			required: true,
		},
	},

	setup(props) {
		const {
			slides,
			currentSlidingDirection,
			slideshowSettings,
			slidesCount,
			currentSlideIndex,
			isPreviousSlideNavigationVisible,
			isNextSlideNavigationVisible,
			goToNextSlide,
			goToPreviousSlide,
			goToSlide,
			setSlidingDirection,
			setIsSlideTransitioning,
			slideshowRef,
		} = useBlockSlideshow(props);
		const autoPlayInterval = ref(null);

		const autoplaySlides = () => setInterval(() => {
			const isLoopDisabledAndReachedLastSlide = !slideshowSettings.value.isLoopEnabled
				&& (currentSlideIndex.value === slidesCount.value - 1);

			if (isLoopDisabledAndReachedLastSlide) {
				clearInterval(autoPlayInterval.value);

				return;
			}

			goToNextSlide();
		}, slideshowSettings.value.autoplaySlidesIntervalSeconds * 1000);

		const resetAutoplayInterval = () => {
			clearInterval(autoPlayInterval.value);
			if (slideshowSettings.value.isAutoplayEnabled) {
				autoPlayInterval.value = autoplaySlides();
			}
		};

		const handlePreviousSlideClick = () => {
			goToPreviousSlide();
			resetAutoplayInterval();
		};

		const handleNextSlideClick = () => {
			goToNextSlide();
			resetAutoplayInterval();
		};

		const handleDotSlideClick = (index) => {
			goToSlide(index);
			resetAutoplayInterval();
		};

		const { enableMoveEvents } = moveDirection({
			move: {
				drag: false,
				swipe: true,
			},
			onMoveLeft: goToNextSlide,
			onMoveRight: goToPreviousSlide,
		});

		onMounted(() => {
			if (slideshowSettings.value.isAutoplayEnabled) {
				autoPlayInterval.value = autoplaySlides();
			}

			setSlidingDirection(DIRECTION_LEFT);
			setIsSlideTransitioning(false);
			enableMoveEvents(true, slideshowRef.value.$el);
		});

		onBeforeUnmount(() => {
			clearInterval(autoPlayInterval.value);
			enableMoveEvents(false, slideshowRef.value.$el);
		});

		return {
			slides,
			currentSlidingDirection,
			slideshowSettings,
			slidesCount,
			currentSlideIndex,
			isPreviousSlideNavigationVisible,
			isNextSlideNavigationVisible,
			goToNextSlide,
			goToPreviousSlide,
			goToSlide,
			setSlidingDirection,
			setIsSlideTransitioning,
			slideshowRef,
			handlePreviousSlideClick,
			handleNextSlideClick,
			handleDotSlideClick,
		};
	},

	computed: {
		...mapGetters(['siteId']),

		slidesWithSrc() {
			return this.slides.map((slide) => {
				const backgroundSrc = getOptimizedSrc(
					slide.data.background.origin,
					slide.data.background.path,
					this.siteId,
					{
						preload: true,
						isMobileFullScreen: this.slideshowSettings.isMobileFullScreenHeightEnabled,
					},
				);

				const backgroundSrcset = getFullWidthSrcset(
					slide.data.background.origin,
					slide.data.background.path,
					this.siteId,
					{
						preload: true,
						isMobileFullScreen: this.slideshowSettings.isMobileFullScreenHeightEnabled,
					},
				);

				return {
					...slide,
					data: {
						...slide.data,
						background: {
							...slide.data.background,
							srcset: backgroundSrcset,
							src: backgroundSrc,
						},
					},
				};
			});
		},
	},
});
</script>
