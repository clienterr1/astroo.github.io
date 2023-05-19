<template>
	<div
		class="zyro-input"
		:class="[
			{ [`zyro-input--${theme}`]: theme },
			{ 'z-body-small': theme === 'primary' },
			{ 'z-body': theme === 'secondary' },
			{ 'zyro-input--light' : color },
			{ 'zyro-input--error' : error },
			{ 'zyro-input--spinner-disabled' : isSpinnerDisabled },
		]"
		:style="computedStyles"
	>
		<input
			ref="inputRef"
			v-qa="inputDataQa"
			class="zyro-input__input"
			:value="modelValue"
			:disabled="disabled"
			autocomplete="off"
			:placeholder="placeholder"
			:type="type"
			:maxlength="maxlength"
			:autofocus="autofocus"
			:min="minValue"
			@keydown="handleInputControls"
			@keyup="resetPressedKeyModifiers"
			@input="handleInputChange"
			@blur="$emit('input-blur', $event)"
			@focus="$emit('input-focus', $event)"
			@keyup.enter="$emit('keyup-enter')"
		>
		<span
			v-if="suffix"
			ref="inputSuffix"
			class="zyro-input__suffix"
		>
			{{ suffix }}
		</span>
	</div>
</template>

<script>
import {
	getCode,
	CODE,
} from '@zyro-inc/site-modules/utils/getCode';

import { defineComponent } from 'vue';

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
		disabled: {
			type: Boolean,
			default: false,
		},
		type: {
			type: String,
			default: '',
		},
		maxlength: {
			type: [
				String,
				Number,
			],
			default: null,
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
			type: [
				String,
				Boolean,
			],
			default: '',
		},
		padding: {
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
		minValue: {
			type: Number,
			default: null,
		},
		autofocus: {
			type: Boolean,
			default: false,
		},
		suffix: {
			type: String,
			default: null,
		},
		focusOnMount: {
			type: Boolean,
			default: false,
		},
		isSpinnerDisabled: {
			type: Boolean,
			default: true,
		},
		inputType: {
			type: String,
			default: '',
			validator: (value) => [
				'',
				'number',
			].includes(value),
		},
		inputDataQa: {
			type: String,
			default: '',
		},
	},
	emits: [
		'update:model-value',
		'input-blur',
		'input-focus',
		'keyup-enter',
	],

	data() {
		return {
			inputTextCanvas: null,
			suffixPosition: null,
			shiftKeyPressed: false,
			metaKeyPressed: false,
		};
	},

	computed: {
		computedStyles() {
			return {
				'--z-padding': this.padding || undefined,
				'--suffix-left': this.suffixPosition || undefined,
			};
		},
		getInputStyles() {
			const fontSize = window.getComputedStyle(this.$refs.inputRef, null).getPropertyValue('font-size');
			const fontFamily = window.getComputedStyle(this.$refs.inputRef, null).getPropertyValue('font-family');

			return `${fontSize} ${fontFamily}`;
		},
	},

	watch: {
		modelValue: {
			handler() {
				if (this.suffix) {
					this.updateSuffixPosition();
				}
			},
		},
	},

	mounted() {
		if (this.suffix) {
			this.inputTextCanvas = document.createElement('canvas');
			this.getTextWidth(this.modelValue);
			this.updateSuffixPosition();
		}

		if (this.focusOnMount) {
			this.$refs.inputRef.focus();
		}
	},

	methods: {
		getTextWidth(text) {
			const context = this.inputTextCanvas.getContext('2d');
			const metrics = context.measureText(text);

			context.font = this.getInputStyles;

			return metrics.width;
		},
		updateSuffixPosition() {
			const INITIAL_SUFFIX_POSITION = 20;

			this.suffixPosition = `${this.getTextWidth(this.modelValue) + INITIAL_SUFFIX_POSITION}px`;
		},
		replaceNonNumberCharacters(value) {
			return value.replace(/[^\d.-]/g, '');
		},
		handleInputControls(event) {
			const INPUT_CONTROL_KEY_CODES = [
				CODE.ShiftLeft,
				CODE.OSLeft,
				CODE.ArrowUp,
				CODE.ArrowDown,
			];

			if (this.inputType !== 'number' || !INPUT_CONTROL_KEY_CODES.includes(getCode(event))) {
				return;
			}

			event.preventDefault();

			if (getCode(event) === CODE.ShiftLeft) {
				this.shiftKeyPressed = true;
			}

			if (getCode(event) === CODE.OSLeft) {
				this.metaKeyPressed = true;
			}

			let value = Number(this.modelValue);

			// Arrow up = value + 1
			if ((!this.shiftKeyPressed && !this.metaKeyPressed) && getCode(event) === CODE.ArrowUp) {
				value += 1;
				// Arrow down = value + 1
			}

			if ((!this.shiftKeyPressed && !this.metaKeyPressed) && getCode(event) === CODE.ArrowDown) {
				value -= 1;
				// Arrow up + shift = value + 10
			}

			if (getCode(event) === CODE.ArrowUp && this.shiftKeyPressed) {
				value += 10;
				// Arrow up + shift = value - 10
			}

			if (getCode(event) === CODE.ArrowDown && this.shiftKeyPressed) {
				value -= 10;
				// Arrow up + shift = value + 100
			}

			if (getCode(event) === CODE.ArrowUp && this.metaKeyPressed) {
				value += 100;
				// Arrow up + shift = value - 100
			}

			if (getCode(event) === CODE.ArrowDown && this.metaKeyPressed) {
				value -= 100;
			}

			this.$emit('update:model-value', value);
		},
		resetPressedKeyModifiers(event) {
			if (getCode(event) === CODE.ShiftLeft) {
				this.shiftKeyPressed = false;
			}

			if (getCode(event) === CODE.OSLeft) {
				this.metaKeyPressed = false;
			}
		},
		handleInputChange(event) {
			let { value } = event.target;

			/**
					 * Attribute type number allows input of e or E
					 */
			if (this.type === 'number' || this.inputType === 'number') {
				value = this.replaceNonNumberCharacters(value);

				/**
						 * If first char is 0 and char after it is not . cut first number that is 0
						 */
				if (Number(value[0]) === 0 && value[1] !== '.' && value.length > 1) {
					value = value.slice(1);
				}
			}

			/**
					 * Max length attr does not work with type number
					 */
			if (this.maxlength && this.type === 'number') {
				value = value.slice(0, Math.max(0, Number(this.maxlength)));
			}

			this.$emit('update:model-value', value);
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/global/zyro-input/ZyroInput";

.zyro-input {
	$this: &;

	&--spinner-disabled {
		input[type="number"] {
			appearance: textfield;
		}

		input[type="number"]::-webkit-inner-spin-button,
		input[type="number"]::-webkit-outer-spin-button {
			appearance: none;
		}
	}

	&--error {
		#{$this}__input {
			border-color: $color-primary;
		}
	}

	&--light {
		#{$this}__input {
			background-color: $color-light;
		}
	}

	&--secondary {
		color: $color-dark;

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
			color: $color-gray;
			letter-spacing: 0.03em;
		}
	}

	&--hostinger {
		color: $color-dark;
		font-size: 14px;
		line-height: 1.7;

		&:hover,
		&-hover {
			border-color: $color-gray;
		}

		&:focus,
		&-focus {
			border-color: $color-primary;
		}

		&::placeholder {
			color: $color-gray;
		}
	}

	&__suffix {
		position: absolute;
		top: 0;
		bottom: 0;
		left: var(--suffix-left);
		display: flex;
		align-items: center;
		pointer-events: none;
	}

	&__input {
		font-family: inherit;
	}
}
</style>
