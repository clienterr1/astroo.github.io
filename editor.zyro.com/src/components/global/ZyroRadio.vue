<template>
	<div class="zyro-radio">
		<input
			:id="radioId"
			type="radio"
			class="zyro-radio__input"
			:checked="value === modelValue"
			@change="$emit('update:model-value', value)"
		>
		<!-- Fake label for styling -->
		<label
			:for="radioId"
			class="zyro-radio__label"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';
import { generateRandomId } from '@/utils/generateRandomId';

export default defineComponent({
	props: {
		id: {
			type: String,
			default: '',
		},
		modelValue: {
			type: String,
			required: true,
		},
		value: {
			type: String,
			required: true,
		},
	},
	emits: ['update:model-value'],

	computed: {
		radioId() {
			return this.id || generateRandomId();
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-radio {
	$this: &;

	display: inline-block;
	height: 20px;
	font-size: 20px;

	&__label {
		display: inline-block;
		width: 1em;
		height: 1em;
		cursor: pointer;
		background: $color-light;
		border: 1px solid $color-dark;
		border-radius: 1em;
		transition: all 250ms ease;
	}

	&__input {
		display: none;
		visibility: hidden;
		appearance: none;

		&:checked + #{$this}__label {
			background-color: $color-dark;
			box-shadow: inset 0 0 0 4px $color-light;
		}

		&:disabled + #{$this}__label {
			background: $color-gray-border;
			border-color: $color-gray-border;
			box-shadow: inset 0 0 0 4px $color-light;
		}

		&:focus + #{$this}__label {
			border-color: $color-dark;
			outline: none;
		}
	}
}
</style>
