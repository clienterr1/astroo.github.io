<template>
	<div
		ref="sentry"
		class="sentry"
	/>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	emits: ['toggle-mobile'],

	observer: null,

	mounted() {
		this.$options.observer = new IntersectionObserver((entries) => {
			// when sentry is not fully in the viewport:
			this.$emit('toggle-mobile', !entries[0].isIntersecting);
		}, {
			threshold: 1,
		});
		this.$options.observer.observe(this.$refs.sentry);
	},

	beforeUnmount() {
		this.$options.observer.unobserve(this.$refs.sentry);
	},
});
</script>

<style lang="scss" scoped>
.sentry {
	position: fixed;
	top: 0;
	left: 0;
	z-index: -1;
	width: $media-mobile;
	height: 1px;
	pointer-events: none;
}
</style>
