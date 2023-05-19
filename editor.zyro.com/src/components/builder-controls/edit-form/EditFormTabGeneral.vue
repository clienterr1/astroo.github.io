<template>
	<div class="form-controls">
		<DemoJoinZyroInlineDisclaimer
			v-if="isDemoMode"
			class="form-controls__demo-disclaimer"
			:text="$t('builder.demoBuilderChooseBuilderToManageForm')"
		/>
		<template v-else>
			<ZyroFieldInput
				v-model="formName"
				:placeholder="$t('builder.editForm.formName')"
				:label="$t('builder.editForm.formName')"
				class="form-controls__form-name-change"
				:class="{ 'form-controls__form-name-change--save': isFormNameSaveButtonShown }"
				:maxlength="255"
				:error="formNameErrorMessage"
			>
				<template #suffix>
					<span class="form-controls__save-button">
						<ZyroButton
							v-if="isFormNameSaveButtonShown"
							@click="saveFormName"
						>
							{{ $t('common.save') }}
						</ZyroButton>
					</span>
				</template>
			</ZyroFieldInput>
			<ZyroFieldToggle
				v-if="false"
				id="sendEmail"
				:label="$t('builder.editForm.emailNotifications')"
				:model-value="areFormEmailNotificationsEnabled"
				@update:model-value="updateAreFormEmailNotificationsEnabled"
			/>
			<ZyroLoader
				v-if="isEmailLoading"
				class="form-controls__email-loader"
				size="40px"
			/>
			<template v-else>
				<ZyroFieldInput
					v-model="email"
					:label="$t('common.email')"
					data-qa="formsettings-email-change-input"
					class="form-controls__email-change"
					:class="{ 'form-controls__email-change--save': isEmailSaveButtonShown }"
					:error="emailErrorMessage"
					@keyup-enter="handleEmailInputEnter"
				>
					<template #sublabel>
						<p class="editor-text z-body-small text--gray form-controls__email-sublabel">
							{{ $t('builder.editForm.emailChangeMessage') }}
						</p>
					</template>
					<template #suffix>
						<span class="form-controls__save-button">
							<ZyroLoader
								v-if="isEmailChangeLoading"
								size="20px"
							/>
							<ZyroButton
								v-else-if="isEmailSaveButtonShown"
								@click="saveEmailChange"
							>
								{{ $t('common.save') }}
							</ZyroButton>
						</span>
					</template>
				</ZyroFieldInput>
				<InfoBanner
					v-if="isEmailChangePending"
					v-qa="'builder-formsettings-email-change-pending'"
					class="form-controls__email-change-pending-banner"
					:title="$t('builder.editForm.verifyPendingTitle')"
					:subtitle="$t('builder.editForm.verifyPendingMessage', [currentFormEmail])"
				/>

				<div
					v-if="isEmailResetButtonShown"
					class="form-controls__reset-button"
				>
					<ZyroButton
						theme="outline"
						@click="resetDefaultEmail"
					>
						{{ $t('builder.editForm.resetEmail') }}
					</ZyroButton>
				</div>
			</template>
			<ZyroSeparator class="separator" />
			<p class="editor-text z-body-small z-body-small--strong">
				{{ $t('builder.editForm.formSubmissionsTable') }}
			</p>

			<p class="editor-text z-body-small text--gray">
				{{ $t('builder.editForm.formSubmissionsExplanation') }}
			</p>
			<ZyroButton
				theme="outline"
				data-qa="formsettings-form-submissions-button"
				class="form-controls__submissions-button"
				@click="$router.push({
					name: FORMS_SETTINGS_ROUTE,
					params: { formName: currentFormName }
				})"
			>
				{{ $t('builder.editForm.formSubmissionsButton') }}
			</ZyroButton>
		</template>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import { useStore } from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import { VALIDATE_EMAIL_REG_EXP } from '@zyro-inc/site-modules/constants/regex';

import DemoJoinZyroInlineDisclaimer from '@/components/reusable-components/DemoJoinZyroInlineDisclaimer.vue';
import InfoBanner from '@/components/ui/InfoBanner.vue';
import { FORMS_SETTINGS_ROUTE } from '@/constants/routes';

import {
	computed,
	defineComponent,
	onMounted,
	ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroFieldInput,
		ZyroFieldToggle,
		ZyroSeparator,
		InfoBanner,
		ZyroLoader,
		DemoJoinZyroInlineDisclaimer,
	},

	setup() {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const { t } = useI18n();
		const isDemoMode = computed(() => state.isDemoMode);

		const currentFormName = computed(() => getters.currentElement.formId);
		const formName = ref(currentFormName.value);

		const isFormNameValid = computed(() => formName.value.length > 0);
		const formNameErrorMessage = computed(() => (isFormNameValid.value ? null : t('validate.emptyValue')));
		const isFormNameSaveButtonShown = computed(() => formName.value !== currentFormName.value);

		const currentFormEmail = computed(() => getters['forms/getCurrentFormEmail'](currentFormName.value));
		const email = ref('');
		const isEmailLoading = ref(false);
		const isEmailValid = computed(() => VALIDATE_EMAIL_REG_EXP.test(email.value));
		const emailErrorMessage = computed(() => (isEmailValid.value ? null : t('builder.editForm.emailValidationErrorMessage')));
		const isEmailSaveButtonShown = computed(() => email.value !== currentFormEmail.value);
		const isEmailChangeLoading = ref(false);
		const isEmailChangePending = computed(() => getters['forms/isFormEmailChangePending'](currentFormName.value));
		const areFormEmailNotificationsEnabled = computed(() => getters['forms/getFormEmailNotifications'](currentFormName.value));
		const isEmailResetButtonShown = computed(() => currentFormEmail.value !== getters['user/getUserEmail']);

		const saveEmailChange = async () => {
			if (!isEmailValid.value) {
				return;
			}

			isEmailChangeLoading.value = true;

			await dispatch('forms/updateFormEmail', {
				formId: currentFormName.value,
				newFormEmail: email.value,
			});

			isEmailChangeLoading.value = false;
		};

		const handleEmailInputEnter = () => {
			if (!isEmailChangeLoading.value && isEmailSaveButtonShown.value) {
				saveEmailChange();
			}
		};

		const saveFormName = async () => {
			formName.value = formName.value.trim();
			if (!isFormNameValid.value) {
				return;
			}

			dispatch('mergeCurrentElementData', {
				elementData: {
					formId: formName.value,
				},
			});

			isEmailLoading.value = true;
			await dispatch('forms/createFormInbox', {
				formId: formName.value,
			});

			// Since we create the inbox in the backend, we need to refresh email list in frontend
			await dispatch('forms/fetchCurrentAndPendingFormEmails', {
				formId: formName.value,
			});
			// Resetting the email input to the value of the email connected to the new form
			// which should always be the default user email
			email.value = currentFormEmail.value;
			isEmailLoading.value = false;
		};

		const updateAreFormEmailNotificationsEnabled = (newValue) => {
			dispatch('forms/updateFormEmailNotifications', {
				formId: currentFormName.value,
				emailNotifications: newValue,
			});
		};

		const resetDefaultEmail = async () => {
			isEmailChangeLoading.value = true;

			await dispatch('forms/resetFormEmail', {
				formId: currentFormName.value,
			});

			isEmailChangeLoading.value = false;
			email.value = currentFormEmail.value;
		};

		onMounted(async () => {
			if (isDemoMode.value) {
				return;
			}

			isEmailLoading.value = true;
			await dispatch('forms/fetchCurrentAndPendingFormEmails', {
				formId: currentFormName.value,
				force: !!isEmailChangePending.value,
			});
			isEmailLoading.value = false;

			email.value = currentFormEmail.value;
		});

		return {
			isDemoMode,
			formName,
			currentFormName,
			saveFormName,
			isFormNameSaveButtonShown,
			FORMS_SETTINGS_ROUTE,
			formNameErrorMessage,
			saveEmailChange,
			email,
			isEmailLoading,
			emailErrorMessage,
			isEmailSaveButtonShown,
			isEmailChangeLoading,
			isEmailChangePending,
			areFormEmailNotificationsEnabled,
			isEmailResetButtonShown,
			currentFormEmail,
			updateAreFormEmailNotificationsEnabled,
			resetDefaultEmail,
			handleEmailInputEnter,
		};
	},
});
</script>

<style lang="scss" scoped>
:deep(.form-controls) {
	.editor-text + .zyro-field-text {
		margin-top: 20px;
	}

	.zyro-field-toggle + .editor-text {
		margin-top: 8px;
	}

	.zyro-field-text + .zyro-field-toggle {
		margin-top: 32px;
	}
}

.separator {
	margin: 16px auto;
}

.form-controls {
	&__demo-disclaimer {
		margin-bottom: 16px;
	}

	&__submissions-button {
		display: flex;
		justify-content: center;
		margin: 25px auto 11px;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:deep(.form-controls__email-change),
	:deep(.form-controls__form-name-change) {
		.zyro-field-wrapper {
			&__suffix {
				margin-left: 0;
			}
		}
	}

	&__email-loader {
		margin: 0 auto;
	}

	/* stylelint-disable-next-line selector-class-pattern */
	:deep(.form-controls__email-change--save),
	:deep(.form-controls__form-name-change--save) {
		.zyro-input {
			&__input {
				padding-right: 65px;
			}
		}
	}

	&__email-sublabel {
		margin-bottom: 5px;
	}

	&__save-button {
		position: absolute;
		right: 16px;
	}

	&__reset-button {
		display: flex;
		justify-content: center;
	}

	&__email-change-pending-banner + &__reset-button {
		margin-top: 16px;
	}
}

.text {
	&--gray {
		color: $color-gray;
	}
}
</style>
