<template>
	<div>
		<ZyroDropdown
			class="dropdown"
			:options="gridFormField"
			:model-value="DROPDOWN_FIELD_DEFAULT"
			@update:model-value="addField"
		/>
		<Draggable
			:model-value="fields"
			item-key="formFields"
			class="fields"
			handle=".field__control-handle"
			fallback-axis="y"
			:force-fallback="true"
			ghost-class="draggable-element"
			easing="cubic-bezier(0.76, 0, 0.24, 1)"
			animation="150"
			direction="vertical"
			@update:model-value="updateFields"
		>
			<template #item="{ element: field }">
				<FormField
					:is-disabling-last-toggle="isDisablingLastToggle"
					:active-field-id="activeFieldId"
					:field="field"
					:required-field-count="requiredFieldCount"
					:svg-name="field.svg || DEFAULT_ICON"
					@set-data="setFieldData"
					@update:is-required="handleValidation"
					@remove-field="removeField"
					@toggle-update="isDisablingLastToggle = $event"
					@update-active-field-id="updateActiveFieldId"
				/>
			</template>
		</Draggable>
	</div>
</template>

<script setup>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import { useStore } from 'vuex';

import cloneDeep from 'lodash.clonedeep';
import Draggable from 'vuedraggable';

import FormField from '@/components/builder-controls/edit-form/EditFormTabFields/FormField.vue';

import { useI18n } from 'vue-i18n';
import { generateRandomId } from '@/utils/generateRandomId';

import {
	computed,
	watch,
	ref,
} from 'vue';
import { useDeviceElementHeight } from '@/use/useDeviceElementHeight';

const DEFAULT_ICON = 'align-left-short';

const { t } = useI18n();
const {
	dispatch,
	getters,
} = useStore();
const { updateElementHeightOnDevices } = useDeviceElementHeight();

const DROPDOWN_FIELD_DEFAULT = {
	title: t('builder.editForm.addNewFormField'),
	value: 'add-new',
	svg: 'plus-circle',
};
const FORM_FIELD_TEXT = {
	title: t('builder.editForm.textField.title'),
	value: 'short-answer',
	svg: 'align-left-short',
	field: {
		fieldType: 'short-answer',
		svg: 'align-left-short',
		name: 'Short answer',
		inputLabel: t('builder.editForm.textField.title'),
		validation: [['optional']],
		'validation-messages': {
			required: 'This field is required',
		},
		placeholder: t('builder.editForm.textField.placeholder'),
		type: 'GridInput',
		validationType: 'text',
	},
};
const FORM_FIELD_TEXTBOX = {
	title: t('builder.editForm.textBox.title'),
	value: 'paragraph',
	svg: 'align-left',
	field: {
		svg: 'align-left',
		tag: 'textarea',
		inputLabel: t('builder.editForm.textBox.title'),
		name: 'Paragraph',
		validation: [['optional']],
		'validation-messages': {
			required: 'This field is required',
		},
		placeholder: t('builder.editForm.textBox.placeholder'),
		type: 'GridInput',
	},
};
const FORM_FIELD_RADIO = {
	title: t('builder.editForm.radioField.title'),
	value: 'singleChoice',
	svg: 'circle-input',
	field: {
		svg: 'circle-input',
		tag: 'radio',
		type: 'GridSelectInput',
		name: 'singleChoice',
		inputLabel: t('builder.editForm.radioField.title'),
		validation: [['optional']],
		'validation-messages': {
			required: 'This field is required',
		},
		options: [
			{
				value: `${t('builder.editForm.option')} 1`,
			},
			{
				value: `${t('builder.editForm.option')} 2`,
			},
		],
	},
};
const FORM_FIELD_CHECKBOX = {
	title: t('builder.editForm.checkboxField.title'),
	value: 'multipleChoice',
	svg: 'check-square',
	field: {
		svg: 'check-square',
		tag: 'checkbox',
		type: 'GridSelectInput',
		name: 'multipleChoice',
		inputLabel: t('builder.editForm.checkboxField.title'),
		validation: [['optional']],
		'validation-messages': {
			required: 'This field is required',
		},
		options: [
			{
				value: `${t('builder.editForm.option')} 1`,
			},
			{
				value: `${t('builder.editForm.option')} 2`,
			},
		],
	},
};
const gridFormField = ref([
	FORM_FIELD_TEXT,
	FORM_FIELD_TEXTBOX,
	FORM_FIELD_RADIO,
	FORM_FIELD_CHECKBOX,
]);
const activeFieldId = ref(null);
const isDisablingLastToggle = ref(false);

const currentElementSettings = computed(() => getters.currentElementSettings);
const currentElementId = computed(() => getters.currentElementId);
const fields = computed(() => currentElementSettings.value?.schema);

const getIsFieldRequired = (validationArray) => !!validationArray.some(([rule]) => rule === 'required');

const requiredFieldCount = computed(() => fields.value?.filter((item) => getIsFieldRequired(item.validation)).length);

const updateFields = (newValue) => {
	dispatch('mergeCurrentElementData', {
		elementData: {
			settings: {
				schema: newValue,
			},
		},
	});
};

const generateUniqueFieldName = (fieldName) => {
	const isFieldNameUnique = !fields.value.some((field) => field.name === fieldName);

	return isFieldNameUnique ? fieldName : generateRandomId({
		length: 3,
	});
};

const getUniqueName = (input, fieldType, oldName, inputLabel, placeholder) => {
	const fallbackName = generateRandomId({
		length: 3,
	});
	const uniqueName = generateUniqueFieldName(input);

	if (fieldType === 'inputLabel') {
		return uniqueName || generateUniqueFieldName(placeholder) || fallbackName;
	}

	return inputLabel ? oldName : (uniqueName || fallbackName);
};

const setFieldData = ({
	id,
	fieldType,
	value,
	inputLabel = null,
	placeholder = null,
	validationType,
}) => {
	const getModifiedItem = (itemToModify) => ({
		...itemToModify,
		[fieldType]: value,
		name: getUniqueName(value, fieldType, itemToModify.name, inputLabel, placeholder),
		validationType: validationType || itemToModify.validationType || 'text',
	});

	const modifiedSchema = fields.value.map((item) => {
		if (id !== item.id) {
			return item;
		}

		return getModifiedItem(item);
	});

	dispatch('mergeCurrentElementData', {
		elementData: {
			settings: {
				schema: modifiedSchema,
			},
		},
	});
};

const handleValidation = ({
	required,
	id,
}) => {
	const stateCopy = cloneDeep(fields.value);
	const index = stateCopy.findIndex((item) => item.id === id);

	const getUpdatedValidation = (validation) => [
		...validation,
		required ? ['required'] : ['optional'],
	].filter(([rule]) => rule !== (required ? 'optional' : 'required'));

	// take out copy by reference
	const stateField = stateCopy[index];

	stateField.validation = getUpdatedValidation(stateField.validation);

	dispatch('mergeCurrentElementData', {
		elementData: {
			settings: {
				schema: stateCopy,
			},
		},
	});
};

const updateActiveFieldId = (id) => {
	activeFieldId.value = activeFieldId.value === id ? null : id;
};

const addField = ({ field }) => {
	const stateCopy = cloneDeep(currentElementSettings.value);

	if (field.options) {
		const updatedOptions = field.options.map((option) => ({
			...option,
			id: generateRandomId(),
		}));

		stateCopy.schema.push({
			...field,
			options: updatedOptions,
			id: generateRandomId(),
			name: generateUniqueFieldName(field.name),
		});
	} else {
		stateCopy.schema.push({
			...field,
			id: generateRandomId(),
			name: generateUniqueFieldName(field.name),
		});
	}

	dispatch('mergeCurrentElementData', {
		elementData: {
			settings: stateCopy,
		},
	});

	updateElementHeightOnDevices({
		elementId: currentElementId.value,
	});
};

const removeField = (fieldId) => {
	const updatedSchema = fields.value.filter((field) => field.id !== fieldId);

	dispatch('mergeCurrentElementData', {
		elementData: {
			settings: {
				schema: updatedSchema,
			},
		},
	});

	updateElementHeightOnDevices({
		elementId: currentElementId.value,
	});
};

watch(requiredFieldCount, (count) => {
	if (!count || count > 0) {
		return;
	}

	const stateCopy = cloneDeep(fields.value);

	const getUpdatedValidation = (validation) => (!getIsFieldRequired(validation) ? [
		...validation,
		['required'],
	].filter(([rule]) => rule !== 'optional') : validation);

	stateCopy[0].validation = getUpdatedValidation(stateCopy[0].validation);

	dispatch('mergeCurrentElementData', {
		elementData: {
			settings: {
				schema: stateCopy,
			},
		},
	});
});

</script>

<style lang="scss" scoped>
.fields {
	$popup-head-height: 170px;
	$max-popup-height-larger-screens: 648px;
	$max-popup-height-smaller-screens: 70vh;

	max-height: calc(#{$max-popup-height-smaller-screens} - #{$popup-head-height});
	overflow-y: auto;

	@media screen and (min-width: 1440px) {
		max-height: calc(#{$max-popup-height-larger-screens} - #{$popup-head-height});
	}
}

:deep(.dropdown) {
	.dropdown {
		&__button {
			cursor: pointer;
			background-color: $color-light;
		}

		&__icon {
			display: none;
		}
	}
}

:deep(.draggable-element) {
	background-color: rgba($color-gray-light, 0.5);
}
</style>
