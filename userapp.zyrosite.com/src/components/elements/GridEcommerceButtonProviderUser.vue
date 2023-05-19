<template>
	<GridButton
		v-qa="'button-ecommerce-checkout'"
		tag-name="button"
		:content="content"
		:type="type"
		:is-disabled="isAddToCartDisabled"
		:is-loading="isLoading"
		:font-size-mobile="fontSizeMobile"
		:font-size-desktop="fontSizeDesktop"
		:font-family="fontFamily"
		:font-weight="fontWeight"
		:border-radius="borderRadius"
		:border-width="borderWidth"
		:background-color="backgroundColor"
		:font-color="fontColor"
		:border-color="borderColor"
		:background-color-hover="backgroundColorHover"
		:font-color-hover="fontColorHover"
		:border-color-hover="borderColorHover"
		:mobile-element-width="mobileElementWidth"
		:mobile-element-height="mobileElementHeight"
		@click="handleClick"
	/>
</template>

<script>
import {
	mapActions,
	mapState,
	useStore,
} from 'vuex';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridButton';
import { useEcommerceGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridEcommerceButton';
import { getIsInIframe } from '@zyro-inc/site-modules/utils/getIsInIframe';

import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';
import { useEcommerce } from '@/components/ecommerce/useEcommerce';
import { PRODUCT_TYPE_BOOKING } from '@zyro-inc/site-modules/constants/ecommerce';

import {
	defineComponent,
	computed,
} from 'vue';

export default defineComponent({
	name: 'GridEcommerceButtonProviderUser',

	components: {
		GridButton,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
		mobileElementWidth: {
			type: Number,
			default: null,
		},
		mobileElementHeight: {
			type: Number,
			default: null,
		},
	},

	setup(props, context) {
		const {
			state,
			getters,
		} = useStore();
		const { initiateCheckout } = useEcommerce(props);
		const { openEcommerceModal } = useEcommerceModal(props);
		const {
			content,
			type,
			fontSizeMobile,
			fontSizeDesktop,
			fontFamily,
			fontWeight,
			borderRadius,
			backgroundColor,
			fontColor,
			borderColor,
			borderWidth,
			backgroundColorHover,
			fontColorHover,
			borderColorHover,
		} = useGridButton(props, context, {
			href: computed(() => getters.getButtonHref({
				isFormButton: props.data.settings.isFormButton,
				linkedPageId: props.data.linkedPageId,
				linkType: props.data.linkType,
				href: props.data.href,
			})),
		});

		const shoppingCartItems = computed(() => state.ecommerce?.shoppingCartItems);
		const canAddToCart = computed(() => getters['ecommerce/canAddToCart']);

		const {
			productId,
			productVariantId,
			storeProducts,
		} = useEcommerceGridButton(props, state);

		const product = computed(() => storeProducts.value.find((item) => item.id === productId.value));

		const isProductTypeBooking = computed(() => product.value?.type.value === PRODUCT_TYPE_BOOKING);

		const isBookingProductInCart = computed(() => isProductTypeBooking.value
			&& !!shoppingCartItems.value?.some((item) => item.id === productId.value));

		const isAddToCartDisabled = computed(() => isBookingProductInCart.value
			|| !canAddToCart.value(productId.value, productVariantId.value));

		return {
			openEcommerceModal,
			productId,
			productVariantId,
			content,
			type,
			fontSizeMobile,
			fontSizeDesktop,
			fontFamily,
			fontWeight,
			borderRadius,
			borderWidth,
			backgroundColor,
			fontColor,
			borderColor,
			backgroundColorHover,
			fontColorHover,
			borderColorHover,
			initiateCheckout,
			shoppingCartItems,
			storeProducts,
			isAddToCartDisabled,
			product,
			canAddToCart,
		};
	},

	data() {
		return {
			isLoading: false,
		};
	},

	computed: {
		...mapState('ecommerce', ['isShoppingCartOpen']),
	},

	methods: {
		...mapActions('ecommerce', [
			'setShoppingCartOpen',
			'setShoppingCartItems',
			'setSelectedBookingId',
		]),
		async handleClick() {
			if (this.product?.type.value === PRODUCT_TYPE_BOOKING) {
				this.setSelectedBookingId(this.productId);
				this.openEcommerceModal('EcommerceBookingEventSelect');

				return;
			}

			if (getIsInIframe()) {
				this.openEcommerceModal('EcommerceMessageButtonDisabled');

				return;
			}

			const variant = this.product?.variants.find((item) => item.id === this.productVariantId);
			const productToAdd = {
				...this.product,
				variants: [variant],
			};

			if (this.isCartVisible) {
				this.setShoppingCartItems([
					...this.shoppingCartItems,
					productToAdd,
				]);

				this.manageCartOpenState();
			} else {
				this.isLoading = true;

				await this.initiateCheckout([productToAdd]).then(() => {
					this.isLoading = false;
				});
			}
		},
		manageCartOpenState() {
			if (this.isShoppingCartOpen) {
				return;
			}

			this.setShoppingCartOpen(true);
		},
	},
});
</script>
