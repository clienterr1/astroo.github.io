<template>
	<div
		class="overlay-outline"
		:style="outlineCSSVars"
	/>
</template>
<script>

import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		outlineStyle: {
			type: String,
			default: 'solid',
		},
		outlineColor: {
			type: String,
			default: 'var(--color-azure-dark)',
		},
	},

	computed: {
		outlineCSSVars() {
			return {
				'--outline-style': this.outlineStyle,
				'--outline-color': this.outlineColor,
			};
		},
	},
});
</script>
<style lang="scss" scoped>
	.overlay-outline {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		outline: 2px var(--outline-style) var(--outline-color);
	}
</style>
