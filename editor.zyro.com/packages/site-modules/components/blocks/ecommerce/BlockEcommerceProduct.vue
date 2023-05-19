<template>
	<div
		:id="blockId"
		class="block-product-wrapper"
		:[DATA_ATTRIBUTE_ANIMATION_ROLE]="DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT"
	>
		<ProductSkeletonLoader
			v-if="isLoading || !productData"
			:image-border-radius="imageBorderRadius"
			:text-align="textAlign"
		/>
		<div
			v-else
			class="block-product"
			:class="{
				'block-product--centered': textAlign === 'center',
				'block-product--in-preview': isQuickPreview
			}"
			:style="computedStyles"
		>
			<Carousel
				:images="productData.images"
				:product-title="productData.title"
				:arrows-color="navigationArrowsColor"
				:navigation-thumbnail-arrows-color="navigationThumbnailArrowsColor"
				:gallery-placement="galleryPlacement"
				:image-ratio="imageRatio"
				:image-border-radius="imageBorderRadius"
				:is-eager="isEager"
				:site-id="siteId"
				:variant-image="variantImage"
				:is-quick-preview="isQuickPreview"
				:is-variant-image-preselected="isProductPriceRangeShown(productData)"
				@image-click="$emit('image-click', $event)"
			/>
			<div class="block-product__content-wrapper">
				<div class="block-product__price-data-wrapper">
					<h1
						v-if="isBlockInProductPage"
						v-qa="'builder-product-section-title'"
						class="block-product__title"
					>
						{{ productData.title }}
					</h1>
					<h3
						v-else
						v-qa="'builder-product-section-title'"
						class="block-product__title"
					>
						{{ productData.title }}
					</h3>
					<h5 class="block-product__subtitle">
						{{ productData.subtitle }}
					</h5>
					<div
						class="block-product__price-wrapper"
						:class="{ 'block-product__price-wrapper--with-duration': isProductTypeBooking }"
					>
						<p
							v-if="showPrice"
							class="block-product__price body-large"
							:class="{ 'block-product__price--sale': priceData.sale_amount }"
						>
							{{ formatPrice(priceData.amount, priceData.currency) }}
						</p>
						<div class="block-product__additional-info">
							<p
								v-if="priceData.sale_amount && showPrice"
								class="block-product__price body-large"
							>
								{{ formatPrice(priceData.sale_amount, priceData.currency) }}
							</p>
							<p
								v-if="isProductTypeBooking"
								class="block-product__duration body-large"
							>
								{{ formattedBookingDuration }}
							</p>
						</div>
					</div>
					<p
						v-if="isProductTypeBooking"
						class="block-product__location"
					>
						{{ location }}
					</p>
					<div
						v-if="productData.options.length"
						class="block-product__option-select-wrapper"
					>
						<OptionSelect
							v-for="(option, index) in productData.options"
							:key="`option-${index}`"
							:value="selectedOption(index)"
							:options="uniqueOptionSelections[index]"
							:title="option.title"
							class="block-product__option-select"
							:class="{ 'block-product__option-select--centered' : textAlign === 'center' }"
							label-key="value"
							@set-value="handleVariantOptionChange($event)"
						/>
					</div>
					<div
						v-if="!isProductTypeBooking && isQuantityPickerEnabled"
						class="block-product__quantity-wrapper"
						:class="{ 'block-product__quantity-wrapper--disabled' : isOutOfStock || isAddToCartDisabled }"
					>
						<QuantityPicker
							data-qa-page-type="productpage"
							:quantity="selectedQuantity"
							:is-limit-reached="isLimitReached"
							:is-stock-available="isStockAvailable"
							@quantity-change="handleQuantityChange"
						/>
						<p
							v-if="isStockInfoShown"
							class="block-product__stock-text"
						>
							{{ stockInfoText }}
						</p>
					</div>
				</div>
				<div class="block-product__button-wrapper">
					<GridButton
						v-qa="`productsection-btn-addtobag`"
						:type="blockButtonType"
						:content="buttonText"
						class="block-product__button"
						:class="`block-product__button--${blockButtonType}`"
						:is-loading="isCheckoutLoading"
						tag-name="button"
						:disabled="isAddToCartDisabled"
						:border-width="blockButtonBorderWidth"
						:border-color="buttonBorderColor.normal"
						:border-color-hover="buttonBorderColor.hover"
						:background-color="buttonBackgroundColor.normal"
						:background-color-hover="buttonBackgroundColor.hover"
						@click="handleButtonClick"
					/>
				</div>
				<Transition>
					<p
						v-if="isBookingProductInCart"
						class="block-product__notice"
					>
						{{ translations.purchaseToBookAgain }}
					</p>
				</Transition>
				<p
					v-if="productData.description && !isQuickPreview"
					class="block-product__description"
					v-html="productData.description"
				/>
				<RouterLink
					v-else-if="isQuickPreview"
					:to="{ path: productPagePath }"
					class="block-product__link body-large"
					@click="$emit('click-more')"
				>
					{{ translations.moreDetails }}
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<script>
import Carousel from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/Carousel.vue';
import OptionSelect from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/OptionSelect.vue';
import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import formatPrice from '@zyro-inc/site-modules/utils/ecommerce/priceFormatter';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import {
	PRODUCT_TYPE_BOOKING,
	SITE_PRODUCT_SELECTION,
	SITE_PRODUCT_SELECTION_TYPE_LOWEST,
	MAX_PRODUCTS_IN_CART,
} from '@zyro-inc/site-modules/constants/ecommerce';
import {
	getFormattedBookingDuration,
	isProductPriceRangeShown,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';
import ProductSkeletonLoader from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/ProductSkeletonLoader.vue';
import QuantityPicker from '@zyro-inc/site-modules/components/ecommerce/-partials/QuantityPicker.vue';
import {
	defineComponent,
	computed,
} from 'vue';
import {
	PAGE_TYPE_ECOMMERCE_PRODUCT,
	DATA_ATTRIBUTE_ANIMATION_ROLE,
	DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
} from '@zyro-inc/site-modules/constants';

const MAX_STOCK_AMOUNT_TO_SHOW = 5;
const DEFAULT_PICKER_VALUE = 1;

export default defineComponent({
	name: 'BlockEcommerceProduct',

	components: {
		GridButton,
		Carousel,
		OptionSelect,
		ProductSkeletonLoader,
		QuantityPicker,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		productData: {
			type: Object,
			default: null,
		},
		blockStyle: {
			type: Object,
			default: () => ({}),
		},
		textColorVars: {
			type: Object,
			default: () => ({}),
		},
		blockButtonText: {
			type: String,
			default: null,
		},
		blockButtonStyle: {
			type: Object,
			default: () => ({}),
		},
		blockButtonType: {
			type: String,
			default: 'primary',
		},
		blockButtonBorderWidth: {
			type: Number,
			default: 0,
		},
		navigationArrowsColor: {
			type: String,
			default: null,
		},
		navigationThumbnailArrowsColor: {
			type: String,
			default: null,
		},
		galleryPlacement: {
			type: String,
			default: null,
		},
		imageRatio: {
			type: String,
			default: 'cover',
		},
		imageBorderRadius: {
			type: String,
			default: '0%',
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		isCheckoutLoading: {
			type: Boolean,
			default: false,
		},
		canAddToCart: {
			type: Function,
			default: () => true,
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		translations: {
			type: Object,
			default: null,
		},
		quantifiedCartItemsList: {
			type: Array,
			default: () => ([]),
		},
		isQuantityPickerEnabled: {
			type: Boolean,
			default: false,
		},
		productPages: {
			type: Object,
			default: () => ({}),
		},
		isQuickPreview: {
			type: Boolean,
			default: false,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
		siteId: {
			type: String,
			default: null,
		},
		shoppingCartItems: {
			type: Array,
			default: () => [],
		},
		variantsQuantity: {
			type: Array,
			default: () => [],
		},
		currentPageType: {
			type: String,
			default: 'default',
		},
	},
	emits: ['buy-button-click'],
	setup(props) {
		const isBlockInProductPage = computed(() => props.currentPageType === PAGE_TYPE_ECOMMERCE_PRODUCT);

		return {
			isBlockInProductPage,
		};
	},
	data() {
		return {
			DATA_ATTRIBUTE_ANIMATION_ROLE,
			DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
			selectVariant: null,
			selectedQuantity: 1,
			variantImage: null,
			isLimitReached: false,
		};
	},

	computed: {
		buttonBackgroundColor() {
			return {
				normal: this.blockButtonStyle[`grid-button-${this.blockButtonType}-background-color`],
				hover: this.blockButtonStyle[`grid-button-${this.blockButtonType}-background-color-hover`],
			};
		},
		buttonBorderColor() {
			return {
				hover: this.blockButtonStyle[`grid-button-${this.blockButtonType}-border-color-hover`],
				normal: this.blockButtonStyle[`grid-button-${this.blockButtonType}-border-color`],
			};
		},
		textAlign() {
			return this.blockStyle?.textAlign;
		},
		priceData() {
			return this.selectedVariant
				? this.selectedVariant.variants[0].prices[0]
				: this.productData?.variants[0].prices[0];
		},
		quantityInCart() {
			return this.quantifiedCartItemsList
				.find((item) => item.product.variants[0].id === this.selectedVariant.variants[0].id)?.quantity || 0;
		},
		totalQuantitySelected() {
			if (!this.isCartVisible) {
				return this.selectedQuantity;
			}

			return this.selectedQuantity + this.quantityInCart;
		},
		isStockAvailable() {
			if (this.selectedVariant.variants[0].manage_inventory) {
				return this.totalQuantitySelected < this.getVariantQuantity(this.selectedVariant.variants[0].id);
			}

			return true;
		},
		selectedVariant: {
			get() {
				if (this.selectVariant) {
					return this.selectVariant;
				}

				if (this.productData) {
					if (this.productData[SITE_PRODUCT_SELECTION] === SITE_PRODUCT_SELECTION_TYPE_LOWEST) {
					//  preselects first lowest price variant from the list
						const preselectedVariant = this.productData.variants.reduce((acc, curr) => {
							const accPrice = acc.prices[0].sale_amount || acc.prices[0].amount;
							const currPrice = curr.prices[0].sale_amount || curr.prices[0].amount;

							return accPrice < currPrice ? acc : curr;
						});

						const uniqueOptionValues = this.uniqueOptionSelections.map(
							(item) => Object.values(item).find(
								(opt) => preselectedVariant.options.some((opt2) => opt2.value === opt.value),
							),
						);

						preselectedVariant.options = [...uniqueOptionValues];

						return this.getProductWithSelectedVariant(preselectedVariant);
					}

					// this preselects the matching variant by the default options (uniqueOptionSelections) inside option selects
					const preselectedVariant = this.productData.variants
						.find((variant) => variant.options
							.every((option) => this.uniqueOptionSelections
								.some((selection) => selection[0].value === option.value)));

					return this.getProductWithSelectedVariant(preselectedVariant || this.productData.variants[0]);
				}

				return null;
			},
			set(value) {
				this.selectVariant = value;
			},
		},
		computedStyles() {
			return {
				...objectToCssVariables({
					...this.textColorVars,
					...this.blockButtonStyle,
				}),
			};
		},
		showPrice() {
			return !this.productData?.options.length || (this.productData?.options.length && this.selectedVariant);
		},
		isAddToCartDisabled() {
			return this.isBookingProductInCart || !this.canAddToCart(this.productData?.id, this.selectedVariant?.variants[0].id);
		},
		buttonText() {
			if (this.isBookingProductInCart) {
				return `\u2713 ${this.translations.booked}`;
			}

			return this.blockButtonText || this.translations?.addToBag || 'Add to bag';
		},
		isProductTypeBooking() {
			return this.productData?.type.value === PRODUCT_TYPE_BOOKING;
		},
		location() {
			return this.productData?.variants[0].booking_event?.location;
		},
		formattedBookingDuration() {
			return getFormattedBookingDuration(this.productData, this.translations);
		},
		isBookingProductInCart() {
			return this.isProductTypeBooking && this.shoppingCartItems?.some((item) => item.id === this.productData?.id);
		},
		uniqueOptionSelections() {
			if (!this.productData.options.length) {
				return [];
			}

			return this.productData.options.map((option) => ({
				...option.values
					.filter((selection, index, self) => self.findIndex((selectionTwo) => selectionTwo.value === selection.value) === index),
			}));
		},
		isOutOfStock() {
			return this.selectedVariant.variants[0].manage_inventory
				&& this.getVariantQuantity(this.selectedVariant.variants[0].id) === 0;
		},
		isStockInfoShown() {
			return !!this.selectedVariant.variants[0].manage_inventory;
		},
		productPagePath() {
			if (!this.productPages) {
				return '/';
			}

			const productPage = Object.values(this.productPages).find((page) => page.productId === this.productData.id);

			if (!productPage) {
				return '/';
			}

			return `/${productPage.slug}`;
		},
		stockInfoText() {
			const quantity = this.getVariantQuantity(this.selectedVariant.variants[0].id);

			if (this.isOutOfStock || this.quantityInCart === quantity) {
				return this.translations.outOfStock;
			}

			const prefix = quantity <= MAX_STOCK_AMOUNT_TO_SHOW ? quantity : `${MAX_STOCK_AMOUNT_TO_SHOW}+`;

			return `${prefix} ${this.translations.inStock} `;
		},
	},
	watch: {
		selectedVariant: {
			handler(newValue, oldValue) {
				if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
					if (newValue.variants[0].image_url) {
						this.variantImage = newValue.variants[0].image_url;
					}
				}
			},
			immediate: true,
		},
		shoppingCartItems: {
			handler(newValue) {
				const itemCount = newValue?.length || 0;

				this.selectedQuantity = DEFAULT_PICKER_VALUE;
				this.isLimitReached = (itemCount + this.selectedQuantity) >= MAX_PRODUCTS_IN_CART;
			},
			immediate: true,
		},
	},
	methods: {
		formatPrice,
		isProductPriceRangeShown,
		handleButtonClick() {
			const productForShoppingCart = new Array(this.selectedQuantity).fill(this.selectedVariant);

			this.selectedQuantity = DEFAULT_PICKER_VALUE;

			this.$emit('buy-button-click', productForShoppingCart);
		},
		handleVariantOptionChange(id) {
			this.selectedQuantity = DEFAULT_PICKER_VALUE;

			const optionSelection = this.productData.options.map(
				(option) => option.values.find((optionValue) => optionValue.id === id),
			).find((item) => item);

			const remainingVariantOptions = this.selectedVariant.variants[0].options
				.filter((option) => option.option_id !== optionSelection.option_id);

			const allVariantOptions = [
				...remainingVariantOptions,
				optionSelection,
			];

			// find correct variant with the same option values
			const matchedVariant = this.productData.variants.find((variant) => variant.options
				.every((option) => allVariantOptions
					.some((value) => value.value === option.value && value.option_id === option.option_id)));

			if (matchedVariant) {
				this.selectedVariant = this.getProductWithSelectedVariant(matchedVariant);
			}
		},
		getProductWithSelectedVariant(variant) {
			return {
				...this.productData,
				variants: [variant],
			};
		},
		handleQuantityChange(value) {
			const isQuantityTracked = this.selectedVariant.variants[0].manage_inventory;

			this.isLimitReached = (this.shoppingCartItems.length + value) >= MAX_PRODUCTS_IN_CART;

			if (isQuantityTracked) {
				const maxQuantity = this.getVariantQuantity(this.selectedVariant.variants[0].id);

				if ((this.quantityInCart + value) > (maxQuantity || this.isLimitReached)) {
					// limit is the smaller value - either available stock amount or available cart amount
					const limit = Math.min(maxQuantity - this.quantityInCart, MAX_PRODUCTS_IN_CART - this.shoppingCartItems.length);

					this.selectedQuantity = limit;

					return;
				}
			} else if (this.isLimitReached) {
				this.selectedQuantity = MAX_PRODUCTS_IN_CART - this.shoppingCartItems.length;

				return;
			}

			if (value <= 0) {
				this.selectedQuantity = DEFAULT_PICKER_VALUE;

				return;
			}

			this.selectedQuantity = value;
		},
		getVariantQuantity(variantId) {
			return this.variantsQuantity.find((variant) => variant.id === variantId)?.inventory_quantity || 0;
		},
		selectedOption(index) {
			const optionValue = this.selectedVariant.variants[0].options.find(
				(selectedOption) => selectedOption.option_id === this.uniqueOptionSelections[index][0].option_id,
			);

			return Object.values(this.uniqueOptionSelections[index]).find((option) => optionValue.value === option.value).id;
		},
	},
});
</script>

<style lang="scss">
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/mixins/font-style";
@import "@zyro-inc/site-modules/components/blocks/ecommerce/-partials/shared";
@include font-style("h3", ".block-product__title", ".block-product");
@include font-style("h5", ".block-product__subtitle", ".block-product");
@include font-style("body", "p,.block-product__option-select-wrapper", ".block-product");
@include font-style("body-large", ".body-large", ".block-product");

.block-product-wrapper {
	z-index: $z-index-site-engine-block-grid;
	padding: var(--block-padding);
}

.block-product {
	$this: &;

	display: flex;
	justify-content: center;
	width: 100%;
	max-width: var(--content-width);
	margin: 0 auto;
	text-align: left;

	&--centered {
		text-align: center;

		#{$this}__content-wrapper,
		#{$this}__price-data-wrapper,
		#{$this}__button-wrapper {
			align-items: center;
			text-align: center;
		}
	}

	&--in-preview {
		min-height: 500px;
		max-height: 700px;

		#{$this}__content-wrapper {
			justify-content: flex-start;
			padding-left: 32px;
		}

		#{$this}__price-data-wrapper {
			justify-content: flex-start;
			overflow: auto;
		}
	}

	&__stock-text {
		display: flex;
		align-items: center;
		margin-left: 24px;
	}

	&__content-wrapper,
	&__price-data-wrapper {
		display: flex;
		flex-direction: column;
		align-items: baseline;
		justify-content: center;
		width: 100%;
	}

	&__content-wrapper {
		max-width: 624px;
		padding-left: 80px;
		word-break: break-word;
	}

	&__button-wrapper {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		width: 100%;
		margin-top: 32px;
	}

	&__button {
		position: relative;
		display: flex;
		align-items: center;
		height: var(--button-height);

		&--primary {
			margin: calc(-1 * var(--grid-button-primary-border-null, var(--grid-button-primary-border-width, 0)));

			&:focus,
			&:hover {
				margin: calc(-1 * var(--grid-button-primary-border-null-hover, var(--grid-button-primary-border-width-hover, 0)));
			}
		}

		&--secondary {
			margin: calc(-1 * var(--grid-button-secondary-border-null, var(--grid-button-secondary-border-width, 0)));

			&:focus,
			&:hover {
				margin: calc(-1 * var(--grid-button-secondary-border-null-hover, var(--grid-button-secondary-border-width-hover, 0)));
			}
		}
	}

	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		margin-bottom: 16px;
	}

	&__price-wrapper {
		display: flex;
		flex-wrap: wrap;

		&--with-duration {
			margin-bottom: 8px;
		}
	}

	&__additional-info {
		display: flex;
	}

	&__price {
		margin-bottom: 0;

		&--sale {
			margin-right: 8px;
			opacity: 0.4;

			&#{&} {
				text-decoration: line-through;
			}
		}
	}

	&__duration {
		&::before {
			margin: 0 8px;
			content: "|";
		}
	}

	&__location,
	&__notice {
		opacity: 0.6;
	}

	&__option-select-wrapper {
		width: 100%;
		margin-top: 32px;
	}

	&__option-select {
		&:not(:last-child) {
			margin-bottom: 24px;
		}

		&--centered {
			margin-right: auto;
			margin-left: auto;
		}
	}

	&__quantity-wrapper {
		display: flex;
		margin-top: 32px;

		&--disabled {
			pointer-events: none;
			filter: opacity(0.4);
		}
	}

	&__notice {
		margin-top: 8px;
		margin-bottom: 32px;
		font-size: 14px;
	}

	&__link {
		margin-top: 32px;

		&#{&} {
			text-decoration: underline;
		}
	}

	&__description {
		width: 100%;
		margin-top: 56px;
		word-break: break-word;
		white-space: pre-line;

		blockquote {
			position: relative;
			display: flex;
			font-style: italic;

			&::before {
				margin-right: 0.3em;
				font-size: 4em;
				line-height: 1em;
				content: open-quote;
			}

			&::after {
				visibility: hidden;
				content: close-quote;
			}
		}

		p:empty::after {
			content: "\00A0";
		}

		ul,
		ol {
			padding-left: 1em;
			list-style-position: inside;

			p {
				display: inline;
			}
		}
	}
}

@include site-engine-mobile {
	.block-product-wrapper {
		padding: var(--m-block-padding);
	}

	.block-product {
		flex-direction: column;
		width: 100%;

		&--centered {
			align-items: center;
		}

		&__content-wrapper {
			max-width: unset;
			padding: 32px 0 0;
		}
	}
}

.v-enter-active,
.v-leave-active {
	transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
