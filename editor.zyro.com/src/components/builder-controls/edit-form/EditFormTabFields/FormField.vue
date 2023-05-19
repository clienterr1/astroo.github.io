<template>
	<div class="field">
		<div
			v-qa="`settings-form-field-${field.name}`"
			class="field__control"
			@click="handleFieldControl"
		>
			<ZyroButton
				class="field__control-handle"
				theme="plain"
				color="black"
				:title="$t('common.move')"
				@mousedown="handleFieldDrag"
			>
				<template #icon>
					<Icon
						name="drag_indicator"
						dimensions="16px"
					/>
				</template>
			</ZyroButton>
			<ZyroSvgDeprecated
				class="field__type-icon"
				:name="svgName"
				dimensions="16px"
			/>
			<label class="field__name">
				{{ field.inputLabel }}
			</label>
			<ZyroSvgDeprecated
				class="field__chevron-icon"
				name="chevron"
				:direction="isOpen ? 'up' : 'down'"
			/>
		</div>
		<div
			:class="computedSettingsClass"
			class="field__settings"
		>
			<ZyroFieldInput
				:model-value="field.inputLabel"
				:input-data-qa="`form-label-field-${field.inputLabel}`"
				:label="$t('builder.editForm.fieldLabel')"
				@update:model-value="saveChange({
					fieldType: 'inputLabel',
					value: $event || defaultInputLabel,
				})"
			/>
			<ZyroFormFieldOptions
				v-if="field.options"
				:options="field.options"
				:tag="field.tag"
				@update="saveChange({
					fieldType: 'options',
					value: $event
				})"
			/>
			<ZyroFieldInput
				v-if="'placeholder' in field"
				:model-value="field.placeholder"
				:input-data-qa="`form-placeholder-field-${field.placeholder}`"
				:label="$t('builder.editForm.placeholderText')"
				@update:model-value="saveChange({
					fieldType: 'placeholder',
					value: $event
				})"
			/>
			<ZyroFormFieldTypes
				v-if="field.fieldType"
				:validation="field.validation"
				@change-type="setFieldType"
			/>
			<ZyroFieldToggle
				v-if="!isOnlyOneFieldLeft"
				:id="field.id"
				:label="$t('builder.editForm.fieldIsRequired')"
				:model-value="isFieldRequired"
				:bold="false"
				@update:model-value="setIsRequired(field.id, $event)"
			/>
			<div
				v-if="isRequireMessageShown"
				class="field__settings-error z-body-small"
			>
				{{ $t('builder.editForm.disablingLastToggleError') }}
			</div>
			<ZyroButton
				v-if="!isOnlyOneFieldLeft"
				color="red"
				data-qa="form-field-settings-remove-field-button"
				@click="$emit('remove-field', field.id)"
			>
				{{ $t('builder.editForm.removeField') }}
			</ZyroButton>
		</div>
	</div>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapGetters } from 'vuex';

import ZyroFormFieldOptions from '@/components/builder-controls/edit-form/EditFormTabFields/ZyroFormFieldOptions.vue';
import ZyroFormFieldTypes from '@/components/builder-controls/edit-form/EditFormTabFields/ZyroFormFieldTypes.vue';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		Icon,
		ZyroButton,
		ZyroFieldInput,
		ZyroFieldToggle,
		ZyroSvgDeprecated,
		ZyroFormFieldOptions,
		ZyroFormFieldTypes,
	},

	props: {
		activeFieldId: {
			type: String,
			default: null,
		},
		field: {
			type: Object,
			default: () => ({}),
		},
		svgName: {
			type: String,
			default: 'user',
		},
		isDisablingLastToggle: {
			type: Boolean,
			default: false,
		},
		requiredFieldCount: {
			type: Number,
			default: null,
		},
	},
	emits: [
		'update-active-field-id',
		'toggle-update',
		'update:is-required',
		'set-data',
	],

	data() {
		return {
			defaultInputLabel: this.field.inputLabel,
		};
	},

	computed: {
		...mapGetters(['currentElementSettings']),
		computedSettingsClass() {
			return [
				{
					'field__settings--open': this.isOpen,
				},
				{
					'field__settings--error': this.isDisablingLastToggle && this.isOpen,
				},
			];
		},
		isOpen() {
			return this.activeFieldId === this.field.id;
		},
		isFieldRequired() {
			return this.findRequiredRule(this.field.validation);
		},
		isOnlyOneFieldLeft() {
			return this.currentElementSettings.schema.length === 1 || (this.isFieldRequired && this.requiredFieldCount === 1);
		},
		isRequireMessageShown() {
			return this.isDisablingLastToggle || (this.isFieldRequired && this.requiredFieldCount === 1);
		},
	},

	methods: {
		// if the element that's being dragged is open, close it.
		handleFieldDrag() {
			if (this.field.id === this.activeFieldId) {
				this.$emit('update-active-field-id', null);
			}
		},
		findRequiredRule(validationArray) {
			return !!validationArray.some(([rule]) => rule === 'required');
		},
		handleFieldControl() {
			this.$emit('toggle-update', false);
			this.$emit('update-active-field-id', this.field.id);
		},
		setIsRequired(id, isRequired) {
			if (this.requiredFieldCount === 1 && !isRequired) {
				this.$emit('toggle-update', true);

				return;
			}

			this.$emit('toggle-update', false);
			this.$emit('update:is-required', {
				required: isRequired,
				id,
			});
		},
		setFieldType({
			validation,
			messages,
			validationType,
		}) {
			this.saveChange({
				fieldType: 'validation-messages',
				value: messages,
				validationType,
			});
			this.saveChange({
				fieldType: 'validation',
				value: validation,
				validationType,
			});
		},
		saveChange({
			fieldType,
			value,
			validationType,
		}) {
			this.$emit('set-data', {
				id: this.field.id,
				inputLabel: this.field.inputLabel,
				placeholder: this.field.placeholder,
				fieldType,
				validationType,
				value,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.field {
	display: flex;
	flex-direction: column;
	border-top: 1px solid $color-gray-light;

	&__control {
		display: flex;
		align-items: center;
		height: 48px;
		padding: 16px 16px 16px 0;
		cursor: pointer;
	}

	&__control-handle {
		overflow: hidden;
		cursor: move;

		&:focus {
			border: none;
		}
	}

	&__name {
		display: inline-block;
		width: 100%;
		max-width: 230px;
		padding-right: 6px;
		padding-left: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__type-icon {
		flex-shrink: 0;
	}

	&__chevron-icon {
		flex-shrink: 0;
		margin-left: auto;
	}

	&__settings {
		height: 0;
		padding: 0 16px;
		overflow: hidden;

		&-error {
			display: flex;
			align-items: center;
			height: 36px;
			padding-left: 12px;
			color: $color-primary;
			background: $color-primary-light;
			border-radius: $border-radius-small;
		}

		$this: &;

		&--open {
			height: 100%;
			padding: 16px;
			border: 1px solid $color-gray-light;

			&#{$this}--error {
				height: 320px;
			}
		}
	}
}
</style>
