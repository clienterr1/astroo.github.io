<template>
	<EcommerceShoppingCart
		v-qa="'user-section-zyroecommerceshoppingcart'"
		:is-shopping-cart-open="isShoppingCartOpen"
		:is-loading="isCheckoutLoading"
		:header-height="headerHeight"
		:is-header-sticky="isHeaderSticky"
		:is-nav-hidden="isNavHidden"
		:translations="ecommerceTranslations"
		:language="language"
		:site-id="siteId"
		:quantified-cart-items-list="quantifiedCartItemsList"
		:products="products"
		:shopping-cart-items="shoppingCartItems"
		:variants-quantity="variantsQuantity"
		@checkout-button-click="initCheckout"
		@close-shopping-cart="setShoppingCartOpen(false)"
		@set-shopping-cart-items="setShoppingCartItems"
	/>
</template>

<script>
import {
	mapActions,
	mapState,
	mapGetters,
} from 'vuex';

import EcommerceShoppingCart from '@zyro-inc/site-modules/components/ecommerce/EcommerceShoppingCart.vue';
import { getIsInIframe } from '@zyro-inc/site-modules/utils/getIsInIframe';
import { isAppPrerendering } from '@zyro-inc/site-modules/utils/prerenderingFlags';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';
import { useEcommerce } from '@/components/ecommerce/useEcommerce';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		EcommerceShoppingCart,
	},

	props: {
		headerHeight: {
			type: Number,
			default: 0,
		},
		ecommerceTranslations: {
			type: Object,
			default: () => ({}),
		},
		language: {
			type: String,
			default: 'en',
		},
		currentPageEcommerceBlocks: {
			type: Array,
			default: () => ([]),
		},
		currentPageEcommerceComponents: {
			type: Array,
			default: () => ([]),
		},
		isHeaderSticky: {
			type: Boolean,
			default: false,
		},
		isNavHidden: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const { openEcommerceModal } = useEcommerceModal(props);
		const { initiateCheckout } = useEcommerce(props);

		return {
			openEcommerceModal,
			initiateCheckout,
		};
	},

	computed: {
		...mapState('ecommerce', [
			'products',
			'isShoppingCartOpen',
			'isCheckoutLoading',
			'shoppingCartItems',
			'variantsQuantity',
		]),
		...mapGetters(['siteId']),
		...mapGetters('ecommerce', ['quantifiedCartItemsList']),
		currentPageEcommerceElements() {
			return [
				...this.currentPageEcommerceBlocks,
				...this.currentPageEcommerceComponents,
			];
		},
		productIds() {
			const list = this.currentPageEcommerceElements.reduce((accumulator, block) => {
				let result = [];
				const params = new URLSearchParams(window.location.search);
				const page = Number.parseInt(params.get('store-page'), 10) || 1;

				switch (block.type) {
				case 'BlockEcommerceProductList':
					result = [
						...result,
						...block.productIds.slice(0, block.productsPerPage * page),
					];
					break;
				case 'BlockEcommerceProduct':
					result = [
						...result,
						block.product?.id,
					];
					break;
				case 'GridEcommerceButton':
					result = [
						...result,
						block.settings?.productId,
					];
					break;
				default:
					break;
				}

				return [
					...accumulator,
					...result,
				];
			}, []);

			const nonEmptyList = list.filter((item) => item !== -1);

			return [...new Set(nonEmptyList)];
		},
	},

	watch: {
		currentPageEcommerceElements: {
			async handler(newValue, oldValue) {
				if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
					await this.loadProducts();
				}
			},
		},
	},

	mounted() {
		this.loadProducts();
	},

	methods: {
		...mapActions('ecommerce', [
			'getProducts',
			'setShoppingCartOpen',
			'setShoppingCartItems',
			'setIsCheckoutLoading',
		]),
		async loadProducts() {
			if (!isAppPrerendering) {
				await this.getProducts(this.productIds);
			}
		},
		async initCheckout() {
			if (getIsInIframe()) {
				this.openEcommerceModal('EcommerceMessageButtonDisabled');

				return;
			}

			if (this.isCheckoutLoading) {
				return;
			}

			this.setIsCheckoutLoading(true);

			await this.initiateCheckout(this.shoppingCartItems).then(() => {
				this.setShoppingCartOpen(false);
				this.setIsCheckoutLoading(false);
			});
		},
	},
});
</script>
