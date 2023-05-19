<template>
	<BlockEcommerceProductList
		v-qa="'builder-section-zyroecommerceproductlist'"
		v-bind="{
			blockId,
			products,
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
			ribbonStyle,
			isProductListItemLinkDisabled: true,
		}"
		:translations="ecommerceTranslations"
		:site-id="siteId"
		:variants-quantity="variantsQuantity"
	/>
</template>

<script>
import {
	useStore,
	mapState,
	mapGetters,
} from 'vuex';

import BlockEcommerceProductList from '@zyro-inc/site-modules/components/blocks/ecommerce/BlockEcommerceProductList.vue';
import { useBlockEcommerceProductList } from '@zyro-inc/site-modules/components/blocks/ecommerce/useBlockEcommerceProductList';
import { DEMO_PRODUCTS } from '@zyro-inc/site-modules/constants/ecommerce';
import { SYSTEM_LOCALE } from '@zyro-inc/site-modules/constants';
import { getProductPages } from '@zyro-inc/site-modules/utils/ecommerce/getProductPages';

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	components: {
		BlockEcommerceProductList,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			default: () => ({}),
		},
		// this prop is used to indicate when addBlockModal preview is open
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
		ecommerceTranslations: {
			type: Object,
			default: () => ({}),
		},
		currentLocale: {
			type: String,
			default: SYSTEM_LOCALE,
		},
	},

	setup(props) {
		const {
			state,
			getters,
		} = useStore();

		const stateProductPages = computed(() => getProductPages(state.website, props.currentLocale));
		const isStoreTypeZyro = computed(() => getters['ecommerce/isStoreTypeZyro']);
		const stateProducts = computed(() => state.ecommerce?.products);

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
			isLoading,
		} = useBlockEcommerceProductList(props, {
			productPages: stateProductPages,
			isStoreTypeZyro,
			products: stateProducts,
		});

		const products = props.isBlockPreviewMode ? DEMO_PRODUCTS : productList;

		return {
			isLoading,
			products,
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
		};
	},

	computed: {
		...mapState(['websiteId']),
		...mapGetters(['siteMeta']),
		...mapState('ecommerce', ['variantsQuantity']),
		isProductListShown() {
			if (this.isBlockPreviewMode) {
				return true;
			}

			if (this.siteMeta.defaultLocale && this.currentLocale !== this.siteMeta.defaultLocale) {
				return false;
			}

			return !!this.products?.length;
		},
	},
});
</script>
