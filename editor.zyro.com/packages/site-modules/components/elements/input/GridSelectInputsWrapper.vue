<template>
	<div
		class="input"
		:class="`input--${theme}`"
	>
		<label
			class="input__label input__label--read-only"
			:class="[`input__label--${theme}`]"
		>
			{{ label }}{{ isRequired ? '*' : '' }}
		</label>
		<div
			v-for="option in options"
			:key="option.id"
			class="input__options"
		>
			<GridSelectInput
				:id="option.id"
				:name="option.value"
				:tag="tag"
				:is-selected="isSelected(option.id)"
				:theme="theme"
				:is-interactive="isInteractive"
				:selected-options="selectedOptions"
				@remove-selection="removeSelection"
				@add-selection="addSelection"
				@select-option="selectOption"
			/>
		</div>
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
import GridSelectInput from './GridSelectInput.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridSelectInputsWrapper',

	components: {
		GridSelectInput,
	},

	props: {
		label: {
			type: String,
			default: null,
		},
		isRequired: {
			type: Boolean,
			default: false,
		},
		isTextArea: {
			type: Boolean,
			default: false,
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
			required: true,
			validator: (value) => [
				'radio',
				'checkbox',
			].includes(value),
		},
		options: {
			type: Array,
			required: true,
		},
	},

	emits: ['input'],

	data() {
		return {
			selectedOptions: [],
		};
	},

	watch: {
		selectedOptions() {
			const resultValues = this.selectedOptions.map(({ value }) => value).toString();

			this.$emit('input', resultValues);
		},
	},

	methods: {
		isSelected(selectionId) {
			return this.selectedOptions.some(({ id }) => id === selectionId);
		},
		removeSelection(selection) {
			const updatedSelection = this.selectedOptions.filter((option) => option.id !== selection.id);

			this.selectedOptions = updatedSelection;
		},
		addSelection(selection) {
			this.selectedOptions = [
				...this.selectedOptions,
				selection,
			];
		},
		selectOption(selection) {
			this.selectedOptions = [selection];
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.input {
	&__label {
		font-size: var(--label-text-size, $color-gray-dark);
		color: var(--label-text-color, $color-gray-dark);

		&--dark {
			color: var(--label-text-color, rgb(241, 241, 241));
		}

		&--read-only {
			cursor: move;
		}
	}

	&--is-invalid {
		.input__component {
			border-color: $color-danger;
		}
	}

	&__options {
		margin-top: 4px;
		font-style: var(--body-font-style);
		line-height: var(--body-line-height);
		text-decoration: var(--body-text-decoration);
		text-transform: var(--body-text-transform);
		letter-spacing: var(--body-letter-spacing);
	}
}

@include site-engine-mobile {
	.input {
		&__label {
			font-size: var(--m-label-text-size, var(--body-m-font-size));
		}
	}
}
</style>
