<template>
	<div class="input-types">
		<ZyroLabel class="input-types__label">
			{{ $t('builder.editForm.fieldType') }}
		</ZyroLabel>
		<ZyroDropdown
			:options="typeValidations"
			:model-value="currentType"
			class="input-types__dropdown"
			@update:model-value="$emit('change-type', $event.field)"
		/>
	</div>
</template>
<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import {
	defineComponent,
	computed,
} from 'vue';

import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroDropdown,
		ZyroLabel,
	},

	props: {
		validation: {
			type: Array,
			required: true,
		},
	},

	emits: ['change-type'],

	setup(props) {
		const { t } = useI18n();
		const typeText = {
			title: t('builder.editForm.fieldTypes.fieldTypeText'),
			field: {
				validation: [['optional']],
				messages: {
					required: 'This field is required',
				},
				validationType: 'text',
			},
			svg: 'text-sm',
		};
		const typeEmail = {
			title: t('builder.editForm.fieldTypes.fieldTypeEmail'),
			field: {
				validation: [
					['bail'],
					['email'],
					['required'],
				],
				messages: {
					required: 'This field is required',
					email: 'Please enter a valid email address',
				},
				validationType: 'email',
			},
			svg: 'mail',
		};
		const typePhone = {
			title: t('builder.editForm.fieldTypes.fieldTypePhone'),
			field: {
				validation: [
					['bail'],
					['required'],
					[
						'matches',
						// eslint-disable-next-line no-useless-escape
						'/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/',
					],
				],
				messages: {
					required: 'This field is required',
					matches: 'Please enter a valid phone number',
				},
				validationType: 'phone',
			},
			svg: 'smartphone',
		};

		const isBailRulePresent = computed(() => props.validation.some(([rule]) => rule === 'bail'));

		const isMailRulePresent = computed(() => props.validation.some(([rule]) => rule === 'email'));

		const currentType = computed(() => {
			if (!isBailRulePresent.value) {
				return typeText;
			}

			if (isMailRulePresent.value) {
				return typeEmail;
			}

			return typePhone;
		});

		return {
			typeValidations: [
				typeText,
				typeEmail,
				typePhone,
			],
			currentType,
		};
	},
});
</script>
<style lang="scss" scoped>
.input-types {
	&__label {
		margin-bottom: 8px;
	}

	// This should be not needed after dorp-down rework
	// As for the moment removing absolute position fixes form settings scrollability
	&__dropdown {
		/* stylelint-disable-next-line selector-class-pattern */
		:deep(.popup__card) {
			position: relative;
		}
	}
}
</style>
