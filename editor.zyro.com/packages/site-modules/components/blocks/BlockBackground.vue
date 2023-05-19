<template>
	<div
		class="block-background"
		:class="{ 'block-background--fixed': isFixed }"
		:style="computedStyles"
	>
		<img
			v-if="type === 'image' && src"
			:key="src"
			:alt="alt"
			:src="src"
			:srcset="srcset"
			width="100vw"
			sizes="(max-width: 500px) 800px, 100vw"
			:loading="isEager ? 'eager' : 'lazy'"
			class="block-background__image"
			:class="{ 'block-background__image--fixed': isFixed }"
		>
		<div
			v-if="isBackgroundOverlayShown"
			class="block-background__overlay"
			:class="{ 'block-background__overlay--fixed': isFixed }"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockBackground',

	props: {
		alt: {
			type: String,
			default: '',
		},
		overlayOpacity: {
			type: String,
			default: null,
		},
		type: {
			type: String,
			default: 'color',
		},
		src: {
			type: String,
			default: null,
		},
		srcset: {
			type: String,
			default: null,
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		color: {
			type: String,
			default: null,
		},
		isFixed: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		backgroundColor() {
			return this.type === 'color' ? this.color : 'transparent';
		},
		isBackgroundOverlayShown() {
			return this.type === 'image' && this.overlayOpacity;
		},
		computedStyles() {
			return {
				'--background-color': this.backgroundColor,
				'--background-overlay-opacity': this.isBackgroundOverlayShown ? this.overlayOpacity : 0,
			};
		},
	},
});
</script>

<style lang="scss">
.block-background {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: $z-index-site-engine-block-background;
	overflow: hidden;
	background-color: var(--background-color);

	// Height transition is needed to fix background images zooming on scroll on mobile
	// because of disappearing/appearing browser bottom navigation bar
	transition: background-color 0.3s ease-in-out, height 1ms linear 999s;

	// clip-path is needed for firefox, safari browsers without it fixed background covers all the page
	// -1px from bottom fixes 1px gap in chrome browsers
	&--fixed {
		bottom: -1px;
		clip-path: inset(0);
		backface-visibility: hidden;
	}

	&__image {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
		display: block;
		width: 100%;

		// By using 101% instead of 100%, the bug that caused a white gap to appear after an image was fixed.
		// This gap occurred because the uploaded image had a smaller size and different aspect ratio compared to the section.
		height: 101%;
		object-fit: cover;

		&--fixed {
			position: fixed;
			height: 100vh;
		}
	}

	&__overlay {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		width: 100%;
		height: 100%;
		background-color: $color-dark;
		opacity: var(--background-overlay-opacity);

		&--fixed {
			position: fixed;
			height: 100vh;
		}
	}
}
</style>
