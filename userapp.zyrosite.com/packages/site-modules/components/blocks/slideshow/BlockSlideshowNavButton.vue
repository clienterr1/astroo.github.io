<template>
	<button
		title="Slideshow side navigation button"
		class="nav-arrow-button"
	>
		<svg
			width="14"
			height="26"
			viewBox="0 0 14 26"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1 25L13 13L1 1"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SlideshowNavButton',
});
</script>
<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.nav-arrow-button {
	color: var(--navigationArrowsColor);
}

@include site-engine-mobile {
	.nav-arrow-button {
		svg {
			width: 8px;
			height: 16px;
		}
	}
}
</style>
