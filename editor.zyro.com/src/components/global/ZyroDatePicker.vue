<template>
	<input
		class="datepicker"
		type="date"
		:min="min"
		:value="modelValue"
		@input="$emit('update:model-value', $event.target.value)"
	>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		modelValue: {
			type: [
				Object,
				String,
			],
			required: true,
		},
		min: {
			type: String,
			default: '',
		},
	},
	emits: ['update:model-value'],
});
</script>

<style lang="scss" scoped>
.datepicker {
	width: 100%;
	padding: 14px 16px;
	background: $color-gray-light;
	border: 1px solid transparent;
	transition: 0.1s ease-in-out border-color;

	&:focus,
	&:active {
		border-color: $color-gray;
		outline: none;
	}

	&:hover {
		border-color: $color-gray-border;
	}
}
</style>
