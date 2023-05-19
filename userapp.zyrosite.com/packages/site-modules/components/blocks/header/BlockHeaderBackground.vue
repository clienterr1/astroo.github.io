<template>
	<div
		class="background"
		:style="backgroundCSSVars"
		:class="{ 'background--with-image': backgroundImage }"
	/>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'BlockHeaderBackground',

	props: {
		type: {
			type: String,
			default: 'color',
		},
		imageUrl: {
			type: String,
			default: null,
		},
		color: {
			type: String,
			default: '',
		},
		isTransparent: {
			type: Boolean,
			default: false,
		},
		overlayOpacity: {
			type: Number,
			default: 0,
		},
	},

	computed: {
		backgroundImage() {
			return this.type === 'image' && this.imageUrl;
		},
		backgroundColor() {
			return this.type === 'color' ? this.color : 'transparent';
		},
		backgroundCSSVars() {
			return {
				'--background-color': this.isTransparent ? 'transparent' : this.backgroundColor,
				...(!!this.backgroundImage && {
					'--background-image': `url(${this.backgroundImage})`,
				}),
				...(!!this.overlayOpacity && {
					'--overlay-opacity': this.overlayOpacity,
				}),
			};
		},
	},
});
</script>

<style lang="scss">
.background {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: $z-index-site-engine-block-background;
	display: block;
	background-color: var(--background-color);
	transition: background-color 0.3s ease-in-out;

	&--with-image {
		background-image: var(--background-image);

		&::before {
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			width: 100%;
			height: 100%;
			content: " ";
			background-color: $color-dark;
			opacity: var(--overlay-opacity);
		}
	}
}
</style>
