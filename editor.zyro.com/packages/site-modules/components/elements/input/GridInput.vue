<template>
	<div
		class="input"
		:class="`input--${theme}`"
	>
		<label
			class="input__label"
			:class="`input__label--${theme}`"
		>
			{{ label }}{{ isRequired && isRequiredAsteriskVisible ? '*' : '' }}
		</label>
		<input
			v-if="tag === 'input'"
			:placeholder="placeholder"
			type="text"
			class="input__component"
			:class="computedClasses"
			:value="modelValue"
			:readonly="!isInteractive"
			:tabindex="isInteractive ? 0 : -1"
			@input="$emit('update:model-value', $event.target.value)"
			@click.prevent
			@dragstart.prevent
			@drag.prevent
		>
		<textarea
			v-if="tag === 'textarea'"
			:placeholder="placeholder"
			type="text"
			class="input__component"
			:class="computedClasses"
			:value="modelValue"
			:readonly="!isInteractive"
			:tabindex="isInteractive ? 0 : -1"
			@input="$emit('update:model-value', $event.target.value)"
			@click.prevent
			@dragstart.prevent
			@drag.prevent
		/>
		<div v-if="validationErrors.length && areErrorsShown">
			<p
				v-for="message in validationErrors"
				:key="message"
				class="input__error-message z-body-small"
			>
				{{ message }}
			</p>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		modelValue: {
			type: String,
			default: '',
		},
		label: {
			type: String,
			default: null,
		},
		placeholder: {
			type: String,
			default: null,
		},
		isRequired: {
			type: Boolean,
			default: false,
		},
		isRequiredAsteriskVisible: {
			type: Boolean,
			default: true,
		},
		isInteractive: {
			type: Boolean,
			default: true,
		},
		areErrorsShown: {
			type: Boolean,
			default: false,
		},
		validationErrors: {
			type: Array,
			required: false,
			default: () => [],
		},
		theme: {
			type: String,
			required: true,
		},
		tag: {
			type: String,
			default: 'input',
			validator: (value) => [
				'textarea',
				'input',
			].includes(value),
		},
	},
	emits: ['update:model-value'],

	data() {
		return {
			gridInputValue: '',
		};
	},

	computed: {
		computedClasses() {
			return [
				{
					'input__component--textarea': this.tag === 'textarea',
				},
				{
					'input__component--read-only': !this.isInteractive,
				},
				`input__component--${this.theme}`,
			];
		},
	},
});
</script>

<style lang="scss" scoped>
/* stylelint-disable custom-property-pattern */
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.input {
	font-size: var(--input-text-size, var(--body-font-size));

	$input-transition-timing-function: "ease";
	$input-transition-duration: "0.2s";

	&__component {
		width: 100%;
		height: var(--input-height);
		padding: 16px;
		font-family: var(--form-font-family, var(--body-font-family));
		font-size: var(--input-text-size, var(--body-font-size));
		font-weight: var(--form-font-weight, var(--body-font-weight));
		color: var(--input-text-color, var(--body-color));
		background-color: var(--input-fill-color, $color-gray-border);
		border-color: var(--input-border-color, $color-dark);
		border-style: solid;
		border-width: var(--input-border-width, 0);
		border-radius: var(--input-border-radius, 0);
		outline: none;
		transition:
			color #{$input-transition-timing-function} #{$input-transition-duration},
			border-color #{$input-transition-timing-function} #{$input-transition-duration},
			background-color #{$input-transition-timing-function} #{$input-transition-duration};

		&::placeholder {
			font-family: var(--form-font-family, var(--body-font-family));
			font-size: var(--input-text-size, 14px);
			color: var(--input-text-color, $color-gray);
			opacity: 0.5;
			transition: color #{$input-transition-timing-function} #{$input-transition-duration};
		}

		&:hover,
		&:focus {
			color: var(--input-text-color--hover, var(--body-color));
			background-color: var(--input-fill-color--hover, $color-gray-border);
			border-color: var(--input-border-color--hover, $color-dark);

			&::placeholder {
				color: var(--input-text-color--hover, $color-gray);
			}
		}

		&--dark {
			background-color: var(--input-fill-color, rgba($color-gray-light, 0.6));

			&::placeholder {
				color: var(--input-text-color, $color-gray-dark);
			}

			&:hover,
			&:focus {
				background-color: var(--input-fill-color--hover, rgba($color-gray-light, 0.6));

				&::placeholder {
					color: var(--input-text-color--hover, $color-gray-dark);
				}
			}
		}

		&--read-only {
			cursor: move;
		}

		&--textarea {
			min-height: 96px;
			overflow: auto;
			resize: vertical;
		}
	}

	&__label {
		font-size: var(--label-text-size, var(--body-font-size));
		color: var(--label-text-color, $color-dark);

		&--dark {
			color: var(--label-text-color, $color-gray-border);
		}
	}

	&__error-message {
		color: var(--label-text-color, $color-gray);
	}

	&--is-invalid {
		.input__component {
			border-color: $color-danger;
		}
	}
}

@include site-engine-mobile {
	.input {
		&__component {
			font-size: var(--m-input-text-size, var(--body-m-font-size));

			&::placeholder {
				font-size: var(--m-input-text-size, 14px);
			}
		}

		&__label {
			font-size: var(--m-label-text-size, var(--body-m-font-size));
		}
	}
}

</style>
