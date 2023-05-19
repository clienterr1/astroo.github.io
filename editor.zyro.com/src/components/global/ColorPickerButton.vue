<template>
	<button
		:data-qa="'color-picker-btn'"
		class="color-picker-button"
		:style="{ backgroundColor: color }"
		:class="computedClass"
	/>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		color: {
			type: String,
			default: 'rgb(255, 255, 255)',
		},
		size: {
			type: String,
			default: 'md',
			validator: (value) => ([
				'sm',
				'md',
			].includes(value)),
		},
	},
	computed: {
		computedClass() {
			return {
				[`color-picker-button--${this.size}`]: this.size,
			};
		},
	},
});
</script>

<style lang="scss" scoped>
.color-picker-button {
	display: block;
	cursor: pointer;
	border: 1px solid $color-gray;
	border-radius: 50%;

	&--sm {
		width: 16px;
		height: 16px;
	}

	&--md {
		width: 24px;
		height: 24px;
	}
}
</style>
