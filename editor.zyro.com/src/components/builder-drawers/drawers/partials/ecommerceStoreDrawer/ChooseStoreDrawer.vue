<template>
	<ZyroDrawer class="ecommerce-store-drawer">
		<p class="z-h5 ecommerce-store-drawer__title">
			{{ $t('builder.addEcommerceStoreDrawer.title') }}
		</p>
		<StoreCard
			v-if="isOnlyEcwidStoreAvailable"
			:title="$t('siteSettings.advancedStorePlanName')"
			icon-name="shopping-cart"
			@button-click="handleAddPage(false)"
		>
			<template #features-list>
				<li class="ecommerce-store-drawer__list-item">
					{{ $t('builder.storeKeyPointGlobal') }}
				</li>
				<li class="ecommerce-store-drawer__list-item">
					{{ $t('builder.storeKeyPointSales') }}
				</li>
				<li class="ecommerce-store-drawer__list-item">
					{{ $t('builder.storeKeyPointOptions') }}
				</li>
				<li class="ecommerce-store-drawer__list-item">
					{{ $t('builder.storeKeyPointSell') }}
				</li>
			</template>
		</StoreCard>
		<template v-else>
			<img
				class="ecommerce-store-drawer__store-image"
				src="@/assets/images/ecommerce-store.png"
			>
			<ul class="ecommerce-store-drawer__list">
				<li class="ecommerce-store-drawer__list-item ecommerce-store-drawer__list-item--checkmark z-body-small">
					{{ $t('builder.storeKeyPointProducts') }}
				</li>
				<li class="ecommerce-store-drawer__list-item ecommerce-store-drawer__list-item--checkmark z-body-small">
					{{ $t('builder.storeKeyPointSetup') }}
				</li>
				<li class="ecommerce-store-drawer__list-item ecommerce-store-drawer__list-item--checkmark z-body-small">
					{{ $t('builder.storeKeyPointFast') }}
				</li>
				<li class="ecommerce-store-drawer__list-item ecommerce-store-drawer__list-item--checkmark z-body-small">
					{{ $t('builder.storeKeyPointSeo') }}
				</li>
			</ul>
			<div class="ecommerce-store-drawer__button">
				<ZyroButton
					data-qa="drawer-addecommerce-addecommercelitestore-btn"
					theme="primary"
					size="sm"
					@click="handleAddPage(true)"
				>
					{{ $t('builder.addStore') }}
				</ZyroButton>
			</div>
		</template>
	</ZyroDrawer>
</template>

<script>
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import {
	mapActions,
	mapState,
	mapGetters,
} from 'vuex';
import EventLogApi from '@/api/EventLogApi';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import StoreCard from '@/components/builder-drawers/drawers/partials/ecommerceStoreDrawer/StoreCard.vue';
import {
	CLOSE_DRAWER,
	mapActionsGui,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ChooseStoreDrawer',

	components: {
		ZyroDrawer,
		StoreCard,
		ZyroButton,
	},

	computed: {
		...mapState(['currentPageId']),
		...mapGetters('subscription', ['isOnlyEcwidStoreAvailable']),
	},

	methods: {
		...mapActions([
			'addStorePage',
			'addBlock',
		]),
		...mapActionsGui({
			closeDrawer: CLOSE_DRAWER,
		}),
		handleAddPage(isEcommerce) {
			this.closeDrawer();
			this.addStorePage({
				isEcommerce,
				isFromSidebar: true,
			});

			EventLogApi.logEvent({
				eventName: 'website_builder.ecomm.store_added',
				eventProperties: {
					location: 'side_menu',
				},
				isHostingerEvent: isHostingerBrand,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-store-drawer {
	padding: 24px;

	&__button {
		margin-top: 32px;
		text-align: center;
	}

	&__title {
		margin-bottom: 38px;
	}

	&__list-item {
		&::before {
			font-size: 2em;
			line-height: 0.8;
			vertical-align: middle;
			content: "· ";
		}

		&--checkmark {
			margin-bottom: 8px;

			&::before {
				margin-right: 8px;
				font-size: unset;
				line-height: unset;
				content: url("data:image/svg+xml,%3Csvg width='16' height='12' viewBox='0 0 16 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.5 1.83333L5.50002 11.8333L0.916687 7.24999L2.09169 6.07499L5.50002 9.47499L14.325 0.658325L15.5 1.83333Z' fill='black'/%3E%3C/svg%3E%0A");
			}
		}
	}

	&__store-image {
		width: 100%;
		margin-bottom: 32px;
		object-fit: cover;
	}

	&__list {
		list-style: none;
	}
}
</style>
