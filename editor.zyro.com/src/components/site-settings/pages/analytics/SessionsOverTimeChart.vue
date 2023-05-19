<template>
	<div class="sessions-over-time-chart">
		<div
			v-if="isEmptyOverlayShown"
			class="empty-overlay"
		>
			<ZyroSvgDeprecated
				name="clock"
				class="empty-overlay__icon"
			/>
			<p class="z-body z-body--strong z-body--spaced">
				{{ $t('builder.analyticsNoDataYetTitle') }}
			</p>
			<p class="z-body-small empty-overlay__subtitle">
				{{ $t('builder.analyticsVisitorDataUpdatedDailyCheckLater') }}
			</p>
		</div>
		<AnalyticsChartCard>
			<template #title>
				<div class="sessions-over-time-chart__title z-body z-font-weight-bold">
					{{ $t('builder.analyticsSessionsOverTimeTitle') }}
				</div>
			</template>
			<template #subtitle>
				<div class="sessions-over-time-chart__subtitle z-body-small">
					{{ $t('builder.analyticsSessionsOverTimeSubtitle') }}
				</div>
			</template>

			<VueApexCharts
				type="bar"
				:options="options"
				:series="series"
				height="356"
			/>
		</AnalyticsChartCard>
	</div>
</template>

<script>
import {
	defineComponent,
	ref,
	computed,
} from 'vue';
import { useI18n } from 'vue-i18n';

import VueApexCharts from 'vue3-apexcharts';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import AnalyticsChartCard from '@/components/site-settings/pages/analytics/AnalyticsChartCard.vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		VueApexCharts,
		AnalyticsChartCard,
	},
	props: {
		totalVisitors: {
			type: Array,
			default: () => ([]),
		},
		isEmptyOverlayShown: {
			type: Boolean,
			default: true,
		},
	},
	setup(props) {
		const { t } = useI18n();

		const options = ref({
			chart: {
				id: 'sessions-over-time',
				toolbar: {
					show: false,
				},
				zoom: {
					enabled: false,
				},
			},
			colors: ['rgb(88, 59, 182)'],
			plotOptions: {
				bar: {
					borderRadius: 4,
					columnWidth: '30%',
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				type: 'datetime',
				categories: [],
				labels: {
					showDuplicates: false,
					format: 'dd MMM',
				},
				axisBorder: {
					show: false,
				},
				axisTicks: {
					show: false,
				},
				crosshairs: {
					show: false,
				},
			},
			yaxis: {
				forceNiceScale: true,
				min: 0,
			},
			states: {
				active: {
					filter: {
						type: 'none',
					},
				},
				hover: {
					filter: {
						type: 'none',
					},
				},
			},
		});

		const series = computed(() => ([
			{
				name: t('common.visitors'),
				data: props.totalVisitors,
			},
		]));

		return {
			options,
			series,
		};
	},
});
</script>

<style lang="scss" scoped>
.sessions-over-time-chart {
	position: relative;

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		margin-bottom: 24px;
		color: $color-gray;
	}
}

.empty-overlay {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background-color: white;
	border: 1px solid $color-gray-border;
	border-radius: 12px;
	opacity: 0.8;

	&__subtitle {
		margin: 0 30px;
		color: $color-gray;
		text-align: center;
	}

	&__icon {
		width: 48px;
		height: 48px;
		margin-bottom: 24px;
		color: $color-gray;
	}
}

:deep(.apexcharts-bar-area) {
	transition: fill 0.2s ease;
}

:deep(.apexcharts-series) {
	&:hover {
		.apexcharts-bar-area {
			fill: $color-primary-light;

			&:hover {
				fill: $color-primary;
			}
		}
	}
}

</style>
