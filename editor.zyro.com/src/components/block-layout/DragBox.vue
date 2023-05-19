<template>
	<div
		class="drag-box"
		:class="{
			'drag-box--selected': isAreaSelected,
			'drag-box--dragging': isDragging
		}"
	/>
</template>

<script>
import {
	defineComponent,
	computed,
	ref,
} from 'vue';

export default defineComponent({
	props: {
		position: {
			type: Object,
			required: true,
		},
		isAreaSelected: {
			type: Boolean,
			default: false,
		},
		isDragging: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const isDragged = ref(false);
		const leftCSSVar = computed(() => `${props.position.left}px`);
		const topCSSVar = computed(() => `${props.position.top}px`);
		const widthCSSVar = computed(() => `${props.position.width}px`);
		const heightCSSVar = computed(() => `${props.position.height}px`);

		return {
			leftCSSVar,
			topCSSVar,
			widthCSSVar,
			heightCSSVar,
			isDragged,
		};
	},
});
</script>

<style lang="scss" scoped>
.drag-box {
	position: fixed;
	top: v-bind(topCSSVar);
	left: v-bind(leftCSSVar);
	width: v-bind(widthCSSVar);
	height: v-bind(heightCSSVar);
	background-color: rgba($color-azure, 5%);
	border: 2px solid $color-azure;
	z-index: $z-index-controls-edit-block;

	&--selected {
		cursor: grab;
		position: absolute;
		border: none;
		outline: 2px solid $color-azure;
	}

	// Fixes block hovering while moving selected area
	// without this moving multi selected elements between block won't work
	// because hoveredBlockId will not be updated.
	&--dragging {
		pointer-events: none;
	}
}
</style>
