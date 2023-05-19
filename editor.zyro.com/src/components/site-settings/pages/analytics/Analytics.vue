<template>
	<div class="analytics">
		<ZyroSettingsTitle>
			{{ $t('builder.analytics') }}
		</ZyroSettingsTitle>
		<EmptyStateCard v-if="!isPublishedSiteWithCustomDomain" />
		<div
			v-else-if="isLoading"
			class="analytics__loader-container"
		>
			<ZyroLoader
				color="var(--color-gray)"
				weight="2px"
				size="96px"
			/>
		</div>
		<div
			v-else
			class="analytics__cards"
		>
			<div class="analytics__date-filter-container">
				<div class="analytics__container-header">
					<p class="analytics__subtitle  z-font-weight-medium">
						{{ $t('builder.trafficOverview') }}
					</p>
					<p class="analytics__subtitle-message z-body">
						{{ $t('builder.analyticsVisitorDataUpdatedDaily') }}
					</p>
				</div>
				<ZyroDropdown
					class="analytics__date-filter-dropdown"
					:options="DATE_FILTER_DROPDOWN_OPTIONS"
					:model-value="dateFilterOption"
					@update:model-value="updateDateFilterOption($event)"
				/>
			</div>
			<div class="quick-overview analytics__card">
				<div class="quick-overview__wrapper">
					<QuickOverviewData
						:title="$t('builder.analyticsSiteSessions')"
						:trend="siteSessionsTrend"
						:count="siteSessionsCount"
					/>
					<QuickOverviewData
						:title="$t('builder.analyticsUniqueVisitors')"
						:trend="uniqueVisitorsTrend"
						:count="uniqueVisitorsCount"
					/>
				</div>
			</div>
			<SessionsOverTimeChart
				class="analytics__card"
				:is-empty-overlay-shown="!isVisitorsCountDataAvailable"
				:total-visitors="siteTotalVisitorsData"
			/>
			<ArticleCard class="analytics__card" />
			<SessionsProgressCard
				v-if="sessionsByCountryData"
				v-qa="`sessions-by-country`"
				class="analytics__card"
				:chart-input-data="sessionsByCountryData"
				:title="$t('builder.analyticsSessionsByCountry')"
				:subtitle="$t('builder.analyticsSessionsByCountrySubtitle')"
			/>
			<SessionsProgressCard
				v-if="sessionsByDeviceData"
				v-qa="`sessions-by-device`"
				class="analytics__card"
				:chart-input-data="sessionsByDeviceData"
				:title="$t('builder.analyticsSessionsByDevice')"
				:subtitle="$t('builder.analyticsSessionsByDeviceSubtitle')"
			/>
		</div>
	</div>
</template>

<script>
import {
	defineComponent,
	onMounted,
	computed,
} from 'vue';

import { useSiteTraffic } from '@/use/useSiteTraffic';
import { useI18n } from 'vue-i18n';
import SessionsProgressCard from '@/components/site-settings/pages/analytics/SessionsProgressCard.vue';
import ZyroSettingsTitle from '@/components/site-settings/components/ZyroSettingsTitle.vue';
import EmptyStateCard from '@/components/site-settings/pages/analytics/EmptyStateCard.vue';
import SessionsOverTimeChart from '@/components/site-settings/pages/analytics/SessionsOverTimeChart.vue';
import QuickOverviewData from '@/components/site-settings/pages/analytics/QuickOverviewData.vue';
import ArticleCard from '@/components/site-settings/pages/analytics/ArticleCard.vue';
import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';

export default defineComponent({
	components: {
		QuickOverviewData,
		ZyroSettingsTitle,
		EmptyStateCard,
		SessionsOverTimeChart,
		SessionsProgressCard,
		ZyroLoader,
		ZyroDropdown,
		ArticleCard,
	},
	setup() {
		const {
			fetchSiteTrafficData,
			isLoading,
			sessionsByDeviceData,
			sessionsByCountryData,
			siteTotalVisitorsData,
			isVisitorsCountDataAvailable,
			isPublishedSiteWithCustomDomain,
			uniqueVisitorsCount,
			uniqueVisitorsTrend,
			siteSessionsCount,
			siteSessionsTrend,
			daysToShow,
		} = useSiteTraffic();

		const { t } = useI18n();

		onMounted(() => fetchSiteTrafficData());

		const DATE_FILTER_DROPDOWN_OPTION_3_DAYS = {
			title: t('builder.dateFilter3DaysOption'),
			value: 3,
		};
		const DATE_FILTER_DROPDOWN_OPTION_7_DAYS = {
			title: t('builder.dateFilter7DaysOption'),
			value: 7,
		};
		const DATE_FILTER_DROPDOWN_OPTION_30_DAYS = {
			title: t('builder.dateFilter30DaysOption'),
			value: 30,
		};

		const DATE_FILTER_DROPDOWN_OPTIONS = [
			DATE_FILTER_DROPDOWN_OPTION_3_DAYS,
			DATE_FILTER_DROPDOWN_OPTION_7_DAYS,
			DATE_FILTER_DROPDOWN_OPTION_30_DAYS,
		];

		const dateFilterOption = computed(() => DATE_FILTER_DROPDOWN_OPTIONS.find(({ value }) => value === daysToShow.value));

		const updateDateFilterOption = (selectedOption) => {
			daysToShow.value = selectedOption.value;
		};

		return {
			isLoading,
			daysToShow,
			dateFilterOption,
			sessionsByDeviceData,
			sessionsByCountryData,
			uniqueVisitorsCount,
			uniqueVisitorsTrend,
			siteSessionsCount,
			siteSessionsTrend,
			siteTotalVisitorsData,
			isVisitorsCountDataAvailable,
			DATE_FILTER_DROPDOWN_OPTIONS,
			isPublishedSiteWithCustomDomain,
			updateDateFilterOption,
		};
	},
});
</script>

<style lang="scss" scoped>
.analytics {
	&__banner {
		margin-bottom: 44px;
	}

	&__container-header {
		margin-bottom: 24px;
	}

	&__subtitle {
		margin-bottom: 8px;
		font-size: 20px;
		line-height: 1.4;
	}

	&__subtitle-message {
		margin-bottom: 0;
		color: $color-gray;
	}

	&__loader-container {
		display: flex;
		justify-content: center;
		margin-top: 96px;
	}

	&__date-filter-container {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	&__date-filter-dropdown {
		z-index: 2;
		width: 100%;
		max-width: 200px;
		margin-bottom: 24px;

		:deep(.dropdown__button) {
			background: $color-light;
			border: 1px solid $color-gray-border;
			border-radius: $border-radius-medium;
		}
	}

	&__cards {
		.quick-overview {
			padding: 24px;
			background-color: $color-light;
			border: 1px solid $color-gray-border;
			border-radius: 12px;

			&__wrapper {
				display: flex;
				width: 100%;
				text-align: center;

				& > div:not(:last-child) {
					border-right: solid 1px $color-gray-border;
				}
			}
		}
	}

	&__card:not(:last-child) {
		margin-bottom: 24px;
	}
}
</style>
