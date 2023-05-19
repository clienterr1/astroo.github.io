<template>
	<ZyroModal
		max-width="758px"
		max-height="645px"
		class="publish-modal"
		position="bottom"
		@close-modal="handleCloseModal"
	>
		<div
			v-if="isLoading"
			class="loader-wrapper"
		>
			<ZyroLoader />
		</div>
		<div v-else>
			<h2 class="publish-modal__title z-h4">
				{{ $t('builder.publishModal.title') }}
			</h2>
			<p class="publish-modal__subtitle z-body-small">
				{{ $t('builder.publishModal.subtitleText') }}
			</p>
			<form @submit.prevent="submit">
				<PublishModalOption
					v-if="isClaimFreeDomainOptionVisible"
					v-model="selectedPlan"
					data-qa="builder-publishmodal-btn-claimfreedomain"
					:is-active="selectedPlan === OPTION_CLAIM_FREE_DOMAIN"
					:title="$t('builder.publishModalClaimFreeDomainCardTitle')"
					:subtitle="$t('builder.publishModalClaimFreeDomainCardSubtitle')"
					:value="OPTION_CLAIM_FREE_DOMAIN"
					@submit="submit"
				>
					<template #pill>
						<ZyroPill
							text-class="z-button-small"
							:text="$t('builder.publishModalClaimFreeDomainCardPillText')"
							text-color="var(--color-primary)"
							background-color="var(--color-primary-light)"
						/>
					</template>
				</PublishModalOption>
				<PublishModalOption
					v-model="selectedPlan"
					data-qa="builder-publishmodal-btn-customdomain"
					:is-active="selectedPlan === OPTION_CUSTOM_DOMAIN"
					:title="$t('builder.publishModal.label')"
					:subtitle="$t('builder.publishModal.descriptionText')"
					:value="OPTION_CUSTOM_DOMAIN"
					@submit="submit"
				>
					<template #pill>
						<ZyroPill
							v-if="isAbleToConnectHostingerDomain"
							text-class="z-button-small"
							:text="$t('builder.publishedModalHostingerDomain')"
							text-color="var(--color-primary)"
							background-color="var(--color-primary-light)"
						/>
					</template>
				</PublishModalOption>
				<PublishModalOption
					v-model="selectedPlan"
					data-qa="builder-publishmodal-btn-freedomain"
					:is-active="selectedPlan === OPTION_FREE_DOMAIN"
					:title="$t('builder.publishModal.form.labelText')"
					:value="OPTION_FREE_DOMAIN"
					@submit="submit"
				>
					<template #subtitle>
						<ZyroDomainInput
							v-model="previewDomainPlaceholder"
							:preview-subdomain="previewSubdomain"
							class="publish-modal__domain-input"
							:disabled="selectedPlan !== OPTION_FREE_DOMAIN"
							@on-valid="isDomainValid = true; errorMessage = ''"
							@on-invalid="isDomainValid = false; errorMessage = ''"
							@on-loading="isDomainLoading = true"
							@on-error="(message) => { errorMessage = message; isDomainValid = false }"
							@on-loading-end="isDomainLoading = false"
							@clear-message="isDomainValid = null; errorMessage = ''"
							@focus-input="$emit('focus-domain-input')"
						/>
						<div
							v-show="selectedPlan === OPTION_FREE_DOMAIN"
							class="publish-modal__message"
						>
							<ZyroLoader
								v-if="isDomainLoading"
								size="18px"
								weight="3px"
							/>
							<template v-if="isDomainValid && !isDomainLoading">
								<i18n-t keypath="builder.publishModal.form.validDomainMessage">
									👍
								</i18n-t>
							</template>
							<template v-else-if="!isDomainValid && !isDomainLoading && isDomainValid !== null">
								<div class="publish-modal__message--error">
									😬 {{ errorMessage ? errorMessage : $t('validate.domainNameTaken') }}
								</div>
							</template>
							<template v-else-if="!isDomainLoading">
								<div class="publish-modal__message publish-modal__message--baloon">
									{{ $t('builder.publishModal.form.message') }}
								</div>
							</template>
						</div>
					</template>
				</PublishModalOption>
			</form>
		</div>
		<template #footer>
			<ZyroButton
				data-qa="builder-publishmodal-btn-continue"
				class="publish-modal__action"
				:disabled="areModalActionsDisabled"
				theme="primary"
				@click="submit"
			>
				{{ $t('common.continue') }}
			</ZyroButton>
		</template>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroPill from '@/components/global/ZyroPill.vue';

import {
	mapState,
	mapGetters,
	mapMutations,
} from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import PublishModalOption from '@/components/builder-modals/modals/PublishModalOption.vue';

import EventLogApi from '@/api/EventLogApi';
import { sendPublishModalOpenMailEvent } from '@/api/MailEventLogApi';
import { useDomainConnection } from '@/use/useDomainConnection';
import ZyroDomainInput from '@/components/ui/ZyroDomainInput.vue';
import {
	WWW_REDIRECT_PATHS,
	REDIRECT_PARAM_KEYS,
	REDIRECT_PARAM_VALUES,
	MODAL_DOMAIN_CONNECTION,
} from '@/constants';
import {
	mapActionsGui,
	OPEN_MODAL,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import {
	mapActionsNotifications,
	NOTIFY,
} from '@/store/builder/notifications';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

const OPTION_CUSTOM_DOMAIN = 'OPTION_CUSTOM_DOMAIN';
const OPTION_FREE_DOMAIN = 'OPTION_FREE_DOMAIN';
const OPTION_CLAIM_FREE_DOMAIN = 'OPTION_CLAIM_FREE_DOMAIN';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
		ZyroPill,
		ZyroLoader,
		ZyroDomainInput,
		PublishModalOption,
	},

	setup() {
		const { redirectToDashboard } = useRedirects();
		const {
			fetchFreeDomainSubscription,
			isFreeDomainAvailable,
			isLoading,
		} = useDomainConnection();

		return {
			isLoading,
			fetchFreeDomainSubscription,
			redirectToDashboard,
			isFreeDomainAvailable,
			OPTION_CUSTOM_DOMAIN,
			OPTION_FREE_DOMAIN,
			OPTION_CLAIM_FREE_DOMAIN,
		};
	},

	data() {
		return {
			previewDomainPlaceholder: this.$t('builder.publishModal.placeholderDomain'),
			previewSubdomain: import.meta.env.VITE_PUBLISH_DOMAIN,
			selectedPlan: OPTION_CUSTOM_DOMAIN,
			errorMessage: '',
			isDomainValid: null,
			isDomainLoading: false,
			isClaimFreeDomainOptionVisible: false,
		};
	},

	computed: {
		...mapState(['websiteId']),
		...mapGetters('user', ['isAbleToConnectHostingerDomain']),
		areModalActionsDisabled() {
			return this.isDomainLoading || (!this.isDomainValid && this.selectedPlan === OPTION_FREE_DOMAIN);
		},
	},

	async mounted() {
		await this.fetchFreeDomainSubscription();
		if (this.isFreeDomainAvailable) {
			this.isClaimFreeDomainOptionVisible = true;
			this.selectedPlan = OPTION_CLAIM_FREE_DOMAIN;
		}

		EventLogApi.logEvent({
			eventName: 'builder.MODAL_PUBLISH.loaded',
		});
		sendPublishModalOpenMailEvent(this.websiteId);
	},

	methods: {
		...mapMutations('gui', ['toggleSiteBeingPublished']),
		...mapMutations(['setZyroDomain']),
		...mapActionsGui({
			openModal: OPEN_MODAL,
			closeModal: CLOSE_MODAL,
		}),
		...mapActionsNotifications({
			notify: NOTIFY,
		}),
		async submit() {
			if (this.areModalActionsDisabled) {
				return;
			}

			if (this.selectedPlan === OPTION_FREE_DOMAIN) {
				EventLogApi.logEvent({
					eventName: 'builder.MODAL_PUBLISH.click_button_continue.free_domain',
				});
				this.setZyroDomain(`${this.previewDomainPlaceholder}${this.previewSubdomain}`);
				this.toggleSiteBeingPublished();
				this.closeModal();
			} else if (this.selectedPlan === OPTION_CUSTOM_DOMAIN) {
				EventLogApi.logEvent({
					eventName: 'builder.MODAL_PUBLISH.click_button_continue.custom_domain',
				});
				this.openModal({
					name: MODAL_DOMAIN_CONNECTION,
				});
			} else if (this.selectedPlan === OPTION_CLAIM_FREE_DOMAIN) {
				this.redirectToDashboard({
					path: WWW_REDIRECT_PATHS.CLAIM_FREE_DOMAIN,
					params: {
						[REDIRECT_PARAM_KEYS.SITE_ID]: this.websiteId,
						[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_DOMAIN_CONNECTED,
					},
				});
			}
		},
		handleCloseModal() {
			EventLogApi.logEvent({
				eventName: 'builder.MODAL_PUBLISH.close',
			});
			this.closeModal();
		},
	},
});
</script>

<style lang="scss" scoped>
.publish-modal {
	z-index: $z-index-popup;

	:deep() {
		.modal {
			&__content {
				display: flex;
				flex-direction: column;
				padding: 64px 48px 0;
			}

			&__footer {
				justify-content: flex-end;
				border-top: none;
			}
		}
	}

	&__title {
		text-align: center;
	}

	&__subtitle {
		margin: 8px auto 48px;
		color: $color-gray;
		text-align: center;
	}

	&__domain-input {
		margin-top: 10px;
	}

	&__message {
		display: flex;
		justify-content: center;
		padding: 8px (8px * 2);
		margin: 0 auto 0 20px;
		font-size: 12px;
		text-align: center;

		&--baloon {
			position: relative;
			width: 328px;
			margin-top: -10px;
			color: $color-light;
			background-color: $color-azure;
			border-radius: 4px;

			&::before {
				position: absolute;
				top: -5px;
				left: 157px;
				display: block;
				width: 13px;
				height: 14px;
				clip-path: polygon(47% 0, 0 42%, 100% 42%);
				content: "";
				background-color: $color-azure;
			}

			@media screen and (max-width: $media-mobile) {
				display: none;
			}
		}

		&--error {
			color: $color-primary;
		}
	}
}

.loader-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}

@media screen and (max-width: $media-mobile) {
	:deep() {
		.publish-modal {
			.modal {
				&__content {
					display: flex;
					flex-direction: column;
					padding: 56px 24px;
				}
			}

			&__message {
				padding: 8px 0 0;
				text-align: left;
			}
		}
	}
}
</style>
