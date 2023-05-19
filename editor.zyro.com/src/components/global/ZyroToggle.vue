<template>
	<div
		class="zyro-toggle"
	>
		<input
			:id="id"
			type="checkbox"
			:disabled="disabled"
			:checked="modelValue"
			class="zyro-toggle__input"
			@input="$emit('update:model-value', $event.target.checked)"
		>
		<label
			:for="id"
			class="zyro-toggle__label"
		/>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		id: {
			type: String,
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Boolean,
			required: true,
		},
	},
	emits: ['update:model-value'],
});
</script>

<style lang="scss" scoped>
.zyro-toggle {
	$this: &;

	display: inline-block;
	height: 20px;
	font-size: 20px;

	&__label {
		position: relative;
		display: inline-block;
		width: 2em;
		height: 1em;
		cursor: pointer;
		background: $color-gray;
		border-radius: 1em;
		transition: background 300ms ease;

		&::before {
			position: absolute;
			left: 0;
			width: 1em;
			height: 1em;
			content: "";
			background: $color-light;
			border-radius: 1em;
			box-shadow: inset 0 0 0 1px $color-gray;
			transition: transform 300ms ease;
		}
	}

	&__input {
		display: none;
		visibility: hidden;
		appearance: none;

		&:checked + #{$this}__label {
			background: $color-dark;

			&::before {
				box-shadow: inset 0 0 0 1px $color-dark;
				transform: translateX(100%);
			}
		}

		&:disabled + #{$this}__label {
			background: $color-gray-border;

			&::before {
				box-shadow: inset 0 0 0 1px $color-gray-border;
				transform: translateX(100%);
			}
		}

		&:focus + #{$this}__label {
			outline: none;
		}
	}
}
</style>
