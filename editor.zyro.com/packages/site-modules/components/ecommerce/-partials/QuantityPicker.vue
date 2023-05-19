<template>
	<span
		class="quantity-picker"
		:style="computedStyles"
		:class="{ 'quantity-picker--cart-style' : isCartStyle }"
	>
		<button
			v-qa="`${dataQaPageType}-btn-decrease`"
			class="quantity-picker__control"
			:class="{ 'quantity-picker__control--rounded quantity-picker__control--bigger' : isCartStyle }"
			@click="$emit('quantity-change', quantity - 1)"
		>
			-
		</button>
		<input
			v-model="inputValue"
			v-qa="`${dataQaPageType}-text-qty`"
			:disabled="isInputDisabled"
			class="quantity-picker__amount"
			:class="{ 'quantity-picker__amount--borderless' : isCartStyle }"
			@input="handleQuantityInput"
			@blur="handleEmptyInput"
		>
		<button
			v-qa="`${dataQaPageType}-btn-increaseq`"
			class="quantity-picker__control"
			:class="{ 'quantity-picker__control--rounded quantity-picker__control--bigger' : isCartStyle }"
			:disabled="isIncreaseDisabled"
			@click="$emit('quantity-change', quantity + 1)"
		>
			+
		</button>
	</span>
</template>
<script>
import { defineComponent } from 'vue';
import { REGEX_DIGITS_ONLY } from '@zyro-inc/site-modules/constants/regex';

export default defineComponent({
	name: 'QuantityPicker',
	props: {
		dataQaPageType: {
			type: String,
			default: '',
		},
		isStockAvailable: {
			type: Boolean,
			default: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		size: {
			type: Number,
			default: 48,
		},
		fontSize: {
			type: Number,
			default: 16,
		},
		isCartStyle: {
			type: Boolean,
			default: false,
		},
		isInputDisabled: {
			type: Boolean,
			default: false,
		},
		isLimitReached: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			inputValue: this.quantity,
		};
	},
	computed: {
		computedStyles() {
			return {
				'--size': `${this.size}px`,
				'--font-size': `${this.fontSize}px`,
			};
		},
		isIncreaseDisabled() {
			return !this.isStockAvailable || this.isLimitReached;
		},
	},
	watch: {
		quantity(newValue) {
			this.inputValue = newValue;
		},
	},
	methods: {
		handleQuantityInput(event) {
			const value = event.target?.value;

			if (value.match(REGEX_DIGITS_ONLY)) {
				this.$emit('quantity-change', Number(event.target.value));
			} else if (value === '') {
				return;
			}

			// for not allowing anything but numbers to be typed
			this.inputValue = this.quantity;
		},
		handleEmptyInput(event) {
			if (event.target?.value === '') {
				this.$emit('quantity-change', 1);
				this.inputValue = 1;
			}
		},
	},
});
</script>
<style lang="scss" scoped>
.quantity-picker {
	display: flex;
	height: var(--size);
	background-color: $color-light;
	border: 1px solid $color-gray-border;

	&--cart-style {
		color: $color-gray;
		border-radius: 4px;
	}

	&__control {
		width: var(--size);
		font-size: 16px;
		cursor: pointer;

		&--bigger {
			font-size: 20px;
			line-height: 1;
		}

		&--rounded {
			border-radius: 3px 0 0 3px;

			&:nth-of-type(2) {
				border-radius: 0 3px 3px 0;
			}
		}

		&:disabled {
			cursor: inherit;
			background-color: $color-gray-border;
		}
	}

	&__amount {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--size);
		font-size: var(--font-size);
		text-align: center;
		border: none;
		border-right: 1px solid $color-gray-border;
		border-left: 1px solid $color-gray-border;

		&--borderless {
			border-right: none;
			border-left: none;
		}

		&:disabled {
			background-color: $color-light;
		}

		&:focus-visible {
			outline: none;
		}
	}
}
</style>
