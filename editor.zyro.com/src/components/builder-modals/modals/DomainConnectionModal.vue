<template>
	<ZyroModal
		width="963px"
		height="auto"
		min-height="425px"
		class="domain-modal"
		@close-modal="closeDomainConnectionModal"
	>
		<div
			v-if="isStepperShown"
			class="domain-modal__stepper-wrapper"
		>
			<Stepper
				class="domain-modal__stepper"
				:steps-config="STEPPER_STEPS"
				:current-step-index="currentStepperStepIndex"
				seperator-width="48px"
				@step-click="setCurrentModalStepComponent(MODAL_STEPS[$event + 1].component)"
			/>
		</div>
		<template v-if="currentModalStepComponent === DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS">
			<div
				v-if="isFetchingDomainData || isLoading"
				class="loader-wrapper"
			>
				<ZyroLoader />
			</div>
			<ThirdPartyDomainConnection
				v-else-if="isThirdPartyDomainConnectionShown"
				:domain-input-value="domainValue"
				:domain-input-error="domainInputError"
				:is-domain-available-to-register-banner-shown="isDomainAvailableToRegisterBannerShown"
				@update-domain-value="updateThirdPartyDomainValue"
				@submit="handleContinueButtonClick"
			/>
			<DomainConnectionOptions
				v-else
				:selected-domain-connection-option="selectedDomainConnectionOption"
				:domain-value="domainValue"
				@update-domain-connection-option="selectedDomainConnectionOption = $event"
				@update-domain-value="domainValue = $event"
			/>
		</template>
		<Component
			:is="currentModalStepComponent"
			v-else
		/>

		<template #footer>
			<div class="domain-modal__footer">
				<ZyroButton
					v-if="isGoBackButtonShown"
					theme="plain"
					data-qa="sitesettings-domain-btn-go-back"
					@click="handleGoBackButtonClick"
				>
					<template #icon-left>
						<ZyroSvgDeprecated
							name="arrow"
							dimensions="16px"
							direction="left"
						/>
					</template>
					{{ $t('common.goBack') }}
				</ZyroButton>

				<ZyroButton
					v-if="isFetchingDomainData || isLoading"
					class="domain-modal__footer-right-button"
					theme="primary"
				>
					<ZyroLoader
						size="14px"
						weight="2px"
						color="var(--color-light)"
					/>
				</ZyroButton>
				<ZyroButton
					v-else
					theme="primary"
					class="domain-modal__footer-right-button"
					:disabled="isContinueButtonDisabled"
					data-qa="sitesettings-domain-btn-continue"
					@click="handleContinueButtonClick"
				>
					{{ currentButtonText }}
				</ZyroButton>
			</div>
		</template>
		<Teleport
			v-if="showStopConnectionModal"
			to="body"
		>
			<SiteSettingsModal
				:title="$t('siteSettings.domain.domainConnectionModal.stopConnectionModalTitle')"
				:left-button-text="$t('siteSettings.domain.domainConnectionModal.stopConnection')"
				:right-button-text="$t('siteSettings.domain.domainConnectionModal.continueConnection')"
				@close="showStopConnectionModal = false"
				@left-button-click="handleStopConnectionConfirmation"
				@right-button-click="showStopConnectionModal = false"
			>
				{{ $t('siteSettings.domain.domainConnectionModal.stopConnectionModalSubtitle') }}
			</SiteSettingsModal>
		</Teleport>
	</ZyroModal>
</template>

<script>

import { defineComponent } from 'vue';
import {
	mapState,
	useStore,
} from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import EventLogApi from '@/api/EventLogApi';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import SiteSettingsModal from '@/components/site-settings/components/SiteSettingsModal.vue';
import ThirdPartyDomainConnection from '@/components/site-settings/pages/domain/domain-connection/-partials/ThirdPartyDomainConnection.vue';
import {
	DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS,
	DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
	DOMAIN_STEP_VERIFICATION_MODAL,
	DOMAIN_OPTION_THIRD_PARTY,
	DOMAIN_OPTION_FREE,
	DOMAIN_OPTION_ZYRO,
	DOMAIN_OPTION_BUY,
	DOMAIN_STEP_PROVIDER_INFORMATION,
	DOMAIN_STEP_NAMESERVERS_SETTINGS,
	WWW_REDIRECT_PATHS,
	REDIRECT_PARAM_KEYS,
	REDIRECT_PARAM_VALUES,
} from '@/constants';
import DomainConnectionOptions from '@/components/site-settings/pages/domain/domain-connection/steps/DomainConnectionOptions.vue';
import NameserversSettingsStep from '@/components/site-settings/pages/domain/domain-connection/steps/NameserversSettingsStep.vue';
import ProviderInformationStep from '@/components/site-settings/pages/domain/domain-connection/steps/ProviderInformationStep.vue';
import SelectDomainProviderStep from '@/components/site-settings/pages/domain/domain-connection/steps/SelectDomainProviderStep.vue';
import VerificationModalStep from '@/components/site-settings/pages/domain/domain-connection/steps/VerificationModalStep.vue';
import { useDomainConnection } from '@/use/useDomainConnection';
import { useHeaderPopups } from '@/use/useHeaderPopups';
import Stepper from '@/components/ui/Stepper.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';
import { isValidDomain } from '@/utils/urlValidators';

const STEPPER_STEPS = [
	{
		component: DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
	},
	{
		component: DOMAIN_STEP_PROVIDER_INFORMATION,
	},
	{
		component: DOMAIN_STEP_NAMESERVERS_SETTINGS,
	},
	{
		component: DOMAIN_STEP_VERIFICATION_MODAL,
	},
];

const MODAL_STEPS = [
	{
		component: DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS,
		buttonTextPath: 'common.continue',
	},
	{
		component: DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
		buttonTextPath: 'common.continue',
	},
	{
		component: DOMAIN_STEP_PROVIDER_INFORMATION,
		buttonTextPath: 'siteSettings.domain.domainConnectionModal.signedInButtonText',
	},
	{
		component: DOMAIN_STEP_NAMESERVERS_SETTINGS,
		buttonTextPath: 'siteSettings.domain.domainConnectionModal.replacedThemButtonText',
	},
	{
		component: DOMAIN_STEP_VERIFICATION_MODAL,
		buttonTextPath: 'common.done',
	},
];

export default defineComponent({
	name: 'DomainConnectionModal',

	components: {
		ZyroButton,
		ZyroModal,
		ZyroSvgDeprecated,
		ZyroLoader,
		Stepper,
		DomainConnectionOptions,
		SelectDomainProviderStep,
		ProviderInformationStep,
		NameserversSettingsStep,
		VerificationModalStep,
		SiteSettingsModal,
		ThirdPartyDomainConnection,
	},

	setup() {
		const { state } = useStore();

		const { setIsHeaderDomainConnectionStatusExpanded } = useHeaderPopups();

		const {
			isLoading,
			setCurrentModalStepComponent,
			getIsDomainAvailableToRegister,
			removeDomain,
			getProviderInformation,
			isDomainConnected,
			verifyConnection,
			connectCustomDomain,
			publishWithGeneratedDomain,
			hasFailed,
			currentModalStepComponent,
			domainConnectionError,
			isHostingerDomainConnectionFlow,
			fetchUnusedDomainsList,
			fetchFreeDomainSubscription,
			isFreeDomainAvailable,
			unusedDomainsList,
		} = useDomainConnection(state.websiteId);

		const {
			redirectToDashboard,
			redirectToWWW,
		} = useRedirects();

		return {
			isLoading,
			hasFailed,
			setCurrentModalStepComponent,
			setIsHeaderDomainConnectionStatusExpanded,
			getIsDomainAvailableToRegister,
			isDomainConnected,
			verifyConnection,
			removeDomain,
			getProviderInformation,
			connectCustomDomain,
			publishWithGeneratedDomain,
			currentModalStepComponent,
			domainConnectionError,
			MODAL_STEPS,
			STEPPER_STEPS,
			isHostingerDomainConnectionFlow,
			fetchUnusedDomainsList,
			fetchFreeDomainSubscription,
			redirectToDashboard,
			redirectToWWW,
			isFreeDomainAvailable,
			unusedDomainsList,
			DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS,
		};
	},

	data() {
		return {
			domainValue: '',
			domainInputError: '',
			isDomainAvailableToRegisterBannerShown: false,
			isThirdPartyDomainConnectionShown: false,
			showStopConnectionModal: false,
			selectedDomainConnectionOption: null,
			isVerificationWithoutStepsEnabled: false,
			isFetchingDomainData: false,
		};
	},

	computed: {
		...mapState(['customDomain']),
		...mapState('gui', ['activeModalSettings']),
		...mapState(['websiteId']),
		currentStepIndex() {
			return MODAL_STEPS.findIndex(({ component }) => component === this.currentModalStepComponent);
		},
		currentStepperStepIndex() {
			return STEPPER_STEPS.findIndex(({ component }) => component === this.currentModalStepComponent);
		},
		currentStep() {
			return MODAL_STEPS[this.currentStepIndex];
		},
		currentButtonText() {
			return this.$t(this.currentStep.buttonTextPath);
		},
		isFirstModalStep() {
			return this.currentStepIndex === 0;
		},
		isStepperShown() {
			if (this.isVerificationWithoutStepsEnabled) {
				return false;
			}

			return !this.isFirstModalStep && !this.isDomainConnected;
		},
		shouldPreventDomainDisconnection() {
			return this.activeModalSettings?.shouldPreventDomainDisconnection;
		},
		isContinueButtonDisabled() {
			if (this.currentModalStepComponent !== DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS) {
				return false;
			}

			// For third party domain connection flow, disable continue button if no domain value is typed in
			if (this.isThirdPartyDomainConnectionShown) {
				return !this.domainValue || this.isDomainAvailableToRegisterBannerShown;
			}

			// Else, disable continue button until domain option is selected
			return !this.selectedDomainConnectionOption;
		},
		isGoBackButtonShown() {
			if (this.isVerificationWithoutStepsEnabled) {
				return false;
			}

			if (this.isThirdPartyDomainConnectionShown) {
				return true;
			}

			if (this.shouldPreventDomainDisconnection) {
				return this.currentModalStepComponent !== DOMAIN_STEP_SELECT_DOMAIN_PROVIDER;
			}

			return !this.isFirstModalStep;
		},
	},

	async beforeMount() {
		this.isFetchingDomainData = true;
		await this.fetchUnusedDomainsList();
		await this.fetchFreeDomainSubscription();

		this.isFetchingDomainData = false;

		if (this.activeModalSettings?.modalStepToShow) {
			if (this.activeModalSettings?.modalStepToShow === DOMAIN_STEP_VERIFICATION_MODAL) {
				this.isVerificationWithoutStepsEnabled = true;
			}

			this.setCurrentModalStepComponent(this.activeModalSettings.modalStepToShow);
		}

		if (this.activeModalSettings?.shouldFetchProviderInformation) {
			this.getProviderInformation(this.customDomain);
		}
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		updateThirdPartyDomainValue(value) {
			this.domainValue = value.trim();
			// Hide the banner once the input changes
			this.isDomainAvailableToRegisterBannerShown = false;
		},
		setNextStep() {
			this.setCurrentModalStepComponent(MODAL_STEPS[this.currentStepIndex + 1].component);
		},
		setPreviousStep() {
			this.setCurrentModalStepComponent(MODAL_STEPS[this.currentStepIndex - 1].component);
		},
		async handleContinueButtonClick() {
			if (this.currentModalStepComponent === DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS) {
				if (this.selectedDomainConnectionOption === DOMAIN_OPTION_FREE) {
					this.redirectToDashboard({
						path: WWW_REDIRECT_PATHS.CLAIM_FREE_DOMAIN,
						params: {
							[REDIRECT_PARAM_KEYS.SITE_ID]: this.websiteId,
							[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_DOMAIN_CONNECTED,
						},
					});

					return;
				}

				// If a domain purchased at Zyro is selected, validation can be omitted and domain can be connected instantly
				if (this.selectedDomainConnectionOption === DOMAIN_OPTION_ZYRO) {
					await this.handleCustomDomainConnection();

					return;
				}

				// If a buy domain option is selected, redirect to the domain purchase page
				if (this.selectedDomainConnectionOption === DOMAIN_OPTION_BUY) {
					this.redirectToWWW({
						path: WWW_REDIRECT_PATHS.DOMAINS,
						params: {
							[REDIRECT_PARAM_KEYS.SITE_ID]: this.websiteId,
							[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_DOMAIN_CONNECTED,
						},
					});

					return;
				}

				// If third party domain option has been selected and it wasn't selected previously, show third party connection flow.
				if (this.selectedDomainConnectionOption === DOMAIN_OPTION_THIRD_PARTY && !this.isThirdPartyDomainConnectionShown) {
					this.isThirdPartyDomainConnectionShown = true;

					return;
				}

				// Else, third party domain connection flow is enabled
				await this.connectThirdPartyDomain();

				return;
			}

			if (this.currentModalStepComponent === DOMAIN_STEP_VERIFICATION_MODAL) {
				this.setIsHeaderDomainConnectionStatusExpanded(true);
				this.closeModal();
			} else {
				this.setNextStep();
			}
		},
		async handleGoBackButtonClick() {
			if (this.currentModalStepComponent === DOMAIN_STEP_SELECT_DOMAIN_PROVIDER) {
				await this.removeDomain();

				if (this.hasFailed) {
					return;
				}
			}

			// Handle going back after connecting Hostinger integration domain
			if (this.currentModalStepComponent === DOMAIN_STEP_VERIFICATION_MODAL && this.isHostingerDomainConnectionFlow) {
				this.removeDomain();
				this.setCurrentModalStepComponent(DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS);

				return;
			}

			if (this.isThirdPartyDomainConnectionShown) {
				this.resetThirdPartyDomainConnection();

				return;
			}

			this.setPreviousStep();
		},
		resetThirdPartyDomainConnection() {
			this.isThirdPartyDomainConnectionShown = false;
			this.selectedDomainConnectionOption = null;
			this.isDomainAvailableToRegisterBannerShown = false;
			this.domainValue = '';
			this.domainInputError = '';
		},
		async handleStopConnectionConfirmation() {
			if (!this.isFirstModalStep) {
				await this.removeDomain();

				if (this.hasFailed) {
					return;
				}
			}

			this.showStopConnectionModal = false;
			this.closeModal();
		},
		async connectThirdPartyDomain() {
			this.isDomainAvailableToRegister = false;

			if (!this.domainValue) {
				this.domainInputError = this.$t('validate.emptyDomainName');

				return;
			}

			if (!isValidDomain(this.domainValue)) {
				this.domainInputError = this.$t('validate.incorrectDomainFormat');

				return;
			}

			const isDomainAvailableToRegister = await this.getIsDomainAvailableToRegister(this.domainValue);

			if (isDomainAvailableToRegister) {
				this.isDomainAvailableToRegisterBannerShown = true;

				return;
			}

			this.domainInputError = '';
			await this.handleCustomDomainConnection();
		},
		async handleCustomDomainConnection() {
			this.domainInputError = '';

			// If site has no domain, publish with a generated one
			await this.publishWithGeneratedDomain(this.domainValue);

			if (this.hasFailed) {
				return;
			}

			// Try to connect the custom domain
			EventLogApi.logEvent({
				eventName: 'site_settings.custom_domain.enter_domain_name',
			});
			await this.connectCustomDomain(this.domainValue);
			if (this.hasFailed) {
				this.domainInputError = this.domainConnectionError;

				return;
			}

			// Verify connection.
			await this.verifyConnection(true);
			if (this.hasFailed) {
				return;
			}

			//  If it is verified, skip instructions.
			if (this.isDomainConnected) {
				this.setCurrentModalStepComponent(DOMAIN_STEP_VERIFICATION_MODAL);

				return;
			}

			// Get domain registrar (set provider information) and go to next step
			EventLogApi.logEvent({
				eventName: 'site_settings.custom_domain.see_instructions',
			});
			await this.getProviderInformation(this.domainValue);

			this.setCurrentModalStepComponent(DOMAIN_STEP_SELECT_DOMAIN_PROVIDER);
		},
		closeDomainConnectionModal() {
			if (this.shouldPreventDomainDisconnection) {
				this.closeModal();
			} else {
				this.showStopConnectionModal = true;
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.domain-modal {
	z-index: $z-index-popup;

	&__stepper-wrapper {
		margin-top: 64px;
	}

	&__stepper {
		margin: 0 auto 8px;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	&__footer-right-button {
		margin-left: auto;
	}
}

.loader-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 425px;
}
</style>
