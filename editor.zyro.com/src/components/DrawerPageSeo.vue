<template>
	<PageDrawerLayout
		class="page-drawer-seo"
		:page-id="pageId"
	>
		<template #header>
			<h1 class="page-drawer-seo__title">
				{{ $t('builder.pageSettingsSeoDrawerTitle') }}
			</h1>
			<p class="page-drawer-seo__description">
				{{ $t('builder.pageSettingsSeoDrawerDescription') }}
			</p>
			<ZyroProgressBar
				:percentage="completionPercentage"
				is-with-text
			/>
		</template>

		<template #content>
			<SeoSetupCard
				class="page-drawer-seo__seo-setup-card"
				@redo-seo-setup="restartOnboarding"
			/>

			<StyledCollapsible
				class="page-drawer-seo__collapsible"
				:class="{ 'page-drawer-seo__collapsible--completed': isGeneralPageSeoSetupCompleted }"
				:is-open="isGeneralSettingsCollapsibleOpen"
				has-top-border
				:icon="isGeneralPageSeoSetupCompleted ? 'checkmark' : 'exclamation'"
				@toggle="isGeneralSettingsCollapsibleOpen = !isGeneralSettingsCollapsibleOpen"
			>
				<template #title>
					{{ $t('builder.pageSettingsSeoDrawerGeneralCollapsibleTitle') }}
				</template>

				<PageSettingsSeoGeneral :page-id="pageId" />
			</StyledCollapsible>

			<StyledCollapsible
				class="page-drawer-seo__collapsible"
				:class="{ 'page-drawer-seo__collapsible--completed': isHeadingTagsSetupCompleted }"
				:is-open="isHeadingTagsCollapsibleOpen"
				has-top-border
				has-bottom-border
				:icon="isHeadingTagsSetupCompleted ? 'checkmark' : 'exclamation'"
				@toggle="isHeadingTagsCollapsibleOpen = !isHeadingTagsCollapsibleOpen"
			>
				<template #title>
					{{ $t('builder.pageSettingsSeoDrawerHeadingsCollapsibleTitle') }}
				</template>

				<PageSettingsSeoHeadings :page-id="pageId" />
			</StyledCollapsible>
		</template>
	</PageDrawerLayout>
	<SeoOnboardingModal
		v-if="isOnboardingStarted"
		:page-id="pageId"
		@close="endOnboarding"
	/>
</template>

<script>
import StyledCollapsible from '@/components/ui/StyledCollapsible.vue';
import PageSettingsSeoGeneral from '@/components/PageSettingsSeoGeneral.vue';
import PageSettingsSeoHeadings from '@/components/PageSettingsSeoHeadings.vue';
import PageDrawerLayout from '@/components/PageDrawerLayout.vue';
import {
	defineComponent,
	ref,
	computed,
	onMounted,
} from 'vue';
import ZyroProgressBar from '@/components/reusable-components/ZyroProgressBar.vue';
import SeoSetupCard from '@/components/SeoSetupCard.vue';
import SeoOnboardingModal from '@/components/builder-modals/modals/SeoOnboardingModal.vue';
import { useStore } from 'vuex';
import { useSeoStepOnboarding } from '@/use/useSeoStepOnboarding';
import { usePageSettingsSeo } from '@/use/usePageSettingsSeo';

export default defineComponent({
	components: {
		PageDrawerLayout,
		SeoSetupCard,
		ZyroProgressBar,
		PageSettingsSeoGeneral,
		PageSettingsSeoHeadings,
		StyledCollapsible,
		SeoOnboardingModal,
	},

	setup() {
		const { state } = useStore();

		const { pageId } = state.gui.activeDrawerSettings;

		const {
			isGeneralPageSeoSetupCompleted,
			isHeadingTagsSetupCompleted,
			pageMetaTitle,
			pageMetaDescription,
		} = usePageSettingsSeo({
			pageId,
		});
		const {
			isOnboardingStarted,
			startOnboarding,
			endOnboarding,
			restartOnboarding,
		} = useSeoStepOnboarding();

		const isGeneralSettingsCollapsibleOpen = ref(!isGeneralPageSeoSetupCompleted.value);
		const isHeadingTagsCollapsibleOpen = ref(!isHeadingTagsSetupCompleted.value);

		const completionStatuses = computed(() => [
			isGeneralPageSeoSetupCompleted.value,
			isHeadingTagsSetupCompleted.value,
		]);
		const positiveCompletionStatuses = computed(() => completionStatuses.value.filter((status) => status));
		const completionPercentage = computed(() => (positiveCompletionStatuses.value.length / completionStatuses.value.length) * 100);
		const areMetaTitleAndDescriptionFilled = computed(() => pageMetaTitle.value && pageMetaDescription.value);

		onMounted(() => {
			if (!areMetaTitleAndDescriptionFilled.value) {
				startOnboarding();
			}
		});

		return {
			isOnboardingStarted,
			endOnboarding,
			restartOnboarding,
			pageId,
			isGeneralSettingsCollapsibleOpen,
			isHeadingTagsCollapsibleOpen,
			isHeadingTagsSetupCompleted,
			isGeneralPageSeoSetupCompleted,
			completionPercentage,
		};
	},
});
</script>
<style lang="scss" scoped>
.page-drawer-seo {
	&__seo-setup-card {
		padding: 24px;
	}

	&__title {
		margin-bottom: 8px;
		font-size: 24px;
		font-weight: 700;
		line-height: 1.33;
	}

	&__description {
		margin-bottom: 16px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1.71;
		color: $color-gray;
	}

	&__collapsible {
		:deep(.drawer-collapsible__icon) {
			color: $color-warning-dark;
		}

		&--completed {
			:deep(.drawer-collapsible__icon) {
				color: $color-success;
			}
		}

		&:last-child {
			margin-bottom: 48px;
		}
	}
}
</style>
