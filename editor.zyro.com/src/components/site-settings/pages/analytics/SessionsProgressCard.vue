<template>
	<AnalyticsChartCard class="sessions-progress-card">
		<template #title>
			<div class="sessions-progress-card__title z-body z-font-weight-bold">
				{{ title }}
			</div>
		</template>
		<template #subtitle>
			<div class="sessions-progress-card__subtitle z-body-small">
				{{ subtitle }}
			</div>
		</template>
		<ul class="progress-chart">
			<li
				v-for="(data, key) in chartInputData"
				:key="key"
				class="progress-chart__item"
			>
				<div class="progress-chart__item-details">
					<p class="z-body-small progress-chart__item-title">
						{{ key }}
					</p>
					<div class="progress-chart__item-number-details">
						<div
							v-if="data.periodPercentageChange && data.periodPercentageChange !== 0"
							class="z-body-small progress-chart__item-percentage-change"
							:class="`${data.periodPercentageChange > 0 ? 'green' : 'red'}`"
						>
							<ZyroSvgDeprecated
								name="arrow-down"
								:direction="data.periodPercentageChange < 0 ? 'up' : 'down'"
							/>
							{{ data.periodPercentageChange }}%
						</div>
						<div
							v-if="!!data.periodPercentageChange"
							class="progress-chart__vertical-separator"
						/>
						<div class="z-body-small z-body-small--strong progress-chart__item-visit-count">
							{{ data.periodVisitorCount }}
						</div>
					</div>
				</div>
				<ZyroProgressBar
					class="progress-chart__item-progress-bar"
					:percentage="data.totalVisitorPercentagePart"
				/>
			</li>
		</ul>
	</AnalyticsChartCard>
</template>
<script>
import { defineComponent } from 'vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroProgressBar from '@/components/reusable-components/ZyroProgressBar.vue';
import AnalyticsChartCard from '@/components/site-settings/pages/analytics/AnalyticsChartCard.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroProgressBar,
		AnalyticsChartCard,
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		chartInputData: {
			type: Object,
			required: true,
		},
	},
});
</script>
<style lang="scss" scoped>
.sessions-progress-card {
	position: relative;

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		margin-bottom: 24px;
		color: $color-gray;
	}
}

.progress-chart {
	list-style: none;

	&__item {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 24px;
	}

	&__item-details {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		margin-bottom: 8px;
		text-transform: capitalize;
	}

	&__item-title {
		text-transform: capitalize;
	}

	&__item-number-details {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	&__vertical-separator {
		width: 1px;
		height: 12px;
		margin: 0 8px;
		background-color: $color-gray-border;
	}

	&__item-visit-count {
		min-width: 30px;
		text-align: end;
	}

	&__item-progress-bar {
		height: 8px;

		&::before {
			background: $color-primary;
		}
	}

	&__item-percentage-change {
		display: flex;
		gap: 4px;
		align-items: center;

		&.green {
			color: $color-success;
		}

		&.red {
			color: $color-danger-dark;
		}
	}
}
</style>
