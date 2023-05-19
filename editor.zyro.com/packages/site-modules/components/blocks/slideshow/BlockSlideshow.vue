<template>
	<div class="slideshow">
		<div class="slideshow__slides">
			<BlockSlideshowSlide
				v-for="(slide, index) in slides"
				:key="slide.blockId"
				:is-active="currentSlideIndex === index"
				:sliding-direction="currentSlidingDirection"
				@transition-start="$emit('transition-start')"
				@transition-end="$emit('transition-end')"
			>
				<BlockBackground
					v-if="slide.data.background"
					:block-id="slide.blockId"
					:srcset="slide.data.background.srcset"
					:src="slide.data.background.src"
					:overlay-opacity="slide.data.background['overlay-opacity']"
					:type="slide.data.background.current"
					:color="slide.data.background.color"
					:alt="slide.data.background.alt"
					is-lazy
				/>
				<slot :slide="slide" />
			</BlockSlideshowSlide>
		</div>
		<template v-if="slideshowSettings.isNavigationArrowsVisible">
			<BlockSlideshowNavButton
				v-if="isPreviousSlideNavigationVisible"
				class="slideshow__nav-button slideshow__nav-button--left"
				:class="{ 'slideshow__nav-button--is-click-disabled': currentElementId }"
				@click="$emit('previous-slide:click')"
			/>
			<BlockSlideshowNavButton
				v-if="isNextSlideNavigationVisible"
				class="slideshow__nav-button slideshow__nav-button--right"
				:class="{ 'slideshow__nav-button--is-click-disabled': currentElementId }"
				@click="$emit('next-slide:click')"
			/>
		</template>
		<BlockSlideshowNavBottom
			v-if="slideshowSettings.isNavigationBulletsVisible"
			:slide-count="slidesCount"
			:active-slide-index="currentSlideIndex"
			@indicator:click="$emit('indicator:click', $event)"
		/>
	</div>
</template>
<script>
import BlockBackground from '@zyro-inc/site-modules/components/blocks/BlockBackground.vue';
import BlockSlideshowNavBottom from '@zyro-inc/site-modules/components/blocks/slideshow/BlockSlideshowNavBottom.vue';
import BlockSlideshowNavButton from '@zyro-inc/site-modules/components/blocks/slideshow/BlockSlideshowNavButton.vue';
import BlockSlideshowSlide from '@zyro-inc/site-modules/components/blocks/slideshow/BlockSlideshowSlide.vue';
import { DIRECTION_LEFT } from '@zyro-inc/site-modules/components/blocks/slideshow/useBlockSlideshow';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		BlockBackground,
		BlockSlideshowNavBottom,
		BlockSlideshowNavButton,
		BlockSlideshowSlide,
	},
	props: {
		slides: {
			type: Array,
			required: true,
		},
		currentSlideIndex: {
			type: Number,
			required: true,
		},
		currentSlidingDirection: {
			type: String,
			default: DIRECTION_LEFT,
		},
		slideshowSettings: {
			type: Object,
			required: true,
		},
		isPreviousSlideNavigationVisible: {
			type: Boolean,
			required: true,
		},
		isNextSlideNavigationVisible: {
			type: Boolean,
			required: true,
		},
		slidesCount: {
			type: Number,
			required: true,
		},
		currentElementId: {
			type: String,
			default: null,
		},
	},
	emits: [
		'indicator:click',
		'transition-start',
		'transition-end',
		'next-slide:click',
		'previous-slide:click',
	],
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/components/blocks/slideshow/BlockSlideshow";
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.slideshow {
	z-index: 13;

	&__nav-button {
		position: absolute;
		top: 0;
		bottom: 0;
		z-index: $z-index-controls-slideshow;
		padding: 12px 58px;
		cursor: pointer;
		background: transparent;

		&:hover,
		&:focus-visible {
			opacity: 0.6;
		}

		&--left {
			left: 0;
			transform: rotate(180deg);
		}

		&--right {
			right: 0;
		}

		&--is-click-disabled {
			pointer-events: none;
		}
	}
}

@include site-engine-mobile {
	.slideshow {
		&__nav-button {
			padding: 12px 28px;
		}
	}
}

</style>
