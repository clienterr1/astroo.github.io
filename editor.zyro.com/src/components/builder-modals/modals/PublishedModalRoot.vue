<template>
	<!-- Overflows are visible -->
	<ZyroModal
		max-width="730px"
		height="auto"
		class="published-modal"
		:delay="600"
		@close-modal="userClosesModal"
	>
		<div
			class="published-modal__text-container"
			:class="{ 'published-modal__text-container--no-bottom-padding': !customDomain || isCustomDomainPreview, }"
		>
			<h2 class="published-modal__title z-h5">
				<slot name="title" />
			</h2>
			<p class="published-modal__subtitle">
				<slot name="subtitle" />
			</p>

			<ZyroLoader
				v-if="isBeingVerified"
				class="published-modal__loader"
			/>
			<div
				v-else
				class="published-modal__content"
			>
				<PublishedDomainPreview
					:domain-to-show="domainToShowInZyroInput"
					:preview-subdomain="previewSubdomain"
					:hide-subdomain="isCustomDomainShown"
					@open-site="openSite"
				/>
				<div class="published-modal__disclaimer">
					<div class="published-modal__icon-container">
						<ZyroSvgDeprecated
							name="zap"
							class="published-modal__icon"
						/>
					</div>
					<div class="published-modal__disclaimer-text z-font-weight-normal">
						{{ $t('builder.publishedModalDisclaimer') }}
					</div>
				</div>
				<div
					v-if="customDomain && !isCustomDomainPreview"
					class="published-modal__separator"
				/>
				<InfoBanner
					v-if="customDomain && !isCustomDomainPreview && !isDomainConnected"
					v-qa="'builder-publishmodal-domainconnectionbanner'"
					class="published-modal__domain-connection-banner"
					:theme="domainConnectionBannerConfig.infoBannerTheme"
					:title="domainNotActiveTitle"
				>
					<template #title>
						<i18n-t
							v-if="!isHostingerBrand"
							tag="p"
							class="z-body-small"
							:keypath="domainConnectionBannerConfig.translationPath"
						>
							<span class="z-font-weight-bold">
								{{ customDomain }}
							</span>
						</i18n-t>
					</template>
					<template
						v-if="isHostingerBrand"
						#subtitle
					>
						<p class="z-body-small">
							{{ $t('builder.headerDomainConnectionStatusVerificationBannerHostinger') }}
						</p>
						<a
							class="z-link z-body-small"
							:title="$t('builder.headerDomainConnectionStatusVerificationBannerLinkTextHostinger')"
							@click="showDomainProviderModal"
						>
							{{ $t('builder.headerDomainConnectionStatusVerificationBannerLinkTextHostinger') }}
						</a>
						<i18n-t
							keypath="builder.headerDomainConnectionStatusDisclaimerText"
							tag="p"
							class="z-body-small published-modal__domain-disclaimer"
						>
							<b>{{ $t('builder.headerDomainConnectionStatusDisclaimerBoldedText') }}</b>
						</i18n-t>
					</template>
				</InfoBanner>
				<PublishedShareButtons
					v-if="customDomain && !isCustomDomainPreview && isDomainConnected"
					:domain-to-share="customDomain"
				/>
			</div>
		</div>
		<template v-if="!customDomain || isCustomDomainPreview">
			<div class="published-modal__separator" />
			<PublishedModalUpdateSection @connect-domain="isCustomDomainPreview ? goToHPanelDomains() : openDomainConnectionModal()" />
		</template>
		<UpsellBanners
			class="published-modal__upsell-banners"
			:class="{ 'published-modal__upsell-banners--no-top-margin': !customDomain || isCustomDomainPreview }"
		/>
	</ZyroModal>
</template>

<script>
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import {
	computed,
	onMounted,
	defineComponent,
} from 'vue';
import {
	useStore,
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import PublishedModalUpdateSection from '@/components/builder-modals/modals/PublishedModalUpdateSection.vue';

import UpsellBanners from '@/components/reusable-components/UpsellBanners.vue';
import { useDomainConnection } from '@/use/useDomainConnection';
import InfoBanner from '@/components/ui/InfoBanner.vue';
import PublishedDomainPreview from '@/components/ui/PublishedDomainPreview.vue';
import PublishedShareButtons from '@/components/ui/PublishedShareButtons.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
	OPEN_MODAL,
	GUI_NAMESPACE,
} from '@/store/builder/gui';
import EventLogApi from '@/api/EventLogApi';

import { useRedirects } from '@/use/useRedirects';
import { openIntercomMessage } from '@/utils/intercomIntegration';
import {
	MODAL_DOMAIN_CONNECTION,
	DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
} from '@/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

const DOMAIN_CONNECTION_BANNER_FAILED = {
	translationPath: 'builder.publishedModalDomainConnectionFailBanner',
	infoBannerTheme: 'error',
};

const DOMAIN_CONNECTION_BANNER_VERIFIED = {
	translationPath: 'builder.publishedModalVerificationDomainConnectionBanner',
	infoBannerTheme: 'warning',
};

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroModal,
		InfoBanner,
		ZyroLoader,
		UpsellBanners,
		PublishedShareButtons,
		PublishedDomainPreview,
		PublishedModalUpdateSection,
	},

	props: {
		title: {
			type: String,
			default: '',
		},
		subtitle: {
			type: String,
			default: '',
		},
	},

	setup() {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const {
			verifyConnection,
			isDomainConnected,
			hasDomainConnectionFailed,
			isDomainConnectionStatusInVerification,
			isBeingVerified,
		} = useDomainConnection();

		const {
			redirectToDashboard,
			redirectToHPanelAddDomain,
		} = useRedirects();

		const isCustomDomainPreview = computed(() => getters.isCustomDomainPreview);

		onMounted(() => {
			if (!isCustomDomainPreview.value) {
				verifyConnection();
			}
		});

		const showDomainProviderModal = () => {
			dispatch(`${GUI_NAMESPACE}/${OPEN_MODAL}`, {
				name: MODAL_DOMAIN_CONNECTION,
				settings: {
					shouldPreventDomainDisconnection: true,
					modalStepToShow: DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
					shouldFetchProviderInformation: true,
				},
			});
		};

		const goToHPanelDomains = () => {
			EventLogApi.logEvent({
				eventName: 'website_builder.connect_domain_manual.enter',
				eventProperties: {
					location: 'from_publish',
				},
				isHostingerEvent: true,
			});

			redirectToHPanelAddDomain({
				currentDomain: state.customDomain,
				siteId: state.websiteId,
			});
		};

		return {
			isBeingVerified,
			isDomainConnected,
			isCustomDomainPreview,
			hasDomainConnectionFailed,
			isDomainConnectionStatusInVerification,
			redirectToDashboard,
			isHostingerBrand,
			DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
			showDomainProviderModal,
			goToHPanelDomains,
		};
	},

	computed: {
		...mapGetters('subscription', ['hasActiveBusinessSubscription']),
		...mapState([
			'zyroDomain',
			'previewDomain',
			'customDomain',
			'websiteId',
		]),
		...mapGetters([
			'siteCustomDomainUrl',
			'siteZyroDomainUrl',
			'sitePreviewDomainUrl',
			'isCustomDomainPreview',
		]),
		domainConnectionBannerConfig() {
			return this.hasDomainConnectionFailed
				? DOMAIN_CONNECTION_BANNER_FAILED
				: DOMAIN_CONNECTION_BANNER_VERIFIED;
		},
		isCustomDomainShown() {
			return this.customDomain && !this.isCustomDomainPreview && this.isDomainConnected;
		},
		domainToShowInZyroInput() {
			if (this.isCustomDomainShown) {
				return this.customDomain;
			}

			const previewDomain = this.isHostingerBrand ? this.previewDomain : this.zyroDomain;
			const [barePreviewDomain] = previewDomain.split('.');

			return barePreviewDomain;
		},
		previewSubdomain() {
			const previewDomain = this.isHostingerBrand ? this.previewDomain : this.zyroDomain;

			return previewDomain.slice(this.domainToShowInZyroInput.length);
		},
		siteUrlToUse() {
			const previewDomainUrl = this.isHostingerBrand ? this.sitePreviewDomainUrl : this.siteZyroDomainUrl;

			return this.isCustomDomainShown ? this.siteCustomDomainUrl : previewDomainUrl;
		},
		domainNotActiveTitle() {
			return `${this.customDomain} - ${this.$t('siteSettings.domain.verifyingConnection')}`;
		},
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
			openModal: OPEN_MODAL,
		}),
		...mapActions('nps', ['refetchNpsModalVisibilityStatus']),
		openDomainConnectionModal() {
			this.openModal({
				name: MODAL_DOMAIN_CONNECTION,
			});
		},
		openIntercom() {
			openIntercomMessage();
			this.closeModal();
		},
		openSite() {
			window.open(this.siteUrlToUse, '_blank');
			this.handleNpsModalVisibilityStatus();
		},
		async userClosesModal() {
			this.handleNpsModalVisibilityStatus();
		},
		async handleNpsModalVisibilityStatus() {
			this.refetchNpsModalVisibilityStatus();
			this.closeModal();
		},
	},
});
</script>

<style lang="scss" scoped>
.published-modal {
	z-index: $z-index-popup;
	color: $color-dark;

	$this: &;

	/* stylelint-disable-next-line selector-class-pattern */
	:deep(.modal__content) {
		display: flex;
		flex-direction: column;
		padding: 0;
		overflow: hidden;
		border-bottom-right-radius: 20px;
		border-bottom-left-radius: 20px;
	}

	&__text-container {
		padding: 48px 40px;

		&--no-bottom-padding {
			padding-bottom: 0;
		}
	}

	&__title {
		text-align: center;
	}

	&__disclaimer {
		display: flex;
		width: 100%;
		max-width: 460px;
		margin: 16px 0 32px;
	}

	&__icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 20px;
		padding: 3px;
		margin-right: 8px;
		background: $color-warning-light;
		border-radius: 100%;
	}

	&__icon {
		width: 16px;
		height: 16px;
		color: $color-warning-dark;
	}

	&__disclaimer-text {
		font-size: 12px;
		line-height: 1.33;
		color: $color-gray;
	}

	&__separator {
		border-top: 1px solid $color-gray-border;
	}

	&__subtitle {
		margin: 16px auto 32px;
		font-size: 13px;
		line-height: 1.54;
		color: $color-gray;
		text-align: center;
	}

	&__upsell-banners {
		margin-top: 32px;

		&--no-top-margin {
			margin-top: 0;
		}
	}

	&__domain-connection-banner {
		margin-top: 32px;
	}

	&__loader {
		margin: 0 auto;
	}

	&__domain-disclaimer {
		margin-top: 16px;
		color: $color-gray;
	}
}

@media screen and (max-width: $media-mobile) {
	.published-modal {
		/* stylelint-disable-next-line selector-class-pattern */
		:deep(.modal__content) {
			display: flex;
			flex-direction: column;
			padding: 0;
		}

		&__text-container {
			padding: 56px 24px 0;
		}

		&__separator {
			display: none;
		}

		&__subtitle {
			margin-bottom: 40px;
		}
	}
}
</style>
