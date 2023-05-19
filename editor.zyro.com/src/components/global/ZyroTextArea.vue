<template>
	<textarea
		ref="textareaRef"
		class="zyro-textarea"
		:class="[
			{ [`zyro-textarea--${theme}`]: theme },
			{ 'z-body-small': theme === 'primary' },
			{ 'z-body': theme === 'secondary' },
			{ 'zyro-textarea--light' : color },
			{ 'zyro-textarea--error' : error },
			{ 'zyro-textarea--resizable' : isResizable },
			{ 'zyro-textarea--min-height' : minHeight },
		]"
		:style="{ '--zyro-textarea-min-height': minHeight ? `${minHeight}px` : 'auto' }"
		:autofocus="autofocus"
		:placeholder="placeholder"
		:disabled="disabled"
		:maxlength="maxlength"
		:value="modelValue"
		autocomplete="off"
		@blur="$emit('text-area-blur', $event)"
		@focus="$emit('text-area-focus', $event)"
		@input="$emit('update:model-value', $event.target.value)"
	/>
</template>

<script>
import { defineComponent } from 'vue';

// - attrs
// disabled
//
export default defineComponent({
	props: {
		modelValue: {
			type: String,
			required: true,
		},
		placeholder: {
			type: String,
			default: '',
		},
		color: {
			type: String,
			default: '',
			validator(value) {
				return [
					'',
					'light',
				].includes(value);
			},
		},
		error: {
			type: String,
			default: '',
		},
		theme: {
			type: String,
			default: 'primary',
			validator: (value) => [
				'primary',
				'secondary',
				'hostinger',
			].includes(value),
		},
		isResizable: {
			type: Boolean,
			default: false,
		},
		maxlength: {
			type: [
				Number,
				String,
			],
			default: '',
		},
		autofocus: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		minHeight: {
			type: Number,
			default: 130,
		},
	},

	emits: [
		'update:model-value',
		'text-area-blur',
		'text-area-focus',
	],
});
</script>

<style lang="scss" scoped>
.zyro-textarea {
	box-sizing: border-box;
	width: 100%;
	font-family: inherit;
	resize: none;
	outline: none;
	transition: border-color 0.1s ease-in-out;

	&--primary {
		padding: 14px 16px;
		background-color: $color-gray-light;
		border: 1px solid $color-gray-light;

		&:hover,
		&-hover {
			border-color: $color-gray-border;
		}

		&:focus,
		&-focus {
			border-color: $color-gray;
		}
	}

	&--secondary {
		min-height: 130px;
		padding: 16px;
		color: $color-dark;
		border: 1px solid $color-gray-border;
		border-radius: 8px;

		&:hover,
		&-hover {
			border-color: $color-gray;
		}

		&:focus,
		&-focus {
			border-color: $color-primary;
		}

		&::placeholder {
			// Same as z-body
			font-size: 16px;
			line-height: 1.5;
			letter-spacing: 0.03em;
		}
	}

	&--hostinger {
		padding: 12px 16px;
		font-size: 14px;
		color: $color-gray-dark;
		background-color: $color-light;
		border: 1px solid $color-gray-border;
		border-radius: 4px;
		transition: border 0.3s;

		&:hover {
			border: 1px solid $color-gray-border;
		}

		&:focus {
			border: 1px solid $color-primary;
		}
	}

	&--resizable {
		resize: vertical;
	}

	&--min-height {
		min-height: var(--zyro-textarea-min-height);
	}

	&--light {
		background-color: $color-light;
	}

	&--error {
		border-color: $color-primary;
	}

	&:disabled,
	&--disabled {
		color: $color-gray;
		border-color: $color-gray-light;

		&::placeholder {
			color: $color-gray;
		}
	}
}
</style>
