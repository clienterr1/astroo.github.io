<template>
	<!-- This modal's code was reused in UpgradePlanEcommerce.vue -->
	<ZyroModal
		max-width="458px"
		max-height="auto"
		height="auto"
		width="auto"
		@close-modal="handleModalClose"
	>
		<Component
			:is="componentType"
			ref="modalContentRef"
			data-qa-type="builder-storemanager-modal"
			@button-click="handleBtnClick"
		/>
	</ZyroModal>
</template>

<script>
import ZyroModal from '@/components/global/ZyroModal.vue';

import {
	mapGetters,
	mapState,
} from 'vuex';

import ActiveSubscriptionModal from '@/components/builder-modals/modals/-partials/edit-online-store/ActiveSubscriptionModal.vue';
import BusinessSubscriptionModal from '@/components/builder-modals/modals/-partials/edit-online-store/BusinessSubscriptionModal.vue';
import DefaultModal from '@/components/builder-modals/modals/-partials/edit-online-store/DefaultModal.vue';
import {
	REDIRECT_PARAM_KEYS,
	REDIRECT_PARAM_VALUES,
} from '@/constants';
import { STORE_MANAGER_ROUTE } from '@/constants/routes';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroModal,
		DefaultModal,
		BusinessSubscriptionModal,
		ActiveSubscriptionModal,
	},

	setup() {
		const {
			redirectToWWWPayments,
			redirectToUpgrade,
		} = useRedirects();

		return {
			redirectToWWWPayments,
			redirectToUpgrade,
		};
	},

	computed: {
		...mapState('user', ['user']),
		...mapGetters('subscription', [
			'hasActiveEcommerceSubscription',
			'hasActiveBusinessSubscription',
			'hasBusinessSubscription',
			'hasActiveSubscription',
			'subscriptionId',
		]),
		componentType() {
			if (this.hasActiveSubscription && !this.hasActiveBusinessSubscription && !this.hasActiveEcommerceSubscription) {
				return 'ActiveSubscriptionModal';
			}

			if (this.hasActiveBusinessSubscription) {
				return 'BusinessSubscriptionModal';
			}

			return 'DefaultModal';
		},
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		handleModalClose() {
			this.$refs.modalContentRef.handleCloseModal();
			this.closeModal();
		},
		async handleBtnClick() {
			if (this.hasActiveEcommerceSubscription) {
				this.$router.push({
					name: STORE_MANAGER_ROUTE,
				});
				this.closeModal();
				// `!hasBusinnessSubscription` check is temporary until this subscription is upgradeable.
				// Now, it is not - so we can't push to upgrade it.
			} else if (this.hasActiveSubscription && !this.hasBusinessSubscription) {
				this.redirectToUpgrade({
					[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_STOREFRONT,
					[REDIRECT_PARAM_KEYS.SUBSCRIPTION_ID]: this.subscriptionId,
					[REDIRECT_PARAM_KEYS.PLANS_TO_SHOW]: REDIRECT_PARAM_VALUES.PLANS_TO_SHOW_ECOMMERCE,
				});
			} else {
				this.redirectToWWWPayments({
					[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_STOREFRONT,
				});
			}
		},
	},
});
</script>
