<template>
	<div class="publish">
		<ZyroButton
			ref="publishButtonRef"
			v-qa="'builder-header-btn-publishsite'"
			:disabled="disabled"
			:data-popper-reference="PUBLISH_BUTTON_SELECTOR"
			class="publish__button"
			theme="header"
			:color="buttonColor"
			@click="handlePublish"
		>
			<BuilderHeaderPublishButtonContent />
		</ZyroButton>
		<Popup
			v-if="isCheckMobilePopupVisible"
			:target-ref="$refs.publishButtonRef && $refs.publishButtonRef.$el"
			placement="bottom"
			auto-update
			@click-outside="isCheckMobilePopupVisible = false"
		>
			<div class="publish__popup-content">
				<p class="publish__popup-title z-body-small z-body-small--strong">
					{{ $t('builder.publishPopupTitle') }}
				</p>
				<p class="publish__popup-subtitle z-body-small">
					{{ $t('builder.publishPopupSubtitle') }}
				</p>
				<div
					class="publish__popup-edit-mobile z-body-small z-link"
					@click="toggleMobileView"
				>
					{{ $t('builder.editMobile') }}
				</div>
				<ZyroSeparator />
				<div class="publish__popup-button-container">
					<ZyroButton
						v-qa="'builder-header-popup-btn-publishsite'"
						class="publish__popup-button"
						:disabled="disabled"
						theme="header"
						size="xxs"
						:color="buttonColor"
						@click="handlePublish"
					>
						<BuilderHeaderPublishButtonContent />
					</ZyroButton>
				</div>
			</div>
		</Popup>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
} from 'vue';
import {
	mapState,
	mapGetters,
	mapMutations,
	mapActions,
} from 'vuex';
import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';

import { useRedirects } from '@/use/useRedirects';
import { getZyrositePreviewDomain } from '@/api/PublishApi';
import { useDomainConnection } from '@/use/useDomainConnection';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { PUBLISH_BUTTON_SELECTOR } from '@/components/onboarding/onboardingSelectors';
import { COOKIE_CHECK_MOBILE_BEFORE_PUBLISH } from '@/constants/index';
import {
	getCookie,
	setCookie,
} from '@zyro-inc/site-modules/utils/cookies';
import EventLogApi from '@/api/EventLogApi';

import ZyroButton from '@/components/global/ZyroButton.vue';
import Popup from '@/components/global/Popup.vue';
import ZyroSeparator from '@/components/global/ZyroSeparator.vue';
import BuilderHeaderPublishButtonContent from '@/components/builder-view/headers/buttons/BuilderHeaderPublishButtonContent.vue';

export default defineComponent({
	components: {
		ZyroButton,
		Popup,
		ZyroSeparator,
		BuilderHeaderPublishButtonContent,
	},

	setup() {
		const { handleDemoRedirect } = useRedirects();
		const { connectCustomDomain } = useDomainConnection();
		const isCheckMobilePopupVisible = ref(false);

		return {
			isHostingerBrand,
			handleDemoRedirect,
			connectCustomDomain,
			PUBLISH_BUTTON_SELECTOR,
			isCheckMobilePopupVisible,
		};
	},

	computed: {
		...mapState([
			'zyroDomain',
			'previewDomain',
			'customDomain',
			'isDemoMode',
		]),
		...mapState('gui', [
			'isSiteBeingPublished',
			'isSiteBeingUpdated',
		]),
		...mapState('saving', ['isSaving']),
		...mapGetters(['isCurrentPageTypeBlog']),
		...mapGetters('saving', ['hasUnsavedChanges']),
		...mapGetters('subscription', ['hasExpiredSubscription']),
		...mapGetters(['websiteStatus']),
		buttonColor() {
			if (this.websiteStatus === 'SUSPENDED') {
				return 'error-red';
			}

			return 'red';
		},
		disabled() {
			return this.isSiteBeingPublished || this.isSaving || this.websiteStatus === 'SUSPENDED';
		},
		currentPageCheckMobileCookieName() {
			return `${COOKIE_CHECK_MOBILE_BEFORE_PUBLISH}-${this.$route.params.siteId}`;
		},
	},

	watch: {
		async isSiteBeingPublished() {
			if (this.isSiteBeingPublished) {
				this.updateFonts();

				await (this.isSiteBeingUpdated ? this.updateWebsite() : this.publishWebsite({
					zyroDomain: this.zyroDomain,
					previewDomain: this.previewDomain,
				}));

				if (this.isHostingerBrand && !this.isSiteBeingUpdated) {
					// Connect domain after Hostinger brand publish
					await this.connectCustomDomain(this.customDomain);
				}

				this.toggleSiteBeingPublished();

				if (this.isCurrentPageTypeBlog) {
					EventLogApi.logEvent({
						eventName: 'builder.blog.publish_post',
					});
					window.hj('identify', this.user?.id, {
						'builder.blog.publish_post': true,
					});
				}
			}
		},
	},

	methods: {
		...mapMutations('gui', [
			'toggleSiteBeingPublished',
			'toggleMobileView',
		]),
		...mapMutations([
			'setZyroDomain',
			'setPreviewDomain',
		]),
		...mapActions([
			'updateWebsite',
			'publishWebsite',
			'updateFonts',
		]),
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		...mapActions('gui', [
			'setElementEditMode',
			'openPublishModal',
			'setIsSiteBeingUpdated',
		]),
		async handlePublish() {
			if (this.isDemoMode) {
				this.handleDemoRedirect();

				return;
			}

			if (this.disabled) {
				return;
			}

			if (!getCookie(this.currentPageCheckMobileCookieName) && !this.isCheckMobilePopupVisible) {
				this.isCheckMobilePopupVisible = true;
				setCookie(this.currentPageCheckMobileCookieName, true);

				return;
			}

			if (this.isHostingerBrand) {
				if (this.zyroDomain) {
					this.handleRepublish();
				} else {
					// Hostinger brand site publish
					const {
						zyrositePreviewDomain,
						previewDomain,
					} = await getZyrositePreviewDomain({
						domain: this.customDomain,
					});

					this.setZyroDomain(zyrositePreviewDomain);
					this.setPreviewDomain(previewDomain);

					this.toggleSiteBeingPublished();
				}
			} else if (!this.zyroDomain) {
				this.openPublishModal();
			} else if (this.hasExpiredSubscription) {
				this.openModal({
					name: 'SubscriptionExpiredModal',
				});
			} else {
				this.handleRepublish();
			}

			this.isCheckMobilePopupVisible = false;
		},
		handleRepublish() {
			this.setIsSiteBeingUpdated(true);
			this.toggleSiteBeingPublished();
		},
	},
});
</script>

<style lang="scss" scoped>
.publish {
	&__button {
		flex-shrink: 0;
		height: 51px;
	}

	&__popup-content {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 280px;
		padding: 16px;
		background: $color-light;
		border: 1px solid $color-gray-light;
		border-radius: $border-radius-medium;
		box-shadow: 0 2px 14px rgba(0, 0, 0, 10%);
	}

	&__popup-title {
		margin-bottom: 8px;
	}

	&__popup-subtitle {
		margin-bottom: 8px;
		color: $color-gray;
	}

	&__popup-edit-mobile {
		margin-bottom: 16px;
	}

	&__popup-button-container {
		display: flex;
		justify-content: flex-end;
		padding-top: 16px;
	}

	&__popup-button {
		border-radius: 100px;
	}
}
</style>
