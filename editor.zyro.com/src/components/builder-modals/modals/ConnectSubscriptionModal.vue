<template>
	<ZyroModal
		max-width="915px"
		height="auto"
		class="connect-subscription-modal"
		:title="$t('builder.connectSubscriptionModalTitle')"
		:subtitle="$t('builder.connectSubscriptionModalSubtitleMessage')"
		content-padding="82px 24px 44px"
		@close-modal="closeModal"
	>
		<SubscriptionItem
			v-for="subscription in subscriptionsToShow"
			:key="subscription.id"
			:title="subscription.group"
			:renewal-date="subscription.expiration"
			:subscription-id="subscription.id"
			@subscription-connected="handleSubscriptionConnectedPostAction"
		/>
	</ZyroModal>
</template>

<script>
import ZyroModal from '@/components/global/ZyroModal.vue';

import {
	mapState,
	mapGetters,
} from 'vuex';

import SubscriptionItem from '@/components/ui/SubscriptionItem.vue';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroModal,
		SubscriptionItem,
	},

	computed: {
		...mapGetters('subscription', [
			'activeUnassignedSubscriptions',
			'activeUnassignedEcommerceSubscriptions',
			'activeUnassignedBusinessSubscriptions',
		]),
		...mapState('gui', ['activeModalSettings']),
		subscriptionsToShow() {
			if (this.activeModalSettings.shouldShowOnlyEcommerceSubscriptions) {
				return this.activeUnassignedEcommerceSubscriptions;
			}

			if (this.activeModalSettings.shouldShowOnlyBusinessSubscription) {
				return this.activeUnassignedBusinessSubscriptions;
			}

			return this.activeUnassignedSubscriptions;
		},
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		handleSubscriptionConnectedPostAction() {
			if (this.activeModalSettings.subscriptionConnectedCallback) {
				this.activeModalSettings.subscriptionConnectedCallback();
			}
		},
	},
});
</script>
<style lang="scss" scoped>
.connect-subscription-modal {
	z-index: $z-index-popup;
}
</style>
