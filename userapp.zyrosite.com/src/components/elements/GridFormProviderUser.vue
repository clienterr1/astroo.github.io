<template>
	<GridForm
		:id="id"
		:form-id="data.formId"
		:settings="data.settings"
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
		:show-success-message="showSuccessMessage"
		:is-error="isError"
		:is-user-site="true"
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
		@on-submit="onSubmit"
	>
		<PostSubmitElement
			:show-success-message="showSuccessMessage"
			:success-message="data.settings.successMessage"
			:is-loading="isLoading"
			:is-error="isError"
			:theme="data.settings.theme"
			:has-border-width="data.formBorderWidth !== 0"
		/>
	</GridForm>
</template>

<script>
import { mapGetters } from 'vuex';
import { defineComponent } from 'vue';

import GridForm from '@zyro-inc/site-modules/components/elements/form/GridForm.vue';
import PostSubmitElement from '@zyro-inc/site-modules/components/elements/form/PostSubmitElement.vue';
import {
	MINIMUM_LOAD_TIME,
	SUBMIT_ACTIONS,
} from '@zyro-inc/site-modules/components/elements/form/constants';

export default defineComponent({
	components: {
		GridForm,
		PostSubmitElement,
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
		currentLocale: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			isLoading: false,
			showSuccessMessage: false,
			isError: false,
		};
	},

	computed: {
		...mapGetters([
			'meta',
			'forms',
			'getPagePathFromId',
		]),
	},

	methods: {
		saveData({
			token,
			model,
		}) {
			fetch(`${import.meta.env.VITE_BACKEND_API_URL}/u1/data/v2/post/${token}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=UTF-8',
				},
				credentials: 'omit',
				mode: 'cors',
				body: JSON.stringify(model),
			}).then((response) => {
				if (!response.ok) {
					throw new Error(response.statusText);
				}

				return response;
			});
		},
		async onSubmit(model) {
			if (this.meta.isDemoTemplate) {
				this.showSuccessMessage = true;

				return;
			}

			this.isLoading = true;
			let allowLoadingToStop = false;

			// Set minimum load time to 200ms

			setTimeout(() => {
				allowLoadingToStop = true;
				this.isLoading = !(this.showSuccessMessage || this.isError);
			}, MINIMUM_LOAD_TIME);
			try {
				await this.saveData({
					token: this.forms[this.data.formId].token,
					model: Object.fromEntries(Object.entries(model).map(([key, value]) => [
						key.replace(/["']+/g, ''),
						value,
					])),
				});
				this.showSuccessMessage = true;

				const { submitAction } = this.data.settings;

				if (!submitAction || submitAction.id === SUBMIT_ACTIONS.SHOW_MESSAGE) {
					return;
				}

				const { pageId } = this.data.settings.submitRedirectPage;

				const pagePath = this.getPagePathFromId({
					pageId,
				});

				this.$router.push({
					path: pagePath,
				});
			} catch (error) {
				console.error(error);
				this.isError = true;
			} finally {
				if (allowLoadingToStop) {
					this.isLoading = false;
				}
			}
		},
	},
});
</script>
