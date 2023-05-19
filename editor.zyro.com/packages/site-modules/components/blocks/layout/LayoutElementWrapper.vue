<template>
	<div
		class="layout-element"
		:class="{
			'layout-element--legacy': isMobileLegacy,
			'layout-element--layout': !isMobileLegacy,
		}"
		:style="computedStyles"
	>
		<slot />
	</div>
</template>

<script>
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LayoutElementWrapper',

	props: {
		elementData: {
			type: Object,
			required: true,
		},
		isMobileLegacy: {
			type: Boolean,
			default: false,
		},
		isMobileView: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		settings() {
			return this.elementData.settings;
		},
		styles() {
			return this.settings.styles;
		},
		innerBackgroundValue() {
			const { innerBackground } = this.elementData;

			if (!innerBackground) {
				return {};
			}

			const currentBackground = innerBackground[innerBackground.current];

			if (innerBackground.current !== 'image') {
				return {
					'--gridItemInnerBackground': currentBackground,
				};
			}

			return {
				'--gridItemInnerBackground': `url(${currentBackground})`,
				'--gridItemInnerBackgroundOverlayOpacity': 'overlay-opacity' in innerBackground ? innerBackground['overlay-opacity'] : null,
			};
		},
		isHiddenDesktop() {
			return this.elementData.desktop.isHidden;
		},
		isHiddenMobile() {
			return this.elementData.mobile.isHidden;
		},
		computedStyles() {
			return {
				...objectToCssVariables(this.styles),
				...this.innerBackgroundValue,
				...((this.isHiddenDesktop && !this.isMobileView) && {
					'--hidden-element-z-index': 0,
				}),
				...((this.isHiddenMobile && this.isMobileView) && {
					'--m-hidden-element-z-index': 0,
				}),
			};
		},
	},
});
</script>
<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.layout-element {
	position: relative;
	left: var(--left);
	z-index: var(--hidden-element-z-index, var(--z-index));
	display: grid;
	grid-row: var(--grid-row);
	grid-column: var(--grid-column);
	width: var(--element-width, 100%);
	height: var(--element-height, 100%);
	text-align: var(--text);
}

@include site-engine-mobile {
	.layout-element {
		z-index: var(--m-hidden-element-z-index, var(--z-index));
		text-align: var(--m-text, var(--text));

		&--layout {
			grid-row: var(--m-grid-row);
			grid-column: var(--m-grid-column);
		}

		// Render the element as a flexbox item so we can its position for layout
		&--legacy {
			align-items: var(--m-align, var(--align));
			align-self: var(--m-align-self);
			width: var(--m-width, 100%);
			max-width: 100%;
			height: auto;
			margin: var(--m-element-margin);
			text-align: var(--m-text, var(--text));

			&:last-of-type {
				margin-bottom: 0;
			}
		}
	}
}
</style>
