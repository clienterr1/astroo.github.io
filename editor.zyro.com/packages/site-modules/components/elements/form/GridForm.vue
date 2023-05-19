<template>
	<div
		:id="id"
		class="form"
		:class="{ 'form--single-field' : settings.type === 'singleField' }"
		:style="formCSSVars"
	>
		<form
			class="form__control"
			:name="formId"
			:class="{ 'form__control--invisible': showSuccessMessage || isError }"
			@submit.prevent="handleSubmit"
		>
			<template
				v-for="(item) in settings.schema"
				:key="item.id"
			>
				<GridInput
					v-if="item.type === 'GridInput'"
					v-qa="`form-field-${item.inputLabel}`"
					:theme="theme"
					:tag="item.tag"
					:placeholder="item.placeholder"
					:label="item.inputLabel"
					:is-required="validationRules[item.name].validation.includes('required')"
					:is-required-asterisk-visible="settings.schema.length > 1"
					:validation-errors="validationErrors[item.name]"
					:are-errors-shown="areErrorsVisible"
					:is-interactive="isUserSite"
					:model-value="formValues[item.name]?.value"
					@update:model-value="updateField(item.name, $event)"
				/>
				<GridSelectInputsWrapper
					v-if="item.type === 'GridSelectInput'"
					v-qa="`form-field-${item.inputLabel}`"
					:theme="theme"
					:tag="item.tag"
					:options="item.options"
					:placeholder="item.placeholder"
					:label="item.inputLabel"
					:is-required="validationRules[item.name].validation.includes('required')"
					:validation-errors="validationErrors[item.name]"
					:are-errors-shown="areErrorsVisible"
					:is-interactive="isUserSite"
					@input="updateField(item.name, $event)"
				/>
			</template>
			<GridButton
				:content="submitButtonData.content"
				:type="submitButtonData.settings.type"
				:background-color="submitButtonBackgroundColor"
				:background-color-hover="submitButtonBackgroundColorHover"
				:font-color="submitButtonFontColor"
				:font-color-hover="submitButtonFontColorHover"
				:border-color="submitButtonBorderColor"
				:border-color-hover="submitButtonBorderColorHover"
				:font-family="submitButtonFontFamily"
				:font-weight="submitButtonFontWeight"
				:font-size-mobile="submitButtonFontSizeMobile"
				:font-size-desktop="submitButtonFontSizeDesktop"
				:border-width="submitButtonBorderWidth"
				:border-radius="submitButtonBorderRadius"
				class="form__button"
				button-type="submit"
				tag-name="button"
			/>
		</form>
		<slot />
	</div>
</template>
<script setup>
import {
	computed,
	ref,
} from 'vue';

import { validateInput } from '@zyro-inc/site-modules/utils/validateInput';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import GridInput from '@zyro-inc/site-modules/components/elements/input/GridInput.vue';
import GridSelectInputsWrapper from '@zyro-inc/site-modules/components/elements/input/GridSelectInputsWrapper.vue';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	settings: {
		type: Object,
		required: true,
	},
	submitButtonData: {
		type: Object,
		required: true,
	},
	formId: {
		type: String,
		default: null,
	},
	isError: {
		type: Boolean,
		default: false,
	},
	showSuccessMessage: {
		type: Boolean,
		default: false,
	},
	isUserSite: {
		type: Boolean,
		default: false,
	},
	theme: {
		type: String,
		validator: (theme) => [
			'dark',
			'light',
		].includes(theme),
		default: 'light',
	},
	formJustify: {
		type: String,
		default: null,
	},
	formButtonJustifySelf: {
		type: String,
		default: null,
	},
	mobileFormButtonJustifySelf: {
		type: String,
		default: null,
	},
	formBackgroundColor: {
		type: String,
		default: null,
	},
	formBorderWidth: {
		type: String,
		default: null,
	},
	formBorderColor: {
		type: String,
		default: null,
	},
	formBorderRadius: {
		type: String,
		default: null,
	},
	formPadding: {
		type: String,
		default: null,
	},
	// Submit button styles
	submitButtonBackgroundColor: {
		type: String,
		default: null,
	},
	submitButtonBackgroundColorHover: {
		type: String,
		default: null,
	},
	submitButtonFontColor: {
		type: String,
		default: null,
	},
	submitButtonFontColorHover: {
		type: String,
		default: null,
	},
	submitButtonBorderColor: {
		type: String,
		default: null,
	},
	submitButtonBorderColorHover: {
		type: String,
		default: null,
	},
	submitButtonFontFamily: {
		type: String,
		default: null,
	},
	submitButtonFontWeight: {
		type: Number,
		default: null,
	},
	submitButtonFontSizeMobile: {
		type: Number,
		default: null,
	},
	submitButtonFontSizeDesktop: {
		type: Number,
		default: null,
	},
	submitButtonBorderWidth: {
		type: Number,
		default: null,
	},
	submitButtonBorderRadius: {
		type: Number,
		default: null,
	},
	inputFillColor: {
		type: String,
		default: null,
	},
	inputFillColorHover: {
		type: String,
		default: null,
	},
	formFontFamily: {
		type: String,
		default: null,
	},
	formFontWeight: {
		type: Number,
		default: null,
	},
	labelTextColor: {
		type: String,
		default: null,
	},
	labelTextSize: {
		type: Number,
		default: null,
	},
	mobileLabelTextSize: {
		type: Number,
		default: null,
	},
	inputTextColor: {
		type: String,
		default: null,
	},
	inputTextColorHover: {
		type: String,
		default: null,
	},
	inputTextSize: {
		type: Number,
		default: null,
	},
	mobileInputTextSize: {
		type: Number,
		default: null,
	},
	inputBorderColor: {
		type: String,
		default: null,
	},
	inputBorderColorHover: {
		type: String,
		default: null,
	},
	inputBorderWidth: {
		type: Number,
		default: null,
	},
	inputBorderRadius: {
		type: Number,
		default: null,
	},
	elementsVerticalSpacing: {
		type: Number,
		default: null,
	},
	mobileElementsVerticalSpacing: {
		type: Number,
		default: null,
	},
});

const emit = defineEmits(['on-submit']);

const validationErrors = ref({});
const formValues = ref({});
const areErrorsVisible = ref(false);

const validationRules = computed(() => props.settings.schema.reduce((rules, rowItem) => ({
	...rules,
	[rowItem.name]: {
		validation: rowItem.validation.flat(),
		validationMessages: rowItem['validation-messages'],
	},
}), {}));
const formCSSVars = computed(() => {
	const elementsVerticalSpacing = Number.isInteger(props.elementsVerticalSpacing)
		? `${props.elementsVerticalSpacing}px`
		: null;
	const mobileElementsVerticalSpacing = Number.isInteger(props.mobileElementsVerticalSpacing)
		? `${props.mobileElementsVerticalSpacing}px`
		: null;

	return {
		'--form-flex': props.formJustify ? null : '0 1 100%',
		'--form-button-justify-self': props.formButtonJustifySelf,
		'--m-form-button-justify-self': props.mobileFormButtonJustifySelf,
		'--form-background-color': props.formBackgroundColor,
		'--form-border-width': `${props.formBorderWidth}px`,
		'--form-border-color': props.formBorderColor,
		'--form-border-radius': `${props.formBorderRadius}px`,
		'--form-padding': props.formPadding ? `${props.formPadding}px` : null,
		'--form-font-family': props.formFontFamily,
		'--form-font-weight': props.formFontWeight,
		'--input-fill-color': props.inputFillColor,
		'--input-fill-color--hover': props.inputFillColorHover || props.inputFillColor,
		'--label-text-color': props.labelTextColor,
		'--label-text-size': props.labelTextSize ? `${props.labelTextSize}px` : null,
		'--m-label-text-size': props.mobileLabelTextSize ? `${props.mobileLabelTextSize}px` : null,
		'--input-text-color': props.inputTextColor,
		'--input-text-color--hover': props.inputTextColorHover || props.inputTextColor,
		'--input-text-size': props.inputTextSize ? `${props.inputTextSize}px` : null,
		'--m-input-text-size': props.mobileInputTextSize ? `${props.mobileInputTextSize}px` : null,
		// If input text size was change input should behave fluidly to text size changes
		'--input-height': props.inputTextSize ? 'auto' : '48px',
		'--input-border-color': props.inputBorderColor,
		'--input-border-color--hover': props.inputBorderColorHover || props.inputBorderColor,
		'--input-border-width': props.inputBorderWidth ? `${props.inputBorderWidth}px` : null,
		'--input-border-radius': props.inputBorderRadius ? `${props.inputBorderRadius}px` : null,
		'--form-elements-vertical-spacing': elementsVerticalSpacing,
		'--m-form-elements-vertical-spacing': mobileElementsVerticalSpacing,
		'--form-spacing': 'var(--formSpacing)',
		'--grid-item-inner-padding': 'var(--gridItemInnerPadding)',
		'--grid-item-inner-background': 'var(--gridItemInnerBackground)',
	};
});

const validateForm = () => props.settings.schema.flatMap(({ name }) => {
	const errors = validateInput(formValues.value[name]?.value, validationRules.value[name]);

	validationErrors.value = {
		...validationErrors.value,
		[name]: errors,
	};

	return errors;
});

const updateField = (field, value) => {
	validationErrors.value = {
		...validationErrors.value,
		[field]: validateInput(value, validationRules.value[field]),
	};
	formValues.value = {
		...formValues.value,
		[field]: {
			value,
			type: props.settings.schema.find(({ name }) => name === field).validationType || 'text',
		},
	};
};

const trimFormValues = () => {
	formValues.value = Object.fromEntries(Object.entries(formValues.value).map(([
		key,
		{
			value,
			type,
		},
	]) => [
		key,
		{
			value: value.trim(),
			type,
		},
	]));
};

const handleSubmit = () => {
	trimFormValues();

	const errors = validateForm();

	areErrorsVisible.value = errors.length > 0;

	if (!areErrorsVisible.value) {
		emit('on-submit', formValues.value);
	}
};
</script>

<style lang="scss" scoped>
/* stylelint-disable custom-property-pattern */

@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.form {
	position: relative;
	display: grid;
	flex: var(--form-flex);
	grid-gap: var(--form-spacing);
	padding: var(--form-padding, var(--grid-item-inner-padding));
	overflow: hidden;
	font-family: var(--form-font-family, var(--body-font-family));
	font-style: var(--body-font-style);
	font-weight: var(--form-font-weight, var(--body-font-weight));
	line-height: var(--body-line-height);
	text-decoration: var(--body-text-decoration);
	text-transform: var(--body-text-transform);
	letter-spacing: var(--body-letter-spacing);
	background:
		linear-gradient(
			rgba($color-dark, var(--gridItemInnerBackgroundOverlayOpacity, 0)),
			rgba($color-dark, var(--gridItemInnerBackgroundOverlayOpacity, 0))
		),
		var(--form-background-color, var(--grid-item-inner-background));
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	border: var(--form-border-width) solid var(--form-border-color, $color-dark);
	border-radius: var(--form-border-radius);

	&--single-field {
		display: grid;
		grid-template-rows: auto;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr) min-content);
		grid-auto-flow: row;
		grid-gap: var(--form-spacing);
	}

	&__control {
		display: grid;
		grid-gap: var(--form-elements-vertical-spacing, 22px);
		align-self: center;
	}

	&__control-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
		grid-gap: var(--form-spacing);
	}

	&__button,
	&__control {
		&--invisible {
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.15s;
		}
	}

	&__button {
		align-self: center;
		justify-self: var(--form-button-justify-self);

		&:focus-visible {
			outline: 2px solid $color-azure;
		}
	}
}

@include site-engine-mobile {
	.form {
		&__button {
			align-self: center;
			justify-self: var(--m-form-button-justify-self, var(--form-button-justify-self));
		}

		&__control {
			grid-gap: var(--m-form-elements-vertical-spacing, 22px);
		}
	}
}
</style>
