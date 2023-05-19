<template>
	<GridForm
		:id="id"
		:form-id="data.formId"
		:settings="data.settings"
		:is-user-site="false"
		:submit-button-data="data.submitButtonData"
		:submit-button-background-color="data.submitButtonBackgroundColor"
		:submit-button-background-color-hover="data.submitButtonBackgroundColorHover"
		:submit-button-font-color="data.submitButtonFontColor"
		:submit-button-font-color-hover="data.submitButtonFontColorHover"
		:submit-button-border-color="data.submitButtonBorderColor"
		:submit-button-border-color-hover="data.submitButtonBorderColorHover"
		:submit-button-font-family="data.submitButtonFontFamily"
		:submit-button-font-weight="data.submitButtonFontWeight"
		:submit-button-font-size-mobile="data.mobile?.submitButtonFontSize"
		:submit-button-font-size-desktop="data.desktop?.submitButtonFontSize"
		:submit-button-border-width="data.submitButtonBorderWidth"
		:submit-button-border-radius="data.submitButtonBorderRadius"
		:theme="data.settings.theme"
		:form-justify="data.settings.styles.justify"
		:form-button-justify-self="data.submitButtonData.settings.styles.align"
		:mobile-form-button-justify-self="data.submitButtonData.settings.styles['m-align']"
		:form-background-color="data.formBackgroundColor"
		:form-border-width="data.formBorderWidth"
		:form-border-color="data.formBorderColor"
		:form-border-radius="data.formBorderRadius"
		:form-padding="data.formPadding"
		:input-fill-color="data.inputFillColor"
		:input-fill-color-hover="data.inputFillColorHover"
		:form-font-family="data.formFontFamily"
		:form-font-weight="data.formFontWeight"
		:label-text-color="data.labelTextColor"
		:label-text-size="data.desktop?.labelTextSize"
		:mobile-label-text-size="data.mobile?.labelTextSize"
		:input-text-color="data.inputTextColor"
		:input-text-color-hover="data.inputTextColorHover"
		:input-text-size="data.desktop?.inputTextSize"
		:mobile-input-text-size="data.mobile?.inputTextSize"
		:input-border-color="data.inputBorderColor"
		:input-border-color-hover="data.inputBorderColorHover"
		:input-border-width="data.inputBorderWidth"
		:input-border-radius="data.inputBorderRadius"
		:elements-vertical-spacing="data.desktop?.formElementsVerticalSpacing"
		:mobile-elements-vertical-spacing="data.mobile?.formElementsVerticalSpacing"
	/>
</template>

<script>
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import GridForm from '@zyro-inc/site-modules/components/elements/form/GridForm.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridFormProviderBuilder',

	components: {
		GridForm,
	},

	props: {
		id: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},

	computed: {
		...mapState([
			'isDemoMode',
			'website',
		]),
		...mapGetters(['siteForms']),
	},

	created() {
		if (!this.siteForms[this.data.formId]?.token && !this.isDemoMode && this.website) {
			this.generateToken({
				formId: this.data.formId,
			});
		}
	},

	methods: {
		...mapActions('forms', ['generateToken']),
	},
});
</script>
