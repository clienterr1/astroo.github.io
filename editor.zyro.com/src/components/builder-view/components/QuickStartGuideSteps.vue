<template>
	<div
		ref="trigger"
		class="start-guide-steps"
		data-qa="start-guide-steps"
	>
		<div class="start-guide-steps__header">
			<h5 class="z-h5 start-guide-steps__title">
				{{ $t('builder.quickStartGuide') }}
			</h5>
			<p class="z-body-small start-guide-steps__progress">
				{{
					$t(
						'builder.quickStartGuideStepsCompletedText',
						[completedQuickStartGuideSteps.length, availableQuickStartGuideSteps.length]
					)
				}}
			</p>
		</div>
		<div class="start-guide-steps__body-container">
			<div
				class="start-guide-steps__step-list"
			>
				<QuickStartGuideItem
					v-for="(step, index) in availableQuickStartGuideSteps"
					:key="step.id"
					tabindex="0"
					class="start-guide-steps__step-item"
					:class="{ 'start-guide-steps__step-item--disabled': step.isDisabled }"
					:is-completed="step.isCompleted"
					:data-qa="`quick-start-guide-step-${index}-${step.id}`"
					:is-active="step.id === activeStepId"
					@keypress.enter="handleQuickStartGuideItemClick({
						stepId: step.id,
						isDisabled: step.isDisabled
					})"
					@click="!step.isDisabled && selectStep(step.id)"
				>
					{{ `${index + 1}. ${step.title}` }}
				</QuickStartGuideItem>
			</div>
			<div
				v-if="isQuickStartGuideCompleted"
				class="start-guide-steps__details details-completed"
			>
				<div class="details-completed__icon-container">
					<ZyroSvgDeprecated
						name="check-circle"
						class="details-completed__icon"
					/>
				</div>
				<p class="z-body z-body--strong details-completed__title">
					{{ $t('builder.quickStartGuideCompletedTitle') }}
				</p>
				<p class="z-body-small details-completed__subtitle">
					{{ $t('builder.quickStartGuideCompletedSubtitle') }}
				</p>
			</div>
			<QuickStartGuideItemDetails
				v-else-if="activeStepId === QUICK_START_GUIDE_LOGO_STEP"
				:id="QUICK_START_GUIDE_LOGO_STEP"
				class="start-guide-steps__details"
				:learn-more-link="logoLearnMoreLink"
				:button-text="$t('builder.editBlockButton.changeLogo')"
				@start-step-action="logoButtonAction"
			>
				<template #title>
					{{ $t('builder.editBlockButton.changeLogo') }}
				</template>
				<template #description>
					<i18n-t
						tag="span"
						keypath="builder.quickStartGuideAddLogoDescription"
					>
						<a
							class="z-link"
							:href="logoMakerLink"
							target="_blank"
							v-text="$t('builder.freeLogoMaker')"
						/>
					</i18n-t>
				</template>
			</QuickStartGuideItemDetails>
			<QuickStartGuideItemDetails
				v-else-if="activeStepId === QUICK_START_GUIDE_SEO_STEP"
				:id="QUICK_START_GUIDE_SEO_STEP"
				class="start-guide-steps__details"
				:learn-more-link="seoSettingsLearnMoreLink"
				:button-text="$t('builder.manageSeo')"
				@start-step-action="seoButtonAction"
			>
				<template #title>
					{{ $t('builder.helpResources.optimizeWebsiteForSearch') }}
				</template>
				<template #description>
					{{ $t('builder.helpResources.optimizeWebsiteForSearchInfo') }}
				</template>
			</QuickStartGuideItemDetails>
			<QuickStartGuideItemDetails
				v-else-if="activeStepId === QUICK_START_GUIDE_PUBLISH_STEP"
				:id="QUICK_START_GUIDE_PUBLISH_STEP"
				class="start-guide-steps__details"
				:button-text="$t('builder.header.publishWebsite')"
				:is-button-disabled="isSiteBeingPublished"
				@start-step-action="publishButtonAction"
			>
				<template #title>
					{{ $t('builder.publishYourWebsite') }}
				</template>
				<template #description>
					{{ $t('builder.quickStartGuidePublishDescription') }}
				</template>
			</QuickStartGuideItemDetails>
			<QuickStartGuideItemDetails
				v-else-if="activeStepId === QUICK_START_GUIDE_DOMAIN_STEP"
				:id="QUICK_START_GUIDE_DOMAIN_STEP"
				class="start-guide-steps__details"
				learn-more-link="https://support.zyro.com/en/articles/4237563-how-to-connect-a-domain-to-your-website"
				:button-text="$t('builder.publishedModalRoot.premium.btn')"
				@start-step-action="domainButtonAction"
			>
				<template #title>
					{{ $t('builder.publishModal.label') }}
				</template>
				<template #description>
					{{ $t('builder.helpResources.connectCustomDomainInfo') }}
				</template>
			</QuickStartGuideItemDetails>
		</div>
		<Teleport
			v-if="isAssetManagerVisible"
			to="body"
		>
			<AssetManager
				:visible-categories="[ASSETS_CATEGORY_IMAGE]"
				@select-image="updateLogo($event), isAssetManagerVisible = false"
				@close="isAssetManagerVisible = false"
			/>
		</Teleport>
	</div>
</template>
<script>
import EventLogApi from '@/api/EventLogApi';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import QuickStartGuideItem from '@/components/builder-view/components/QuickStartGuideItem.vue';
import QuickStartGuideItemDetails from '@/components/builder-view/components/QuickStartGuideItemDetails.vue';
import AssetManager from '@/components/builder-modals/modals/AssetManager.vue';

import {
	mapState,
	mapGetters,
	mapActions,
	mapMutations,
} from 'vuex';
import { SEO_SETTINGS_ROUTE } from '@/constants/routes';
import {
	QUICK_START_GUIDE_LOGO_STEP,
	QUICK_START_GUIDE_SEO_STEP,
	QUICK_START_GUIDE_INTEGRATIONS_STEP,
	QUICK_START_GUIDE_PUBLISH_STEP,
	QUICK_START_GUIDE_DOMAIN_STEP,
	QUICK_START_GUIDE_EVENT_NAMES,
	MODAL_DOMAIN_CONNECTION,
	ASSETS_CATEGORY_IMAGE,
} from '@/constants';

import {
	defineComponent,
	ref,
} from 'vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';
import { getLogoMakerUrl } from '@zyro-inc/site-modules/utils/getLogoMakerUrl';
import { getZyrositePreviewDomain } from '@/api/PublishApi';
import { useUpdateLogo } from '@/components/builder-controls/edit-block-navigation/useUpdateLogo';
import { useQuickStartGuide } from '@/use/useQuickStartGuide';

export default defineComponent({

	components: {
		ZyroSvgDeprecated,
		QuickStartGuideItem,
		QuickStartGuideItemDetails,
		AssetManager,
	},
	emits: ['close'],
	setup() {
		const { updateLogo } = useUpdateLogo();
		const {
			completeQuickStartGuideStep,
			availableQuickStartGuideSteps,
			completedQuickStartGuideSteps,
			isQuickStartGuideCompleted,
			hasChangedLogo,
			activeStepId,
			selectStep,
		} = useQuickStartGuide();

		const isAssetManagerVisible = ref(false);

		return {
			selectStep,
			activeStepId,
			availableQuickStartGuideSteps,
			completedQuickStartGuideSteps,
			isQuickStartGuideCompleted,
			completeQuickStartGuideStep,
			updateLogo,
			hasChangedLogo,
			ASSETS_CATEGORY_IMAGE,
			QUICK_START_GUIDE_LOGO_STEP,
			QUICK_START_GUIDE_SEO_STEP,
			QUICK_START_GUIDE_INTEGRATIONS_STEP,
			QUICK_START_GUIDE_PUBLISH_STEP,
			QUICK_START_GUIDE_DOMAIN_STEP,
			isHostingerBrand,
			isAssetManagerVisible,
		};
	},
	computed: {
		...mapState([
			'zyroDomain',
			'customDomain',
			'currentBlockId',
		]),
		...mapGetters(['builderCompletedSteps']),
		...mapState('gui', ['isSiteBeingPublished']),
		isSitePublished() {
			return !!this.builderCompletedSteps?.hasPublishedWebsite || !!this.zyroDomain;
		},
		logoMakerLink() {
			return getLogoMakerUrl({
				ref: 'quick-start-guide',
			});
		},
		logoLearnMoreLink() {
			return this.isHostingerBrand
				? 'https://support.hostinger.com/en/articles/6435805-website-builder-how-to-add-or-change-the-logo'
				: 'https://support.zyro.com/en/articles/4992721-how-to-add-or-replace-the-logo';
		},
		seoSettingsLearnMoreLink() {
			return this.isHostingerBrand
				? 'https://support.hostinger.com/en/articles/6466320-website-builder-seo-settings'
				: 'https://support.zyro.com/en/articles/4393902-seo-settings';
		},
	},
	methods: {
		...mapMutations('gui', ['toggleSiteBeingPublished']),
		...mapMutations([
			'setZyroDomain',
			'setPreviewDomain',
		]),
		...mapActions(['leaveElementEditMode']),
		...mapActions('gui', [
			'openPublishModal',
			'OPEN_MODAL',
		]),
		handleQuickStartGuideItemClick({
			stepId,
			isDisabled,
		}) {
			if (!isDisabled) {
				this.selectStep(stepId);
			}
		},
		logoButtonAction() {
			this.leaveElementEditMode();

			this.isAssetManagerVisible = true;

			EventLogApi.logEvent({
				eventName: QUICK_START_GUIDE_EVENT_NAMES.ENTER_CHANGE_LOGO,
				isHostingerEvent: true,
			});
		},
		seoButtonAction() {
			this.$router.push({
				name: SEO_SETTINGS_ROUTE,
			});
			this.$emit('close');

			EventLogApi.logEvent({
				eventName: QUICK_START_GUIDE_EVENT_NAMES.ENTER_GET_FOUND,
				isHostingerEvent: true,
			});
		},
		async publishButtonAction() {
			if (this.isSiteBeingPublished) return;

			if (this.isHostingerBrand) {
				const {
					zyrositePreviewDomain,
					previewDomain,
				} = await getZyrositePreviewDomain({
					domain: this.customDomain,
				});

				this.setZyroDomain(zyrositePreviewDomain);
				this.setPreviewDomain(previewDomain);

				this.toggleSiteBeingPublished();

				this.completeQuickStartGuideStep({
					completedStepKey: 'hasPublishedWebsite',
					eventProperties: {
						stepName: QUICK_START_GUIDE_PUBLISH_STEP,
					},
				});
			} else {
				this.openPublishModal();
				this.$emit('close');
			}

			EventLogApi.logEvent({
				eventName: QUICK_START_GUIDE_EVENT_NAMES.ENTER_PUBLISH_WEBSITE,
				isHostingerEvent: true,
			});
		},
		domainButtonAction() {
			if (!this.isSitePublished) {
				this.openPublishModal();
			} else {
				this.OPEN_MODAL({
					name: MODAL_DOMAIN_CONNECTION,
				});
			}

			this.$emit('close');
		},
	},
});
</script>
<style lang="scss" scoped>
.start-guide-steps {
	width: 608px;
	height: 310px;

	&__header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
	}

	&__title {
		font-size: 20px;
	}

	&__progress {
		color: $color-gray;
	}

	&__body-container {
		display: grid;
		grid-template-columns: 300px 1fr;
		gap: 5px;
		width: 100%;
		height: 260px;
		overflow: hidden;
	}

	&__step-list {
		display: flex;
		flex-direction: column;
		grid-column: 1;
		height: 100%;
		padding-right: 12px;
		overflow-y: scroll;
	}

	&__step-item {
		&--disabled {
			cursor: not-allowed;
		}

		&:not(:last-child) {
			margin-bottom: 8px;
		}
	}

	&__details {
		position: relative;
		display: flex;
		flex-direction: column;
		grid-column: 2;
		width: 100%;
		height: 100%;
		padding: 16px;
		background: $color-gray-light;
		border-radius: 8px;
	}
}

.details-completed {
	display: flex;
	align-items: center;
	justify-content: center;

	&__title {
		margin-bottom: 8px;
		font-size: 12px;
		text-transform: uppercase;
	}

	&__subtitle {
		color: $color-gray;
	}

	&__icon-container {
		display: flex;
		padding: 12px;
		margin-bottom: 12px;
		background: $color-primary;
		border-radius: 50%;
	}

	&__icon {
		color: $color-light;
	}
}
</style>
