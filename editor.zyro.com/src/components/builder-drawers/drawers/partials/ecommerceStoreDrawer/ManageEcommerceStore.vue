<template>
	<ZyroDrawer class="manage-ecommerce-drawer">
		<div class="manage-ecommerce-drawer__content">
			<div class="manage-ecommerce-drawer__header">
				<div class="manage-ecommerce-drawer__header-title z-h5">
					{{ $t('builder.onlineStore') }}
				</div>
			</div>
			<div class="manage-ecommerce-drawer__list">
				<div class="manage-ecommerce-drawer__info">
					<div class="manage-ecommerce-drawer__title-container">
						<p class="manage-ecommerce-drawer__title z-body-small z-body-small--strong">
							{{ $t('builder.onlineStoreProductPages') }}
						</p>
						<ZyroTooltip
							position="bottom"
							toggle-event="hover"
							mode="dark"
							size="small"
							is-on-drawer
							class="manage-ecommerce-drawer__tooltip"
						>
							<template #trigger>
								<ZyroButton
									data-qa="drawer-onlinestore-storeproducts-tooltip"
								>
									<template #icon>
										<Icon
											name="help"
											dimensions="16px"
										/>
									</template>
								</ZyroButton>
							</template>
							<p class="manage-ecommerce-drawer__tooltip-text z-body-small">
								{{ $t('builder.onlineStoreTooltip') }}
							</p>
						</ZyroTooltip>
					</div>
					<ZyroButton
						v-if="!isDemoMode"
						data-qa="drawer-onlinestore-manageproducts-button"
						:title="$t('builder.ecommerceManageProducts')"
						class="manage-ecommerce-drawer__add-button"
						text-class="z-body-small z-font-weight-bold"
						@click="handleManageProductsButtonClick"
					>
						{{ $t('builder.ecommerceManageProducts') }}
					</ZyroButton>
				</div>
				<ManageEcommercePageItem
					v-for="(page, key) in sortedProductPages"
					:key="`page-${key}`"
					v-qa="'manage-ecommerce-card-page'"
					:page="page"
					@edit="redirectToEcommerceProductsEdit(page.productId)"
					@open-seo-settings="openPageSEOSettings({ pageId: key })"
					@open-settings="pageToOpenId = key"
					@open-page="updateCurrentPageId(key)"
				/>
			</div>
			<div
				class="manage-ecommerce-drawer__footer"
				:class="{ 'manage-ecommerce-drawer__footer--demo-mode': isDemoMode }"
			>
				<ZyroButton
					v-qa="'manage-ecommerce-drawer-btn-manage'"
					theme="primary"
					:color="isDemoMode ? 'plump-purple' : 'black'"
					@click="handleManageStoreClick"
				>
					{{ isDemoMode ? $t('common.chooseBuilder') : $t('builder.editStore.title') }}
				</ZyroButton>
				<p
					v-if="isDemoMode"
					class="manage-ecommerce-drawer__demo-disclaimer z-body-small"
				>
					{{ $t('builder.demoManageStore') }}
				</p>
				<ManageEcommerceSettings v-if="isStoreTypeZyro && !isDemoMode" />
			</div>
		</div>
		<PageSettingsPopup
			v-if="pageToOpenId"
			:page-id="pageToOpenId"
			@close="pageToOpenId = null"
		/>
	</ZyroDrawer>
</template>

<script>
import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDrawer from '@/components/global/ZyroDrawer.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import {
	ref,
	defineComponent,
} from 'vue';

import {
	mapState,
	mapGetters,
	mapActions,
	useStore,
} from 'vuex';
import {
	DRAWER_MANAGE_STORE,
	DRAWER_PAGE_SEO,
} from '@/constants';
import PageSettingsPopup from '@/components/builder-modals/modals/PageSettingsPopup.vue';
import ManageEcommercePageItem from '@/components/builder-drawers/drawers/partials/ecommerceStoreDrawer/ManageEcommercePageItem.vue';
import ManageEcommerceSettings from '@/components/builder-drawers/drawers/partials/ecommerceStoreDrawer/ManageEcommerceSettings.vue';
import {
	mapActionsGui,
	OPEN_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';

import { isHostingerBrand } from '@/utils/isHostingerBrand';
import EventLogApi from '@/api/EventLogApi';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		ZyroDrawer,
		ZyroTooltip,
		PageSettingsPopup,
		ManageEcommercePageItem,
		ManageEcommerceSettings,
	},

	setup() {
		const { dispatch } = useStore();
		const {
			redirectToEcommerce,
			redirectToEcommerceProductsEdit,
			redirectToEcommerceProducts,
			handleDemoRedirect,
		} = useRedirects();

		const pageToOpenId = ref(null);

		const openPageSEOSettings = ({ pageId }) => {
			dispatch('gui/OPEN_DRAWER', {
				id: DRAWER_PAGE_SEO,
				settings: {
					pageId,
					goBackCallback: () => {
						dispatch('gui/TOGGLE_DRAWER', DRAWER_MANAGE_STORE);
					},
				},
			});
		};

		return {
			pageToOpenId,
			redirectToEcommerce,
			redirectToEcommerceProductsEdit,
			redirectToEcommerceProducts,
			handleDemoRedirect,
			openPageSEOSettings,
		};
	},
	computed: {
		...mapState(['isDemoMode']),
		...mapGetters(['ecommerceLocaleProductPages']),
		...mapGetters('ecommerce', ['isStoreTypeZyro']),
		...mapGetters('subscription', ['hasActiveBusinessSubscription']),
		sortedProductPages() {
			return Object.fromEntries(
				Object.entries(this.ecommerceLocaleProductPages).sort(([, a], [, b]) => a.name.localeCompare(b.name)),
			);
		},
	},

	methods: {
		...mapActions(['updateCurrentPageId']),
		...mapActionsGui({
			openModal: OPEN_MODAL,
		}),
		async handleManageProductsButtonClick() {
			await EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_products.add',
				eventProperties: {
					location: 'side_menu',
				},
				isHostingerEvent: isHostingerBrand,
			});

			this.redirectToEcommerceProducts();
		},
		async handleManageStoreClick() {
			await EventLogApi.logEvent({
				eventName: 'website_builder.ecomm.enter',
				isHostingerEvent: isHostingerBrand,
			});

			if (this.isDemoMode) {
				this.handleDemoRedirect();

				return;
			}

			this.redirectToEcommerce();
		},
	},
});
</script>

<style lang="scss" scoped>
.manage-ecommerce-drawer {
	overflow: visible;

	&__title-container {
		display: flex;
		align-items: center;
	}

	&__tooltip {
		position: relative;
	}

	&__tooltip-text {
		max-width: 200px;
		text-align: center;
	}

	&__content {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	&__header {
		flex: 0;
		padding: 24px;
	}

	&__header-title {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__text {
		color: $color-gray;
	}

	&__list {
		flex: 1;
		width: 100%;
		padding: 0 8px;
		overflow-x: hidden;
		overflow-y: auto;
		border-bottom: 1px solid $color-gray-border;
	}

	&__add-button {
		color: $color-azure;
	}

	&__info {
		display: flex;
		justify-content: space-between;
		padding: 0 16px 16px;
	}

	&__footer {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 24px;
		margin-top: auto;

		&--demo-mode {
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
	}

	&__demo-disclaimer {
		margin-top: 8px;
		color: $color-gray;
	}
}
</style>
