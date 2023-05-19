<template>
	<BlockEcommerceProduct
		v-qa="'builder-section-zyroecommerceproduct'"
		v-bind="{
			blockId,
			blockStyle,
			blockButtonText,
			blockButtonStyle,
			blockButtonType,
			blockButtonBorderWidth,
			textColorVars,
			imageBorderRadius,
			navigationArrowsColor,
			navigationThumbnailArrowsColor,
			galleryPlacement,
			imageRatio,
			isQuantityPickerEnabled,
			currentPageType
		}"
		:product-data="product"
		:force-mobile="isMobileView"
		:is-cart-visible="isCartVisible"
		:translations="ecommerceTranslations"
		:site-id="websiteId"
		:shopping-cart-items="shoppingCartItems"
		:variants-quantity="variantsQuantity"
	/>
</template>

<script>
import {
	mapState,
	mapGetters,
} from 'vuex';

import BlockEcommerceProduct from '@zyro-inc/site-modules/components/blocks/ecommerce/BlockEcommerceProduct.vue';
import { useBlockEcommerceProduct } from '@zyro-inc/site-modules/components/blocks/ecommerce/useBlockEcommerceProduct';
import {
	DEFAULT_EMPTY_PRODUCT_VALUE,
	DEMO_PRODUCTS,
} from '@zyro-inc/site-modules/constants/ecommerce';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		BlockEcommerceProduct,
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
		// this prop is used to indicate when addBlockModal preview is open (which is not preview iframe)
		isBlockPreviewMode: {
			type: Boolean,
			default: false,
		},
		ecommerceTranslations: {
			type: Object,
			default: () => ({}),
		},
		currentPageType: {
			type: String,
			default: 'default',
		},
	},

	setup(props) {
		const {
			productId,
			blockStyle,
			blockButtonText,
			blockButtonStyle,
			blockButtonType,
			blockButtonBorderWidth,
			textColorVars,
			imageBorderRadius,
			navigationArrowsColor,
			navigationThumbnailArrowsColor,
			galleryPlacement,
			imageRatio,
			isQuantityPickerEnabled,
		} = useBlockEcommerceProduct(props);

		return {
			productId,
			blockStyle,
			blockButtonText,
			blockButtonStyle,
			blockButtonType,
			blockButtonBorderWidth,
			textColorVars,
			imageBorderRadius,
			navigationArrowsColor,
			navigationThumbnailArrowsColor,
			galleryPlacement,
			imageRatio,
			isQuantityPickerEnabled,
		};
	},

	computed: {
		...mapState(['websiteId']),
		...mapState('gui', ['isMobileView']),
		...mapState('ecommerce', [
			'shoppingCartItems',
			'variantsQuantity',
		]),
		...mapGetters('ecommerce', [
			'isCartVisible',
			'products',
		]),
		product() {
			if (this.isBlockPreviewMode) {
				return DEMO_PRODUCTS[0];
			}

			const foundProduct = this.products.find((item) => item.id === this.productId);

			return foundProduct || DEFAULT_EMPTY_PRODUCT_VALUE;
		},
	},
});
</script>
