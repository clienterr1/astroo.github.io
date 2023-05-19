<template>
	<div class="loader">
		<div class="loader__element" />
		<div class="loader__element" />
		<div class="loader__element" />
		<div class="loader__element" />
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		color: {
			type: String,
			default: 'var(--color-dark)',
		},
		size: {
			type: String,
			default: '40px',
		},
		weight: {
			type: String,
			default: '4px',
		},
	},
});
</script>

<style lang="scss" scoped>
.loader {
	position: relative;
	width: v-bind(size);
	height: v-bind(size);

	&__element {
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
		border: v-bind(weight) solid;
		border-color: v-bind(color) transparent transparent transparent;
		border-radius: 50%;
		animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
	}

	&__element:nth-child(1) {
		animation-delay: -0.45s;
	}

	&__element:nth-child(2) {
		animation-delay: -0.3s;
	}

	&__element:nth-child(3) {
		animation-delay: -0.15s;
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
