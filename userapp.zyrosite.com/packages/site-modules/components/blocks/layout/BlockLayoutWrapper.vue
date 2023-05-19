<template>
	<div
		class="block-layout"
		:class="{
			'block-layout--legacy': isMobileLegacy,
			'block-layout--layout': !isMobileLegacy,
		}"
	>
		<slot />
	</div>
</template>
<script>
import {
	MOBILE_BLOCK_WIDTH,
	DESKTOP_BLOCK_WIDTH,
	MOBILE_BLOCK_PADDING_X,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	name: 'BlockLayoutWrapper',

	props: {
		isMobileLegacy: {
			type: Boolean,
			default: false,
		},
		isBlockResponsive: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const mobileBlockPaddingCSSVar = computed(() => {
			if (props.isBlockResponsive) {
				return `0 ${(MOBILE_BLOCK_PADDING_X * 100) / MOBILE_BLOCK_WIDTH}vw`;
			}

			return `0 ${MOBILE_BLOCK_PADDING_X}px`;
		});

		return {
			mobileMaxWidthCSSVar: computed(() => `${MOBILE_BLOCK_WIDTH}px`),
			maxWidthCSSVar: computed(() => `${DESKTOP_BLOCK_WIDTH}px`),
			mobileBlockPaddingCSSVar,
			tabletBlockPaddingCSSVar: computed(() => `0 ${MOBILE_BLOCK_PADDING_X}px`),
		};
	},
});
</script>
<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.block-layout {
	z-index: $z-index-site-engine-block-grid;
	display: grid;
	grid-template-rows: var(--grid-template-rows);
	grid-template-columns: var(--grid-template-columns);
	width: 100%;
	max-width: v-bind(maxWidthCSSVar);
	min-height: var(--block-min-height);
	margin: 0 auto;
}

@include site-engine-mobile {
	.block-layout {
		&--layout {
			grid-template-rows: var(--m-grid-template-rows);
			grid-template-columns: var(--m-grid-template-columns);
			max-width: v-bind(mobileMaxWidthCSSVar);
			min-height: var(--m-block-min-height);
			padding: v-bind(mobileBlockPaddingCSSVar);
		}

		// Render the elements in a flexbox column so we can map their positions for layout
		&--legacy {
			display: flex;
			flex-direction: column;
			grid-gap: 0;
			min-height: auto;
			padding: var(--m-block-padding);
		}
	}
}

// Small desktop size
@media screen and (min-width: $media-mobile) and (max-width: $media-desktop-editor) {
	.block-layout {
		&--layout {
			grid-template-rows: var(--small-desktop-grid-template-rows);
			min-height: var(--small-desktop-block-min-height);
		}
	}
}

// Tablet size
@media screen and (min-width: 415px) and (max-width: $media-mobile) {
	.block-layout {
		&--layout {
			grid-template-rows: var(--t-grid-template-rows);
			min-height: var(--t-block-min-height);
			padding: v-bind(tabletBlockPaddingCSSVar);
		}
	}
}
</style>
