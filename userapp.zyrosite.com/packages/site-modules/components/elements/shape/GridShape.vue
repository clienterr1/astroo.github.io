<template>
	<div
		class="grid-shape"
		v-html="svg"
	/>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridShape',

	props: {
		svg: {
			type: String,
			required: true,
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.grid-shape {
	display: flex;
	width: 100%;
	height: var(--shape-height, 100%);

	@include site-engine-mobile {
		height: var(--m-shape-height, 100%);
	}

	// Tablet size
	@media screen and (min-width: $media-mobile-editor) and (max-width: $media-mobile) {
		height: var(--t-shape-height, 100%);
	}

	// Small desktop
	@media screen and (min-width: $media-mobile) and (max-width: $media-desktop-editor) {
		height: var(--small-desktop-shape-height, 100%);
	}

	svg {
		width: 100%;
		height: 100%;
		fill: var(--shape-color);
		stroke: var(--shape-color);
	}
}

</style>
