<template>
	<BlockSlideshow
		ref="slideshowRef"
		class="block-slideshow"
		:style="fixedBackgroundImageStyle"
		:slides="slidesWithSrc"
		:current-slide-index="currentSlideIndex"
		:current-sliding-direction="currentSlidingDirection"
		:slideshow-settings="slideshowSettings"
		:is-previous-slide-navigation-visible="isPreviousSlideNavigationVisible"
		:is-next-slide-navigation-visible="isNextSlideNavigationVisible"
		:slides-count="slidesCount"
		:current-element-id="currentElementId"
		@previous-slide:click="goToPreviousSlide"
		@next-slide:click="goToNextSlide"
		@indicator:click="goToSlide"
		@transition-start="setIsSlideTransitioning(true)"
		@transition-end="setIsSlideTransitioning(false)"
	>
		<template #default="{ slide }">
			<BlockGrid
				:slideshow-id="blockId"
				:block-id="slide.blockId"
				:is-block-hovered="isBlockHovered"
				:class="{ 'block-grid--mobile-full-height': slideshowSettings.isMobileFullScreenHeightEnabled }"
				:data="slide.data"
				:components="components"
				@rows-changed="updateSlideshowRows"
				@update-mobile-padding="updateSlideshowMobilePadding"
				@set-edit-control-visibility="$emit('set-edit-control-visibility', $event)"
				@lock-hovered-block="$emit('lock-hovered-block', $event)"
				@drag-status-change="$emit('drag-status-change', $event)"
			/>
		</template>
	</BlockSlideshow>
</template>
<script>
import {
	onMounted,
	onUnmounted,
	defineComponent,
} from 'vue';
import {
	mapState,
	mapActions,
} from 'vuex';

import BlockSlideshow from '@zyro-inc/site-modules/components/blocks/slideshow/BlockSlideshow.vue';
import {
	DIRECTION_LEFT,
	useBlockSlideshow,
} from '@zyro-inc/site-modules/components/blocks/slideshow/useBlockSlideshow';
import { FULL_WIDTH } from '@zyro-inc/site-modules/utils/getGridItemSize';
import { getOptimizedSrc } from '@zyro-inc/site-modules/utils/getSrcsets';

import BlockGrid from '@/components/block-grid/BlockGrid.vue';

export default defineComponent({
	components: {
		BlockSlideshow,
		BlockGrid,
	},

	props: {
		blocks: {
			type: Object,
			required: true,
		},
		components: {
			type: Object,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
		blockId: {
			type: String,
			required: true,
		},
		isBlockHovered: {
			type: Boolean,
			default: false,
		},
	},
	emits: [
		'lock-hovered-block',
		'set-edit-control-visibility',
		'drag-status-change',
	],
	setup(props) {
		const {
			fixedBackgroundImageStyle,
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
			setActiveSlide,
			removeActiveSlide,
			slideshowRef,
		} = useBlockSlideshow(props);

		onMounted(() => {
			/**
			 * Set default active slide on mount - first slide
			 */
			setActiveSlide({
				slideshowId: props.blockId,
				slideId: props.blocks[props.blockId].slides[0].blockId,
			});
			setSlidingDirection(DIRECTION_LEFT);
			setIsSlideTransitioning(false);
		});

		onUnmounted(() => {
			/**
			 * Removing slideshow key value when block is delete to prevent
			 * memory leak
			 */
			removeActiveSlide(props.blockId);
		});

		return {
			fixedBackgroundImageStyle,
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
		};
	},

	computed: {
		...mapState([
			'currentElementId',
			'websiteId',
		]),

		slidesWithSrc() {
			return this.slides.map((slide) => {
				const backgroundSrc = getOptimizedSrc(slide.data.background.origin, slide.data.background.path, this.websiteId, {
					width: FULL_WIDTH,
					preload: true,
				});

				return {
					...slide,
					data: {
						...slide.data,
						background: {
							...slide.data.background,
							src: backgroundSrc,
						},
					},
				};
			});
		},
	},

	methods: {
		...mapActions(['updateBlockData']),
		updateSlideshowRows(rows) {
			if (rows <= this.data.settings.styles.rows) {
				return;
			}

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							rows,
						},
					},
				},
				merge: true,
				pushToHistory: true,
			});
		},
		updateSlideshowMobilePadding(padding) {
			if (padding === this.data.settings.styles['m-block-padding']) {
				return;
			}

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							'm-block-padding': padding,
						},
					},
				},
				merge: true,
				pushToHistory: true,
			});
		},
	},
});
</script>
