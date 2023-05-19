<template>
	<div class="subscription-item">
		<div>
			<h3 class="subscription-item__title z-title">
				{{ titleToShow }}
			</h3>
			<p class="subscription-item__subtitle z-body-small">
				{{ $t('builder.connectSubscriptionModalRenewalDate') }} {{ getFormattedLocalizedDate(renewalDate) }}
			</p>
		</div>
		<ZyroButton
			theme="primary"
			class="subscription-item__button"
			data-qa="subscriptionitem-btn-assign-website"
			@click="connectSubscription"
		>
			<ZyroLoader
				v-if="isLoading"
				color="var(--color-light)"
				size="20px"
				weight="3px"
			/>
			<span v-else>{{ $t('builder.connectSubscriptionModalAssignToWebsite') }}</span>
		</ZyroButton>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import { captureException } from '@sentry/browser';
import {
	mapState,
	mapActions,
} from 'vuex';

import ZyroLoader from '@zyro-inc/site-modules/components/ZyroLoader.vue';

import { connectSiteToSubscription } from '@/api/BillingApi';
import { SUBSCRIPTION_NAMES } from '@/constants';
import { useNotifications } from '@/use/useNotifications';
import { getFormattedLocalizedDate } from '@/utils/date';

import { defineComponent } from 'vue';

export default defineComponent({

	components: {
		ZyroButton,
		ZyroLoader,
	},

	props: {
		title: {
			type: String,
			required: true,
		},
		renewalDate: {
			type: String,
			required: true,
		},
		subscriptionId: {
			type: String,
			required: true,
		},
	},
	emits: ['subscription-connected'],

	setup() {
		const { notify } = useNotifications();

		return {
			notify,
		};
	},

	data() {
		return {
			isLoading: false,
		};
	},

	computed: {
		...mapState(['websiteId']),
		titleToShow() {
			return this.$t(SUBSCRIPTION_NAMES[this.title.toLowerCase()]) || this.title;
		},
	},

	methods: {
		...mapActions('subscription', ['getSubscription']),
		...mapActions('gui', ['openPublishModal']),
		getFormattedLocalizedDate,
		async connectSubscription() {
			this.isLoading = true;

			try {
				await connectSiteToSubscription({
					siteId: this.websiteId,
					subscriptionId: this.subscriptionId,
				});
				await this.getSubscription();

				this.$emit('subscription-connected');
			} catch (error) {
				this.notify({
					messageI18nKeyPath: 'builder.errorWhileConnectingSubscription',
					origin: 'SubscriptionItem.vue',
				});

				captureException(error);
			}

			this.isLoading = false;
		},
	},
});
</script>

<style lang="scss" scoped>
.subscription-item {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	padding: 32px;
	border: 1px solid $color-gray-border;

	&:not(:last-child) {
		margin-bottom: 16px;
	}

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		color: $color-gray;
	}

	&__button {
		align-self: center;
	}
}
</style>
