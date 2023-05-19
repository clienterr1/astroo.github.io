<template>
	<div class="zyro-range">
		<div class="zyro-range__input-wrapper">
			<input
				ref="rangeInput"
				:value="modelValue"
				:min="min"
				:max="max"
				:step="step"
				:disabled="disabled"
				type="range"
				@input="handleInput"
			>
			<input
				v-if="hasNumberInput"
				ref="numberInput"
				:min="min"
				:max="max"
				:step="step"
				type="number"
				:disabled="disabled"
				autocomplete="off"
				:value="modelValue"
				class="zyro-range__number-input"
				@blur="handleInput"
				@keyup.enter="handleInput"
				@keydown.up="handleInput"
				@keydown.down="handleInput"
				@focus="$refs.numberInput.select()"
				@change="handleInput"
			>
			<span
				v-else-if="isValueShown"
				class="zyro-range__value z-body-small z-body-small--strong"
				v-text="`${modelValue} ${units}`"
			/>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

import { clamp } from '@zyro-inc/site-modules/utils/clamp';

export default defineComponent({
	props: {
		min: {
			type: [
				Number,
				String,
			],
			default: '',
		},
		max: {
			type: [
				Number,
				String,
			],
			default: '',
		},
		step: {
			type: [
				Number,
				String,
			],
			default: '',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		units: {
			type: String,
			default: 'px',
		},
		modelValue: {
			type: Number,
			required: true,
		},
		hasNumberInput: {
			type: Boolean,
			default: false,
		},
		isValueShown: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['update:model-value'],

	methods: {
		handleInput(event) {
			if (this.hasNumberInput) {
				const normalizedValue = clamp(
					Number.parseFloat(event.target.value),
					Number.parseInt(this.min, 10),
					Number.parseInt(this.max, 10),
				);

				this.$emit('update:model-value', normalizedValue);

				return;
			}

			this.$emit('update:model-value', event.target.value);
		},
	},
});
</script>

<style lang="scss" scoped>
.zyro-range {
	width: 100%;

	&__input-wrapper {
		display: flex;
		align-items: center;
		width: 100%;
	}

	&__value {
		flex: 0 0 auto;
		padding: 0 16px;
		text-align: center;
	}

	&__number-input {
		flex-shrink: 0;
		width: 45px;
		padding: 8px 0;
		margin-left: 16px;
		font-size: 12px;
		line-height: 1.33;
		text-align: center;
		letter-spacing: 0.25px;
		border: 1px solid $color-gray-border;
		border-radius: 5px;
		outline: none;
		transition: border 0.2;

		&:focus {
			border: 1px solid $color-primary;
		}

		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			appearance: none;
			margin: 0;
		}
	}
}

// Styling Cross-Browser Compatible Range Inputs with Sass
// Github: https://github.com/darlanrod/input-range-sass
// Author: Darlan Rod https://github.com/darlanrod
// Version 1.5.2
// MIT License

$track-color: $color-gray-border !default;
$thumb-color: $color-light !default;
$thumb-radius: 23px !default;
$thumb-height: 23px !default;
$thumb-width: 23px !default;
$thumb-shadow-size: 6px !default;
$thumb-shadow-blur: 14px !default;
$thumb-shadow-color: rgb(0 0 0 / 10%) !default;
$thumb-border-width: 1px !default;
$thumb-border-color: $color-gray-border !default;
$track-width: 100% !default;
$track-height: 3px !default;
$track-shadow-size: 0 !default;
$track-shadow-blur: 0 !default;
$track-shadow-color: rgb(0 0 0 / 0%) !default;
$track-border-width: 0 !default;
$track-border-color: $color-gray-border !default;
$track-radius: 3px !default;
$contrast: 3% !default;
$ie-bottom-track-color: darken($track-color, $contrast) !default;

@mixin shadow($shadow-size, $shadow-blur, $shadow-color) {
	box-shadow: 0 $shadow-size $shadow-blur $shadow-color;
}

@mixin track {
	width: $track-width;
	height: $track-height;
	cursor: default;
	transition: all 0.2s ease;
}

@mixin thumb {
	@include shadow($thumb-shadow-size, $thumb-shadow-blur, $thumb-shadow-color);

	box-sizing: border-box;
	width: $thumb-width;
	height: $thumb-height;
	cursor: col-resize;
	background: $thumb-color;
	border: $thumb-border-width solid $thumb-border-color;
	border-radius: $thumb-radius;
}
/* stylelint-disable no-descending-specificity */

[type="range"] {
	width: $track-width;
	margin: ($thumb-height * 0.5) 0;
	background: transparent;
	appearance: none;

	&::-moz-focus-outer {
		border: 0;
	}

	&::-webkit-slider-runnable-track {
		@include track;
		@include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);

		background: $track-color;
		border: $track-border-width solid $track-border-color;
		border-radius: $track-radius;
	}

	&::-webkit-slider-thumb {
		@include thumb;

		margin-top: (($track-height - ($track-border-width * 2)) * 0.5 - $thumb-height * 0.5);
		appearance: none;
	}

	&::-moz-range-track {
		@include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);
		@include track;

		height: ($track-height * 0.5);
		background: $track-color;
		border: $track-border-width solid $track-border-color;
		border-radius: $track-radius;
	}

	&::-moz-range-thumb {
		@include thumb;
	}

	&::-ms-track {
		@include track;

		color: transparent;
		background: transparent;
		border-color: transparent;
		border-width: ($thumb-height * 0.5) 0;
	}

	&::-ms-fill-lower {
		@include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);

		background: $ie-bottom-track-color;
		border: $track-border-width solid $track-border-color;
		border-radius: ($track-radius * 2);
	}

	&::-ms-fill-upper {
		@include shadow($track-shadow-size, $track-shadow-blur, $track-shadow-color);

		background: $track-color;
		border: $track-border-width solid $track-border-color;
		border-radius: ($track-radius * 2);
	}

	&::-ms-thumb {
		@include thumb;

		margin-top: ($track-height * 0.25);
	}

	&:disabled {
		&::-webkit-slider-thumb,
		&::-moz-range-thumb,
		&::-ms-thumb,
		&::-webkit-slider-runnable-track,
		&::-ms-fill-lower,
		&::-ms-fill-upper {
			cursor: not-allowed;
		}
	}

	&:focus {
		outline: 0;

		&::-webkit-slider-runnable-track {
			background: lighten($track-color, $contrast);
		}

		&::-ms-fill-lower {
			background: $track-color;
		}

		&::-ms-fill-upper {
			background: lighten($track-color, $contrast);
		}
	}
}
</style>
