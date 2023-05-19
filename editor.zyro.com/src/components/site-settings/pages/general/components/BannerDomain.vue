<template>
	<ZyroCard class="banner">
		<div class="banner__container">
			<div class="banner__content">
				<h3 class="z-h5 z-font-weight-light banner__content-title">
					{{ $t('siteSettings.general.bannerDomain.title') }}
				</h3>
				<p class="z-body">
					{{ $t('siteSettings.general.bannerDomain.text') }}
				</p>
			</div>
			<ZyroButton
				theme="primary"
				data-qa="sitesettings-generalsettings-btn-connectdomain"
				@click="isCustomDomainPreview ? goToHPanelDomains() : openDomainConnectionModal()"
			>
				{{ $t('siteSettings.general.bannerDomain.btn') }}
			</ZyroButton>
			<ZyroSvgDeprecated
				name="decoration-blue"
				class="banner__decoration banner__decoration--bottom-middle"
			/>
			<ZyroSvgDeprecated
				name="decoration-purple"
				class="banner__decoration banner__decoration--top-right"
			/>
			<ZyroSvgDeprecated
				name="decoration-dot"
				class="banner__decoration banner__decoration--bottom-right"
			/>
		</div>
	</ZyroCard>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import EventLogApi from '@/api/EventLogApi';
import ZyroCard from '@/components/site-settings/components/ZyroCard.vue';
import { MODAL_DOMAIN_CONNECTION } from '@/constants';

import {
	GUI_NAMESPACE,
	OPEN_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';

import {
	defineComponent,
	computed,
} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
		ZyroCard,
	},
	setup() {
		const {
			state,
			getters,
			dispatch,
		} = useStore();
		const isCustomDomainPreview = computed(() => getters.isCustomDomainPreview);
		const { redirectToHPanelAddDomain } = useRedirects();

		const goToHPanelDomains = () => {
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
		};

		const openDomainConnectionModal = () => {
			dispatch(`${GUI_NAMESPACE}/${OPEN_MODAL}`, {
				name: MODAL_DOMAIN_CONNECTION,
			});
		};

		return {
			goToHPanelDomains,
			isCustomDomainPreview,
			openDomainConnectionModal,
		};
	},
});
</script>

<style lang="scss" scoped>
.banner {
	position: relative;
	z-index: 2;

	@media screen and (max-width: $media-mobile) {
		padding: 34px 16px;
	}

	&__container {
		display: flex;
		align-items: center;
		justify-content: space-between;

		@media screen and (max-width: $media-mobile) {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	&__content {
		width: 75%;
		padding-right: 10px;

		@media screen and (max-width: $media-mobile) {
			width: 100%;
			padding-right: 0;
			margin-bottom: 24px;
		}

		&-title {
			@media screen and (max-width: $media-mobile) {
				margin-bottom: 24px;
			}
		}
	}

	&__decoration {
		position: absolute;
		z-index: -1;

		&--top-right {
			top: -20px;
			right: 0;

			@media screen and (max-width: $media-mobile) {
				top: -95px;
			}
		}

		&--bottom-middle {
			right: 40%;
			bottom: -10px;
			transform: translate(50%, 0%);

			@media screen and (max-width: $media-mobile) {
				right: 25%;
			}
		}

		&--bottom-right {
			right: 32%;
			bottom: -2px;
			transform: translate(50%, 0%);
		}
	}
}

</style>
