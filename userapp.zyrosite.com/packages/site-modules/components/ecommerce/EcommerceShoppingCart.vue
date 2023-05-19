<!-- eslint-disable max-len -->
<template>
	<Drawer
		:is-open="isShoppingCartOpen"
		:top-position-mobile="topPositionMobile"
		:style="computedStyle"
		@close-drawer="closeShoppingCart"
	>
		<div class="cart">
			<div class="cart__content">
				<p
					v-if="!quantifiedCartItemsList.length"
					class="cart__content-title cart__content-title--with-margin"
					data-qa="shoppingcart-text-emptystate"
				>
					{{ translations.shoppingBagEmpty }}
				</p>
				<p
					v-else
					class="cart__content-title"
				>
					{{ translations.shoppingBag }}
				</p>
				<ul class="cart__list">
					<li
						v-for="item in quantifiedCartItemsList"
						:key="item.product.variants[0].id"
						class="cart__list-item"
					>
						<ProductImage
							v-if="item.product.thumbnail"
							:src="getProductImage(item)"
							:alt="item.product.title"
							class="cart__list-item-image"
							:width="IMAGE_WIDTH_PX"
							:height="IMAGE_WIDTH_PX"
							:site-id="siteId"
							enable-srcset
						/>
						<div>
							<p
								class="cart__title"
								data-qa="shoppingcart-text-product"
							>
								{{ item.product.title }}
							</p>
							<p
								v-if="item.product.options.length"
								class="cart__text"
								data-qa="shoppingcart-text-variant"
							>
								{{ item.product.variants[0].title }}
							</p>
							<p
								class="cart__text cart__price"
								:class="{ 'cart__price--strikethrough': item.product.variants[0].prices[0].sale_amount }"
								data-qa="shoppingcart-text-price"
							>
								{{ formatPrice(item.product.variants[0].prices[0].amount, item.product.variants[0].prices[0].currency) }}
							</p>
							<p
								v-if="item.product.variants[0].prices[0].sale_amount"
								class="cart__text cart__sale-price"
								data-qa="shoppingcart-text-saleprice"
							>
								{{ formatPrice(item.product.variants[0].prices[0].sale_amount, item.product.variants[0].prices[0].currency) }}
							</p>
							<template v-if="isProductBookingType(item)">
								<p
									class="cart__text cart__duration"
									data-qa="shoppingcart-text-duration"
								>
									{{ getFormattedBookingDuration(item.product, translations) }}
								</p>
								<div class="cart__time-wrapper">
									<svg
										width="16"
										height="18"
										viewBox="0 0 16 18"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										class="cart__time-icon"
									>
										<path
											d="M5.5 8.3335H3.83333V10.0002H5.5V8.3335ZM8.83333 8.3335H7.16667V10.0002H8.83333V8.3335ZM12.1667 8.3335H10.5V10.0002H12.1667V8.3335ZM13.8333 2.50016H13V0.833496H11.3333V2.50016H4.66667V0.833496H3V2.50016H2.16667C1.24167 2.50016 0.5 3.25016 0.5 4.16683V15.8335C0.5 16.2755 0.675595 16.6994 0.988155 17.012C1.30072 17.3246 1.72464 17.5002 2.16667 17.5002H13.8333C14.2754 17.5002 14.6993 17.3246 15.0118 17.012C15.3244 16.6994 15.5 16.2755 15.5 15.8335V4.16683C15.5 3.7248 15.3244 3.30088 15.0118 2.98832C14.6993 2.67576 14.2754 2.50016 13.8333 2.50016ZM13.8333 15.8335H2.16667V6.66683H13.8333V15.8335Z"
											fill="currentColor"
										/>
									</svg>
									<p class="cart__text cart__text--lighter">
										{{ getFormattedSelectedDate(item) }}
									</p>
								</div>
								<div class="cart__time-wrapper">
									<svg
										width="18"
										height="18"
										viewBox="0 0 18 18"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										class="cart__time-icon"
									>
										<path
											d="M9.00001 15.6665C12.6667 15.6665 15.6667 12.6665 15.6667 8.99984C15.6667 5.33317 12.6667 2.33317 9.00001 2.33317C5.33334 2.33317 2.33334 5.33317 2.33334 8.99984C2.33334 12.6665 5.33334 15.6665 9.00001 15.6665ZM9.00001 0.666504C13.5833 0.666504 17.3333 4.4165 17.3333 8.99984C17.3333 13.5832 13.5833 17.3332 9.00001 17.3332C4.41667 17.3332 0.666672 13.5832 0.666672 8.99984C0.666672 4.4165 4.41667 0.666504 9.00001 0.666504ZM13.1667 8.58317V9.83317H8.16667V4.83317H9.41667V8.58317H13.1667Z"
											fill="currentColor"
										/>
									</svg>
									<p class="cart__text cart__text--lighter">
										{{ getFormattedTime(item) }}
									</p>
								</div>
							</template>
							<p
								v-else
								class="cart__quantity"
							>
								<span class="cart__quantity-title">
									{{ translations.quantityShort }}:
								</span>
								<QuantityPicker
									is-cart-style
									:size="26"
									:font-size="14"
									data-qa-page-type="shoppingcart"
									:quantity="item.quantity"
									is-input-disabled
									:is-limit-reached="isLimitReached"
									:is-stock-available="isStockAvailable(item)"
									@quantity-change="handleQuantityChange($event, item)"
								/>
							</p>
						</div>
						<DeleteButton
							data-qa="shoppingcart-btn-delete"
							class="cart__remove-button"
							@handle-button-click="removeProduct(item.product)"
						/>
					</li>
				</ul>
			</div>
			<div
				v-if="quantifiedCartItemsList.length"
				class="cart__footer"
			>
				<p
					class="cart__title cart__title--with-slot"
					data-qa="shoppingcart-text-subtotal"
				>
					{{ translations.subtotal }}: <span>{{ formatPrice(totalPrice, currencyCode) }}</span>
				</p>
				<button
					data-qa="shoppingcart-btn-checkout"
					class="cart__text cart__checkout-button"
					:class="{ 'loading': isLoading }"
					@click="$emit('checkout-button-click')"
				>
					{{ translations.checkout }}
				</button>
			</div>
		</div>
	</Drawer>
</template>

<script>
import DeleteButton from '@zyro-inc/site-modules/components/ecommerce/-partials/DeleteButton.vue';
import Drawer from '@zyro-inc/site-modules/components/ecommerce/-partials/Drawer.vue';
import formatPrice from '@zyro-inc/site-modules/utils/ecommerce/priceFormatter';
import ProductImage from '@zyro-inc/site-modules/components/ecommerce/ProductImage.vue';
import {
	PRODUCT_TYPE_BOOKING,
	MAX_PRODUCTS_IN_CART,
} from '@zyro-inc/site-modules/constants/ecommerce';
import {
	getFormattedBookingDuration,
	getBookingDuration,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';

import { defineComponent } from 'vue';
import QuantityPicker from './-partials/QuantityPicker.vue';

const IMAGE_WIDTH_PX = 90;

export default defineComponent({
	components: {
		Drawer,
		DeleteButton,
		ProductImage,
		QuantityPicker,
	},

	props: {
		isLoading: {
			type: Boolean,
			default: false,
		},
		isShoppingCartOpen: {
			type: Boolean,
			default: false,
		},
		translations: {
			type: Object,
			default: null,
		},
		language: {
			type: String,
			default: 'en',
		},
		isHeaderSticky: {
			type: Boolean,
			default: false,
		},
		isNavHidden: {
			type: Boolean,
			default: false,
		},
		siteId: {
			type: String,
			default: null,
		},
		quantifiedCartItemsList: {
			type: Array,
			default: () => [],
		},
		products: {
			type: Array,
			default: () => [],
		},
		shoppingCartItems: {
			type: Array,
			default: () => [],
		},
		variantsQuantity: {
			type: Array,
			default: () => [],
		},
	},

	emits: [
		'close-shopping-cart',
		'checkout-button-click',
		'set-shopping-cart-items',
	],

	data() {
		return {
			IMAGE_WIDTH_PX,
			isHeaderVisible: false,
			topPositionMobile: '0px',
			resizeObserver: null,
		};
	},

	computed: {
		totalPrice() {
			return this.quantifiedCartItemsList.reduce(
				(accumulator, item) => accumulator
				+ (item.product?.variants[0]?.prices[0]?.sale_amount || item.product?.variants[0]?.prices[0]?.amount || 0) * item.quantity,
				0,
			);
		},
		currencyCode() {
			return this.products[0]?.variants[0]?.prices[0]?.currency;
		},
		computedStyle() {
			return {
				'--image-width': `${IMAGE_WIDTH_PX}px`,
			};
		},
		isLimitReached() {
			return this.shoppingCartItems.length >= MAX_PRODUCTS_IN_CART;
		},
	},

	watch: {
		isShoppingCartOpen(isOpen) {
			document.documentElement.style.overflow = isOpen ? 'hidden' : 'auto';
		},
		headerHeight() {
			// prop headerHeight is still null on mounted, so need to watch when it changes to set the right initial visibility value
			this.setHeaderVisibilityValues();
		},
	},

	mounted() {
		const blockHeaderElement = document.querySelector('.block-header');

		if (blockHeaderElement) {
			this.resizeObserver = new ResizeObserver(() => {
				this.setHeaderHeight();
			});
			this.resizeObserver.observe(blockHeaderElement);
		}

		window.addEventListener('scroll', this.setHeaderVisibilityValues);
	},

	beforeDestroy() {
		this.resizeObserver?.disconnect();
		window.removeEventListener('scroll', this.setHeaderVisibilityValues);
	},

	methods: {
		getFormattedBookingDuration,
		formatPrice,
		isStockAvailable(target) {
			if (target.product.variants[0].manage_inventory) {
				const foundItem = this.variantsQuantity.find((item) => item.id === target.product.variants[0].id);
				const quantity = foundItem?.inventory_quantity || 0;

				return target.quantity < quantity;
			}

			return true;
		},
		handleQuantityChange(event, item) {
			if (event > item.quantity) {
				this.increaseQuantity(item);

				return;
			}

			this.decreaseQuantity(item);
		},
		decreaseQuantity(target) {
			const clone = [...this.shoppingCartItems];
			const matches = this.shoppingCartItems.filter((item) => item.variants[0].id === target.product.variants[0].id);
			const index = this.shoppingCartItems.lastIndexOf((matches[matches.length - 1]));

			clone.splice(index, 1);

			this.$emit('set-shopping-cart-items', clone);
		},
		increaseQuantity(target) {
			this.$emit('set-shopping-cart-items', [
				...this.shoppingCartItems,
				target.product,
			]);
		},
		removeProduct(productToRemove) {
			const filteredItems = this.shoppingCartItems.filter((item) => item.variants[0].id !== productToRemove.variants[0].id);

			this.$emit('set-shopping-cart-items', filteredItems);
		},
		closeShoppingCart() {
			this.$emit('close-shopping-cart');
		},
		setHeaderVisibility() {
			// multiplying by 0.4 because when the header is half visible or less, user will not be able to click on the cart on mobile
			this.isHeaderVisible = this.isHeaderSticky || (this.isNavHidden ? false : window.scrollY <= Number(this.headerHeight) * 0.4);
		},
		setTopPositionMobile() {
			const calculatedTopPosition = this.isHeaderSticky ? this.headerHeight : this.headerHeight - window.scrollY;

			// -1 so there would not be space between header and shopping bag
			this.topPositionMobile = `${this.isHeaderVisible ? Math.floor(calculatedTopPosition) - 1 : 0}px`;
		},
		setHeaderVisibilityValues() {
			this.setHeaderVisibility();
			this.setTopPositionMobile();
		},
		setHeaderHeight() {
			this.headerHeight = document.querySelector('.block-header')?.clientHeight;
		},
		getFormattedSelectedDate(item) {
			const date = new Date(item.product?.variants[0]?.booking_event?.date);

			return date.toLocaleDateString(this.language) || null;
		},
		getFormattedTime(item) {
			const startDate = new Date(item.product?.variants[0]?.booking_event?.time_slot);
			const dateInMilliseconds = startDate.getTime();
			const endDate = new Date(dateInMilliseconds + getBookingDuration(item.product));

			const startTime = startDate.toLocaleTimeString(this.language, {
				hour: '2-digit',
				minute: '2-digit',
			});

			const endTime = endDate.toLocaleTimeString(this.language, {
				hour: '2-digit',
				minute: '2-digit',
			});

			return `${startTime} - ${endTime}`;
		},
		isProductBookingType(item) {
			return item.product?.type.value === PRODUCT_TYPE_BOOKING;
		},
		getProductImage(item) {
			return item.product.variants[0].image_url || item.product.thumbnail;
		},
	},
});
</script>
<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/transitions/loading-animation";

$footer-height: 140px;
$content-side-padding: 24px;

@mixin separator($top: false, $mobile-width: 100%) {
	position: absolute;
	width: 300px;
	height: 0.5px;
	content: "";
	background-color: $color-gray-light;

	@if $top {
		top: 0;
	} @else {
		bottom: 0;
	}

	@media screen and (max-width: $media-mobile) {
		width: $mobile-width;
	}
}

.cart {
	display: flex;
	flex: 1 1 auto;
	flex-direction: column;
	width: 100%;
	height: 100%;
	font-family: var(--body-font-family);

	&__content {
		display: flex;
		flex-direction: column;
		height: 100%;
		padding: 45px $content-side-padding 0;
		overflow-y: auto;
		color: $color-dark;

		@media screen and (max-width: $media-mobile) {
			padding-top: 10px;
		}
	}

	&__content-title {
		margin-bottom: 16px;
		font-size: 22px;
		font-weight: 700;
		line-height: 1.45;
		color: $color-dark;

		&--with-margin {
			margin: 120px auto 16px;
		}

		@media screen and (max-width: $media-mobile) {
			font-size: 18px;
			margin-right: 15px;
			z-index: 1;
		}
	}

	&__list {
		list-style-type: none;
	}

	&__list-item {
		position: relative;
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 16px 0;

		&::after {
			@include separator;
		}

		&:first-child::before {
			@include separator($top: true);
		}
	}

	&__list-item-image {
		width: var(--image-width);
		height: var(--image-width);
		object-fit: cover;
		object-position: center;
		margin-right: 16px;
	}

	&__title {
		margin-bottom: 8px;
		font-size: 18px;
		font-weight: 500;
		line-height: 1.4;

		&--with-slot {
			display: flex;
			justify-content: space-between;
			font-weight: 700;
		}

		@media screen and (max-width: $media-mobile) {
			font-size: 16px;
		}
	}

	&__text {
		margin-bottom: 4px;
		font-size: 16px;
		line-height: 1.2;
		color: $color-gray;

		@media screen and (max-width: $media-mobile) {
			font-size: 14px;
		}

		&--lighter {
			color: $color-gray;
		}
	}

	&__price {
		display: inline-block;

		&--strikethrough {
			display: block;
			text-decoration: line-through;
			opacity: 0.4;
		}
	}

	&__sale-price {
		display: inline-block;
	}

	&__duration {
		display: inline-flex;

		&::before {
			margin: 0 8px;
			content: "|";
		}
	}

	&__time-wrapper {
		display: flex;
		color: $color-gray;

		&:first-of-type {
			margin-top: 12px;
		}
	}

	&__time-icon {
		margin-right: 8px;
	}

	&__quantity {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10px;
	}

	&__quantity-title {
		align-self: center;
		margin-right: 8px;
		color: $color-gray;
	}

	&__remove-button {
		margin-left: auto;
	}

	&__footer {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 100%;
		height: $footer-height;
		padding: 16px 24px 20px;
		background-color: $color-light;

		&::after {
			margin-top: -1px;

			@include separator($top: true, $mobile-width: calc(100% - calc($content-side-padding * 2)));
		}
	}

	&__checkout-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 310px;
		padding: 10px 16px;
		font-family: inherit;
		color: $color-light;
		cursor: pointer;
		background-color: $color-azure;
		border-radius: 4px;
		transition: max-width 0.2s ease;

		@media screen and (max-width: 500px) {
			max-width: 100%;
		}

		@include loading-animation;
	}
}
</style>
