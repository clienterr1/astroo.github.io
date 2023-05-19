<template>
	<svg
		v-if="isOverlayVisible"
		class="overlay-modal"
		:[DATA_ATTRIBUTE_SELECTOR]="DATA_ATTRIBUTE_SELECTOR_MODAL_OVERLAY"
		@click="handleOverlayClick"
	>
		<path :d="pathDefinition" />
	</svg>
</template>

<script>
/**
 * Overlay.vue
 * Generates a full-screen overlay if highlightedElementCoordinates are not set.
 * Otherwise, generates an overlay and highlights (crops out) the given coordinates
 */
import { useOverlay } from '@/use/useOverlay';

import { defineComponent } from 'vue';
import {
	DATA_ATTRIBUTE_SELECTOR,
	DATA_ATTRIBUTE_SELECTOR_MODAL_OVERLAY,
} from '@zyro-inc/site-modules/constants';

export default defineComponent({
	setup() {
		const {
			isOverlayVisible,
			isHighlightedElementInteractive,
			highlightedElementCoordinates,
			hideOverlayOnClick,
			hideOverlay,
		} = useOverlay();

		return {
			isOverlayVisible,
			isHighlightedElementInteractive,
			highlightedElementCoordinates,
			DATA_ATTRIBUTE_SELECTOR,
			DATA_ATTRIBUTE_SELECTOR_MODAL_OVERLAY,
			hideOverlayOnClick,
			hideOverlay,
		};
	},

	computed: {
		pathDefinition() {
			const {
				width = 0,
				height = 0,
				x = 0,
				y = 0,
			} = this.highlightedElementCoordinates || {};

			const {
				innerWidth: w,
				innerHeight: h,
			} = window;

			// Overlay is created by generating an SVG element.
			// Source: Shepherd.js
			// Link: https://github.com/shipshapecode/shepherd/blob/master/src/js/utils/overlay-path.js
			return `M${w},${h}\
					H0\
					V0\
					H${w}\
					V${h}\
					Z\
					M${x},${y}\
					a0,0,0,0,0-0,0\
					V${height + y}\
					a0,0,0,0,0,0,0\
					H${width + x}\
					a0,0,0,0,0,0-0\
					V${y}\
					a0,0,0,0,0-0-0\
					Z`;
		},
	},

	methods: {
		handleOverlayClick() {
			if (this.hideOverlayOnClick) {
				this.hideOverlay();
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.overlay-modal {
	position: fixed;
	top: 0;
	left: 0;
	z-index: $z-index-overlay;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	opacity: 0.5;
}
</style>
