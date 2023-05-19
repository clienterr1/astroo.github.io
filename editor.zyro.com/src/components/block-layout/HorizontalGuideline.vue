<template>
	<div
		class="horizontal-guideline"
		:style="{ '--top': top, }"
	/>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
	top: {
		type: Number,
		default: null,
	},
});

const topCssVar = computed(() => `${props.top}px`);
</script>

<style lang="scss" scoped>
$border-width: 2px;

.horizontal-guideline {
	position: absolute;
	z-index: $z-index-controls-block-selection;
	pointer-events: none;
	top: calc(v-bind(topCssVar) - $border-width);
	left: 0;
	width: 100%;
	border-top: $border-width dashed $color-azure;
}
</style>
