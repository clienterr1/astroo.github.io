<template>
	<ZyroDrawer class="ecommerce-store-drawer">
		<p class="z-h5 ecommerce-store-drawer__title">
			{{ $t('siteSettings.advancedStorePlanName') }}
		</p>
		<div class="ecommerce-store-drawer__content">
			<img
				class="ecommerce-store-drawer__store-image"
				src="@/assets/images/store-manageStore.png"
			>
			<ul class="ecommerce-store-drawer__capability-list">
				<li
					v-for="(capability, index) in managerCapabilities"
					:key="`${capability}${index}`"
					class="ecommerce-store-drawer__capability"
				>
					<span>
						{{ capability }}
					</span>
				</li>
			</ul>
			<ZyroButton
				v-qa="'builder-drawer-btn-storemanager'"
				class="ecommerce-store-drawer__button"
				theme="primary"
				@click="handleManageOpenStoreManager"
			>
				{{ $t('builder.manageEcommerceStoreDrawer.button') }}
			</ZyroButton>
		</div>
	</ZyroDrawer>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';

import {
	mapActions,
	mapGetters,
} from 'vuex';

import { STORE_MANAGER_ROUTE } from '@/constants/routes';
import { MODAL_EDIT_ONLINE_STORE } from '@/constants';
import {
	mapActionsGui,
	OPEN_MODAL,
	CLOSE_MODAL,
	CLOSE_DRAWER,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroDrawer,
	},

	computed: {
		...mapGetters('subscription', [
			'hasActiveEcommerceSubscription',
			'hasActiveUnleashedSubscription',
			'hasExpiredOrActiveUnassignedEcommerceSubscription',
			'hasActiveSubscription',
		]),
		managerCapabilities() {
			return [
				this.$t('builder.onlineStoreSellUpTo', [2500]),
				this.$t('builder.onlineStoreAdvancedShipping'),
				this.$t('builder.onlineStorePaymentMethods'),
			];
		},
	},

	methods: {
		...mapActions('subscription', ['handleExpiredOrActiveUnassignedSubscription']),
		...mapActionsGui({
			closeDrawer: CLOSE_DRAWER,
			closeModal: CLOSE_MODAL,
			openModal: OPEN_MODAL,
		}),
		handleManageOpenStoreManager() {
			this.closeDrawer();

			if (this.hasActiveEcommerceSubscription) {
				this.$router.push({
					name: STORE_MANAGER_ROUTE,
				});
			} else if (this.hasExpiredOrActiveUnassignedEcommerceSubscription && !this.hasActiveSubscription) {
				this.handleExpiredOrActiveUnassignedSubscription({
					subscriptionConnectedCallback: () => {
						this.closeModal();
						this.$router.push({
							name: STORE_MANAGER_ROUTE,
						});
					},
					shouldShowOnlyEcommerceSubscriptions: true,
				});
			} else if (!this.hasActiveEcommerceSubscription) {
				this.openModal({
					name: MODAL_EDIT_ONLINE_STORE,
				});
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-store-drawer {
	padding: 24px;
	overflow: hidden;

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 64px 58px;
	}

	&__store-image {
		width: 250px;
		height: 170px;
		margin-bottom: 32px;
		object-fit: cover;
	}

	&__page-title {
		margin-bottom: 64px;
	}

	&__page-subtitle {
		margin-bottom: 24px;
	}

	&__button {
		min-width: 220px;
		margin-top: 32px;
	}

	&__capability-list {
		list-style-type: none;
	}

	&__capability {
		&::before {
			font-size: 2em;
			line-height: 0.8;
			vertical-align: middle;
			content: "· ";
		}
	}
}
</style>
