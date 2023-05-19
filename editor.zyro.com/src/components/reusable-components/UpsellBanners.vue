<template>
	<UpsellBanner
		v-if="isExtendBannerFromMonthlyToYearlyShown"
		:button-text="$t('builder.upsellBannerButtonTextSaveNow')"
		theme="blue"
		@button-click="handleRedirectToExtend"
	>
		<template #title>
			{{ $t('builder.upsellBannerExtendFromMonthlyToYearlyTitle') }}
		</template>
		<template #subtitle>
			{{ $t('builder.upsellBannerExtendFromMonthlyToYearlySubtitle') }}
		</template>
	</UpsellBanner>
	<UpsellBanner
		v-else-if="isExtendBannerFromFromYearlyToFourYearsShown"
		:button-text="$t('builder.upsellBannerButtonTextSaveNow')"
		theme="blue"
		@button-click="handleRedirectToExtend"
	>
		<template #title>
			{{ $t('builder.upsellBannerExtendFromYearlyToFourYearsTitle') }}
		</template>
		<template #subtitle>
			{{ $t('builder.upsellBannerExtendFromYearlyToFourYearsSubtitle') }}
		</template>
	</UpsellBanner>
</template>

<script>
import { mapState } from 'vuex';

import UpsellBanner from '@/components/reusable-components/UpsellBanner.vue';
import {
	REDIRECT_PARAM_KEYS,
	REDIRECT_PARAM_VALUES,
	SUBSCRIPTION_STATUS_CANCELLED,
	SUBSCRIPTION_DURATION_ONE_MONTH,
	SUBSCRIPTION_DURATION_ONE_YEAR,
	WEBSITE_PLAN_GROUP_BUSINESS,
} from '@/constants';
import { useRedirects } from '@/use/useRedirects';
import { convertMsToDays } from '@/utils/date';
import EventLogApi from '@/api/EventLogApi';

import { defineComponent } from 'vue';

const DAYS_UNTIL_EXPIRATION_TO_SHOW_EXTEND_BANNER = 14;
const DAYS_AFTER_START_TO_SHOW_EXTEND_BANNER_FROM_YEARLY_TO_FOUR_YEARS = 30;

export default defineComponent({
	components: {
		UpsellBanner,
	},

	setup() {
		const { redirectToExtend } = useRedirects();

		return {
			redirectToExtend,
		};
	},

	computed: {
		...mapState('subscription', ['subscription']),
		...mapState(['websiteId']),
		isSubscriptionOfBusinessGroup() {
			return this.subscription?.group.toLowerCase() === WEBSITE_PLAN_GROUP_BUSINESS;
		},
		isSubscriptionMonthly() {
			return this.subscription?.duration === SUBSCRIPTION_DURATION_ONE_MONTH;
		},
		isSubscriptionExpired() {
			return this.subscription?.status === SUBSCRIPTION_STATUS_CANCELLED;
		},
		isSubscriptionYearly() {
			return this.subscription?.duration === SUBSCRIPTION_DURATION_ONE_YEAR;
		},
		isSubscriptionExpiringInLessThanGivenTime() {
			if (!this.subscription) {
				return false;
			}

			const msLeftUntilExpiration = new Date(this.subscription.expiration).getTime() - Date.now();

			const daysLeftUntilExpiration = convertMsToDays(msLeftUntilExpiration);

			return daysLeftUntilExpiration <= DAYS_UNTIL_EXPIRATION_TO_SHOW_EXTEND_BANNER;
		},
		hasSubscriptionStartedInMoreThanGivenTime() {
			if (!this.subscription) {
				return false;
			}

			const msPassedAfterStart = Date.now() - new Date(this.subscription.lastPayment).getTime();

			const daysPassedAfterStart = convertMsToDays(msPassedAfterStart);

			return daysPassedAfterStart >= DAYS_AFTER_START_TO_SHOW_EXTEND_BANNER_FROM_YEARLY_TO_FOUR_YEARS;
		},
		isExtendBannerFromMonthlyToYearlyShown() {
			return !this.isSubscriptionExpired && this.isSubscriptionMonthly && this.isSubscriptionExpiringInLessThanGivenTime;
		},
		isExtendBannerFromFromYearlyToFourYearsShown() {
			return !this.isSubscriptionExpired && this.isSubscriptionYearly && this.hasSubscriptionStartedInMoreThanGivenTime;
		},
	},

	mounted() {
		if (this.isExtendBannerFromMonthlyToYearlyShown) {
			EventLogApi.logEvent({
				eventName: 'builder.banners.publish',
				eventProperties: {
					subscription: 'monthly',
				},
			});
		} else if (this.isExtendBannerFromFromYearlyToFourYearsShown) {
			EventLogApi.logEvent({
				eventName: 'builder.banners.publish',
				eventProperties: {
					subscription: 'yearly',
				},
			});
		}
	},

	methods: {
		handleRedirectToExtend() {
			EventLogApi.logEvent({
				eventName: 'builder.banners.publish',
				eventProperties: {
					click: 'open-extend',
				},
			});

			this.redirectToExtend({
				[REDIRECT_PARAM_KEYS.SUBSCRIPTION_ID]: this.subscription.id,
				[REDIRECT_PARAM_KEYS.SITE_ID]: this.websiteId,
				[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_BUILDER,
			});
		},
	},
});
</script>
