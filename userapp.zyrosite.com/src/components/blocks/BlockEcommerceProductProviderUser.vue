<template>
	<BlockEcommerceProduct
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
			quantifiedCartItemsList,
			isCheckoutLoading,
			productPages,
			isQuickPreview,
			currentPageType
		}"
		:product-data="product"
		:can-add-to-cart="canAddToCart"
		:is-loading="(isLoading || !isLoaded) && productId !== -1"
		:translations="ecommerceTranslations"
		:is-cart-visible="isCartVisible"
		:is-eager="lcp.type === 'block-ecommerce-product' && lcp.id === blockId"
		:[DATA_ATTRIBUTE_ANIMATION_STATE]="animationState"
		:site-id="siteId"
		:shopping-cart-items="shoppingCartItems"
		:variants-quantity="variantsQuantity"
		@buy-button-click="handleBuyButtonClick"
		@click-more="closeEcommerceModal"
		@image-click="handleImageClick"
	/>
</template>

<script>
import {
	DATA_ATTRIBUTE_ANIMATION_STATE,
	DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
} from '@zyro-inc/site-modules/constants';
import {
	mapState,
	mapActions,
	mapGetters,
} from 'vuex';
import BlockEcommerceProduct from '@zyro-inc/site-modules/components/blocks/ecommerce/BlockEcommerceProduct.vue';
import { useBlockEcommerceProduct } from '@zyro-inc/site-modules/components/blocks/ecommerce/useBlockEcommerceProduct';
import { getIsInIframe } from '@zyro-inc/site-modules/utils/getIsInIframe';

import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';
import { useEcommerce } from '@/components/ecommerce/useEcommerce';
import {
	DEFAULT_EMPTY_PRODUCT_VALUE,
	PRODUCT_TYPE_BOOKING,
} from '@zyro-inc/site-modules/constants/ecommerce';
import { useLightbox } from '@zyro-inc/site-modules/components/lightbox/useLightbox';

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
		lcp: {
			type: Object,
			default: () => ({}),
		},
		ecommerceTranslations: {
			type: Object,
			default: () => ({}),
		},
		isQuickPreview: {
			type: Boolean,
			default: false,
		},
		productPages: {
			type: Array,
			default: () => [],
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
		currentPageType: {
			type: String,
			default: 'default',
		},
	},

	setup(props) {
		const {
			openEcommerceModal,
			closeEcommerceModal,
		} = useEcommerceModal(props);
		const { initiateCheckout } = useEcommerce(props);
		const { addImagesToLightbox } = useLightbox();
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
			openEcommerceModal,
			closeEcommerceModal,
			imageBorderRadius,
			navigationArrowsColor,
			navigationThumbnailArrowsColor,
			galleryPlacement,
			imageRatio,
			isQuantityPickerEnabled,
			initiateCheckout,
			addImagesToLightbox,
		};
	},

	data() {
		return {
			DATA_ATTRIBUTE_ANIMATION_STATE,
			animationState: null,
		};
	},

	computed: {
		...mapState('ecommerce', [
			'isShoppingCartOpen',
			'products',
			'shoppingCartItems',
			'variantsQuantity',
			'isCheckoutLoading',
			'isLoading',
			'isLoaded',
		]),
		...mapGetters(['siteId']),
		...mapGetters('ecommerce', [
			'canAddToCart',
			'quantifiedCartItemsList',
		]),
		product() {
			return this.products.find((item) => item.id === this.productId) || DEFAULT_EMPTY_PRODUCT_VALUE;
		},
	},

	mounted() {
		this.setAnimationState();
	},

	beforeUnmount() {
		this.closeEcommerceModal();
	},

	methods: {
		...mapActions('ecommerce', [
			'setShoppingCartOpen',
			'setShoppingCartItems',
			'setSelectedBookingId',
			'setIsCheckoutLoading',
		]),
		setAnimationState() {
			setTimeout(() => {
				this.animationState = DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE;
			}, 100);
		},
		async handleBuyButtonClick(value) {
			// Need to use await here so that all previous modals would get closed for others to open up
			await this.closeEcommerceModal();

			if (this.product.type.value === PRODUCT_TYPE_BOOKING) {
				this.setSelectedBookingId(this.productId);
				this.openEcommerceModal('EcommerceBookingEventSelect');

				return;
			}

			if (getIsInIframe()) {
				this.openEcommerceModal('EcommerceMessageButtonDisabled');

				return;
			}

			if (this.isCartVisible) {
				this.setShoppingCartItems([
					...this.shoppingCartItems,
					...value,
				]);

				this.manageCartOpenState();
			} else {
				this.setIsCheckoutLoading(true);
				await this.initiateCheckout(value).then(() => {
					this.setIsCheckoutLoading(false);
				});
			}
		},
		manageCartOpenState() {
			if (this.isShoppingCartOpen) {
				return;
			}

			this.setShoppingCartOpen(true);
		},
		handleImageClick(index) {
			const aggregatedImages = this.product.images.map((image) => ({
				alt: this.product.title,
				src: image.url,
			}));

			this.addImagesToLightbox(aggregatedImages, index);
		},
	},
});
</script>
