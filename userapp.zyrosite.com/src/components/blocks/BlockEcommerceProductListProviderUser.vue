<template>
	<BlockEcommerceProductList
		v-bind="{
			blockId,
			blockStyle,
			textColorVars,
			isProductListShown,
			productsPerPage,
			columnCount,
			productPages,
			productIds,
			productCategoryId,
			isButtonEnabled,
			buttonDisplay,
			buttonText,
			buttonStyle,
			buttonType,
			buttonBorderWidth,
			isLoading,
			ribbonStyle
		}"
		:products="productList"
		:translations="ecommerceTranslations"
		:is-eager="lcp.type === 'block-ecommerce-product-list' && lcp.id === blockId"
		:site-id="siteId"
		:variants-quantity="variantsQuantity"
		@page-changed="handlePageChange"
		@button-click="handleButtonClick"
	/>
</template>

<script setup>
import { useStore } from 'vuex';
import {
	computed,
	ref,
	onMounted,
} from 'vue';
import { isAppPrerendering } from '@zyro-inc/site-modules/utils/prerenderingFlags';

import BlockEcommerceProductList from '@zyro-inc/site-modules/components/blocks/ecommerce/BlockEcommerceProductList.vue';
import { useBlockEcommerceProductList } from '@zyro-inc/site-modules/components/blocks/ecommerce/useBlockEcommerceProductList';
import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';
import { useEcommerce } from '@/components/ecommerce/useEcommerce';
import { PRODUCT_TYPE_BOOKING } from '@zyro-inc/site-modules/constants/ecommerce';

const props = defineProps({
	blockId: {
		type: String,
		required: true,
	},
	data: {
		type: Object,
		default: () => ({}),
	},
	lcp: {
		type: Object,
		default: () => ({}),
	},
	ecommerceTranslations: {
		type: Object,
		default: () => ({}),
	},
	currentLocale: {
		type: String,
		default: SYSTEM_LOCALE,
	},
	blocks: {
		type: Object,
		default: () => ({}),
	},
	isCartVisible: {
		type: Boolean,
		default: false,
	},
});

const {
	state,
	dispatch,
	getters,
} = useStore();

const isClientLoaded = ref(false); // needed for astro sites to not flash loader
const isLoading = computed(() => isAppPrerendering || state.ecommerce?.isLoading || !isClientLoaded.value);
const {
	openEcommerceModal,
	closeEcommerceModal,
	setProductPreviewData,
} = useEcommerceModal(props);

const stateProductPages = computed(() => getters['ecommerce/productPages']);
const isStoreTypeZyro = computed(() => getters['ecommerce/isStoreTypeZyro']);
const siteId = computed(() => getters.siteId);
const products = computed(() => state.ecommerce?.products);
const variantsQuantity = computed(() => state.ecommerce.variantsQuantity);

const { initiateCheckout } = useEcommerce(props);

onMounted(() => {
	isClientLoaded.value = true;
});

const {
	productList,
	productPages,
	blockStyle,
	textColorVars,
	columnCount,
	productsPerPage,
	productIds,
	productCategoryId,
	isButtonEnabled,
	buttonDisplay,
	buttonText,
	buttonStyle,
	buttonType,
	buttonBorderWidth,
	ribbonStyle,
} = useBlockEcommerceProductList(props, {
	productPages: stateProductPages,
	isStoreTypeZyro,
	products,
});

const isProductListShown = computed(() => {
	if (getters.meta.defaultLocale && props.currentLocale !== getters.meta.defaultLocale) {
		return false;
	}

	return !!productList.value?.length;
});

const handlePageChange = (idsToFetch) => {
	dispatch('ecommerce/getProducts', idsToFetch);
};

const handleButtonClick = async (product) => {
	if (product.options.length) {
		const itemProductPage = Object.values(productPages.value).find((page) => page.productId === product.id);
		const ecommerceBlocks = Object.keys(props.blocks).filter((key) => props.blocks[key].type === 'BlockEcommerceProduct');
		const pageProductBlockId = ecommerceBlocks.find((block) => itemProductPage.blocks.includes(block));

		setProductPreviewData(props.blocks[pageProductBlockId]);
		openEcommerceModal('EcommerceProductPreview');

		return;
	}

	const productForShoppingCart = [
		{
			...product,
			variants: [product.variants[0]],
		},
	];

	await closeEcommerceModal();

	if (product.type.value === PRODUCT_TYPE_BOOKING) {
		dispatch('ecommerce/setSelectedBookingId', product.id);
		openEcommerceModal('EcommerceBookingEventSelect');

		return;
	}

	if (props.isCartVisible) {
		dispatch('ecommerce/setShoppingCartItems', [
			...state.ecommerce.shoppingCartItems,
			...productForShoppingCart,
		]);

		if (state.ecommerce.isShoppingCartOpen) {
			return;
		}

		dispatch('ecommerce/setShoppingCartOpen', true);
	} else {
		dispatch('ecommerce/setIsCheckoutLoading', true);
		await initiateCheckout(productForShoppingCart).then(() => {
			dispatch('ecommerce/setIsCheckoutLoading', false);
		});
	}
};
</script>
