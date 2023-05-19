<template>
	<div
		ref="connectionStatusContainer"
		class="connection-status"
		@mouseenter="setIsHeaderDomainConnectionStatusExpanded(true)"
	>
		<div class="connection-status__trigger">
			<ZyroLoader
				v-if="isBeingVerified"
				size="14px"
			/>
			<div
				v-else
				class="connection-status__status"
			>
				<div
					v-if="!isCustomDomainPreview"
					class="connection-status__status-dot"
					:class="`connection-status__status-dot--${connectionStatusTheme}`"
				/>
				<a
					v-qa="'header-connected-domain'"
					class="connection-status__domain-text z-body-small"
					:href="`https://${customDomain}`"
					target="_blank"
				>
					{{ customDomain }}
				</a>
			</div>
		</div>

		<Popup
			v-if="isHeaderDomainConnectionStatusExpanded"
			placement="bottom"
			:offset="0"
			:target-ref="$refs.connectionStatusContainer"
		>
			<div
				class="connection-status__hover-area"
				@mouseenter="setIsHeaderDomainConnectionStatusExpanded(true)"
				@mouseleave="setIsHeaderDomainConnectionStatusExpanded(false)"
			>
				<div class="connection-status-content">
					<div
						v-if="isBeingVerified"
						class="connection-status-content__loader"
					>
						<ZyroLoader
							color="var(--color-light)"
							size="40px"
						/>
					</div>
					<a
						v-qa="'domain-card-connected-domain'"
						class="connection-status-content__domain-text domain-text z-body-small z-body-small--strong
						connection-status-content__title"
						:href="`https://${customDomain}`"
						target="_blank"
					>
						{{ customDomain }}
					</a>
					<ZyroPill
						v-if="!isCustomDomainPreview"
						v-qa="`domain-card-status-${$t(domainConnectionStatusTextPath)}`"
						:text="$t(domainConnectionStatusTextPath)"
						:theme="connectionStatusTheme"
					/>
					<template v-if="isCustomDomainPreview">
						<InfoBanner
							theme="info"
							class="connection-status-content__banner"
						>
							<template #title>
								<i18n-t
									tag="p"
									class="z-body-small"
									keypath="builder.headerZyroDomainStatusBanner"
								/>
							</template>
						</InfoBanner>
						<ZyroSeparator class="connection-status-content__separator" />
						<ZyroButton
							theme="outline"
							@click="goToDomainSettings"
						>
							{{ $t('builder.publishModal.label') }}
						</ZyroButton>
					</template>

					<template v-else>
						<InfoBanner
							v-if="hasDomainConnectionFailed"
							theme="error"
							class="connection-status-content__banner"
						>
							<template #title>
								<i18n-t
									v-if="isHostingerBrand"
									tag="p"
									class="z-body-small"
									keypath="builder.headerDomainConnectionStatusIncorrectNSBannerHostinger"
								>
									<a
										class="z-link"
										:title="$t('builder.publishedModalDomainConnectionBannerLinkTitle')"
										target="_blank"
										noopener
										:href="DOMAIN_SUPPORT_LINK_WEBSITE_BUILDER"
									>
										{{ $t('builder.headerDomainConnectionStatusVerificationBannerLinkText') }}
									</a>
								</i18n-t>
								<template v-else>
									{{ $t('builder.headerDomainConnectionStatusIncorrectNSBanner') }}
								</template>
							</template>
						</InfoBanner>

						<template v-else-if="isDomainConnectionStatusInVerification">
							<div
								v-if="isHostingerBrand"
								class="connection-status-content__notification"
							>
								<p class="z-body connection-status-content__notification-text">
									{{ $t('builder.headerDomainConnectionStatusVerificationBannerHostinger') }}
								</p>
								<a
									class="z-link"
									:title="$t('builder.publishedModalDomainConnectionBannerLinkTitle')"
									@click="showDomainProviderModal"
								>
									{{ $t('builder.headerDomainConnectionStatusVerificationBannerLinkTextHostinger') }}
								</a>
							</div>
							<InfoBanner
								v-else
								theme="info"
								class="connection-status-content__banner"
							>
								<template #title>
									<i18n-t
										tag="p"
										class="z-body-small"
										keypath="builder.headerDomainConnectionStatusVerificationBanner"
									>
										<a
											class="z-link"
											:title="$t('builder.publishedModalDomainConnectionBannerLinkTitle')"
											target="_blank"
											noopener
											:href="domainSupportLink"
										>
											{{ $t('builder.headerDomainConnectionStatusVerificationBannerLinkText') }}
										</a>
									</i18n-t>
								</template>
							</InfoBanner>
						</template>

						<ZyroSeparator class="connection-status-content__separator" />
						<div
							v-if="isDomainStatusDisclaimerVisible"
							class="connection-status-content__refresh"
						>
							<i18n-t
								keypath="builder.headerDomainConnectionStatusDisclaimerText"
								tag="p"
								class="z-body-small connection-status-content__refresh-text"
							>
								<b>{{ $t('builder.headerDomainConnectionStatusDisclaimerBoldedText') }}</b>
							</i18n-t>
							<i18n-t
								v-if="isSitePublished"
								keypath="builder.headerDomainConnectionStatusDisclaimerPreviewText"
								tag="p"
								class="z-body-small connection-status-content__refresh-preview"
							>
								<a
									target="_blank"
									noopener
									:href="sitePreviewDomainUrl"
								>
									{{ previewDomain }}
								</a>
							</i18n-t>
							<a
								class="z-link z-body-small connection-status-content__refresh-button"
								:class="{ 'connection-status-content__refresh-button--disabled': isRefreshDisabled }"
								:title="$t('builder.headerDomainConnectionStatusDisclaimerRefreshButtonText')"
								@click="handleDomainStatusRefresh"
							>
								{{ $t('builder.headerDomainConnectionStatusDisclaimerRefreshButtonText') }}
							</a>
						</div>
						<ZyroButton
							v-else
							theme="outline"
							@click="goToDomainSettings"
						>
							{{ statusButtonText }}
						</ZyroButton>
					</template>
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroPill, {
	PILL_THEME_SUCCESS,
	PILL_THEME_WARNING,
	PILL_THEME_DANGER,
} from '@/components/global/ZyroPill.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';

import {
	onBeforeMount,
	defineComponent,
	computed,
	ref,
} from 'vue';
import { useStore } from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import { useDomainConnection } from '@/use/useDomainConnection';
import { useHeaderPopups } from '@/use/useHeaderPopups';
import InfoBanner from '@/components/ui/InfoBanner.vue';
import {
	WWW_REDIRECT_PATHS,
	REDIRECT_PARAM_KEYS,
	MODAL_DOMAIN_CONNECTION,
	DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
} from '@/constants';
import {
	useRedirects,
	getRedirectUrlToDashboard,
} from '@/use/useRedirects';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { useI18n } from 'vue-i18n';
import Popup from '@/components/global/Popup.vue';
import {
	OPEN_MODAL,
	GUI_NAMESPACE,
} from '@/store/builder/gui';
import EventLogApi from '@/api/EventLogApi';

const DOMAIN_SUPPORT_LINK = 'https://support.zyro.com/articles/4992775-pointing-a-domain-to-zyro-servers?&_ga=2.154587760.933852130.1646326151-1306854615.1646326151#h_ba4806232e';
const DOMAIN_SUPPORT_LINK_HOSTINGER = 'https://support.hostinger.com/en/articles/1863967-how-to-point-domain-to-hostinger';
const DOMAIN_SUPPORT_LINK_WEBSITE_BUILDER = 'https://support.hostinger.com/en/articles/6627577-how-to-point-a-domain-to-hostinger-website-builder';

const DOMAIN_REFRESH_TIMEOUT = 5000;

export default defineComponent({
	components: {
		ZyroButton,
		ZyroPill,
		ZyroSeparator,
		ZyroLoader,
		InfoBanner,
		Popup,
	},

	setup() {
		const {
			getters,
			state,
			dispatch,
		} = useStore();
		const customDomain = computed(() => state.customDomain);
		const isSitePublished = computed(() => getters.isSitePublished);
		const previewDomain = computed(() => state.previewDomain);
		const sitePreviewDomainUrl = computed(() => getters.sitePreviewDomainUrl);
		const isCustomDomainPreview = computed(() => getters.isCustomDomainPreview);
		const isRefreshDisabled = ref(false);
		const { t } = useI18n();
		const {
			verifyConnection,
			isDomainConnected,
			hasDomainConnectionFailed,
			isDomainConnectionStatusInVerification,
			isBeingVerified,
			domainConnectionStatusTextPath,
		} = useDomainConnection();

		const {
			isHeaderDomainConnectionStatusExpanded,
			setIsHeaderDomainConnectionStatusExpanded,
		} = useHeaderPopups();

		const { redirectToHPanelAddDomain } = useRedirects();

		const statusButtonText = isHostingerBrand
			? t('builder.headerDomainConnectionStatusButtonTextHostinger')
			: t('builder.headerDomainConnectionStatusButtonText');

		const domainSupportLink = isHostingerBrand
			? DOMAIN_SUPPORT_LINK_HOSTINGER
			: DOMAIN_SUPPORT_LINK;

		const isDomainStatusDisclaimerVisible = computed(() => isDomainConnectionStatusInVerification.value && isHostingerBrand);

		const connectionStatusTheme = computed(() => {
			if (isDomainConnected.value) {
				return PILL_THEME_SUCCESS;
			}

			if (isDomainConnectionStatusInVerification.value) {
				return PILL_THEME_WARNING;
			}

			return PILL_THEME_DANGER;
		});

		onBeforeMount(() => {
			if (!isCustomDomainPreview.value) {
				verifyConnection();
			}
		});

		const showDomainProviderModal = () => {
			setIsHeaderDomainConnectionStatusExpanded(false);
			dispatch(`${GUI_NAMESPACE}/${OPEN_MODAL}`, {
				name: MODAL_DOMAIN_CONNECTION,
				settings: {
					modalStepToShow: DOMAIN_STEP_SELECT_DOMAIN_PROVIDER,
					shouldPreventDomainDisconnection: true,
					shouldFetchProviderInformation: true,
				},
			});
		};

		const handleDomainStatusRefresh = async () => {
			if (isRefreshDisabled.value) {
				return;
			}

			await verifyConnection();

			isRefreshDisabled.value = true;
			setTimeout(() => {
				isRefreshDisabled.value = false;
			}, DOMAIN_REFRESH_TIMEOUT);
		};

		const goToDomainSettings = async () => {
			await dispatch('saving/saveWebsite');

			if (isHostingerBrand) {
				EventLogApi.logEvent({
					eventName: 'website_builder.connect_domain_manual.enter',
					eventProperties: {
						location: 'from_preview',
					},
					isHostingerEvent: true,
				});

				redirectToHPanelAddDomain({
					currentDomain: state.customDomain,
					siteId: state.websiteId,
				});
			} else {
				window.location.assign(getRedirectUrlToDashboard({
					path: WWW_REDIRECT_PATHS.SINGLE_SITE_DASHBOARD_DOMAIN,
					params: {
						[REDIRECT_PARAM_KEYS.SITE_ID]: state.websiteId,
					},
				}));
			}
		};

		return {
			customDomain,
			setIsHeaderDomainConnectionStatusExpanded,
			isBeingVerified,
			isDomainConnected,
			hasDomainConnectionFailed,
			isDomainConnectionStatusInVerification,
			domainConnectionStatusTextPath,
			isHeaderDomainConnectionStatusExpanded,
			connectionStatusTheme,
			DOMAIN_SUPPORT_LINK,
			DOMAIN_SUPPORT_LINK_HOSTINGER,
			DOMAIN_SUPPORT_LINK_WEBSITE_BUILDER,
			isHostingerBrand,
			statusButtonText,
			domainSupportLink,
			isDomainStatusDisclaimerVisible,
			isSitePublished,
			previewDomain,
			sitePreviewDomainUrl,
			showDomainProviderModal,
			handleDomainStatusRefresh,
			isRefreshDisabled,
			isCustomDomainPreview,
			goToDomainSettings,
		};
	},
});
</script>

<style lang="scss" scoped>
$popup-width: 370px;

@mixin hidden-text-overflow($max-width) {
	max-width: $max-width;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.connection-status {
	position: relative;
	display: flex;
	align-items: center;
	height: $header-height-editor;

	&__trigger {
		padding: 0 16px;
	}

	&__status {
		display: flex;
		gap: 8px;
		align-items: center;
		user-select: none;
	}

	&__status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;

		&--success {
			background-color: $color-success-dark;
		}

		&--warning {
			background-color: $color-warning-dark;
		}

		&--danger {
			background-color: $color-danger-dark;
		}
	}

	&__domain-text {
		@include hidden-text-overflow(200px);

		text-decoration: none;
	}

	&__hover-area {
		// center content popup under the trigger
		width: $popup-width;
		padding-top: 8px;
	}
}

.connection-status-content {
	$content-padding: 16px;

	position: relative;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	padding: $content-padding;
	overflow: hidden;
	background: $color-light;
	border: 1px solid $color-gray-light;
	border-radius: 12px;
	box-shadow: $box-shadow;

	&__title {
		margin-bottom: 8px;
	}

	&__banner {
		width: 100%;
		margin-top: 16px;
	}

	&__separator {
		margin: 16px 0;
	}

	&__domain-text {
		@include hidden-text-overflow($popup-width - 2 * $content-padding);

		text-decoration: none;
	}

	&__loader {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 40%);
	}

	&__notification {
		margin: 16px 0 0;
	}

	&__notification-text {
		margin-bottom: 8px;
	}

	&__refresh-text,
	&__refresh-preview,
	&__refresh-button {
		color: $color-gray;
	}

	&__refresh-preview {
		margin-top: 8px;
	}

	&__refresh-button {
		margin-top: 8px;
		text-decoration: underline;
		cursor: pointer;

		&--disabled {
			color: $color-gray;
			pointer-events: none;
		}
	}
}
</style>
