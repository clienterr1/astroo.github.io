<template>
	<div
		class="product-list-item"
		:class="{ 'product-list-item--centered': isCentered }"
		:style="computedStyles"
		:[DATA_ATTRIBUTE_ANIMATION_ROLE]="DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT"
	>
		<div class="product-list-item__content">
			<div class="product-list-item__image-wrapper">
				<ProductImage
					v-if="image"
					:src="image"
					:alt="title"
					class="product-list-item__image"
					:is-eager="isEager"
					:width="imageMaxWidth"
					:height="imageMaxWidth"
					:site-id="siteId"
					enable-srcset
					:is-lossless="true"
				/>
				<ProductImagePlaceholder
					v-else
					class="product-list-item__image"
				/>
				<ProductRibbon
					v-if="ribbon"
					:text="ribbon"
					:ribbon-style="ribbonStyle"
				/>
			</div>
			<h6
				v-qa="'product-list-section-item-title'"
				class="product-list-item__title"
			>
				{{ title }}
			</h6>
			<div class="product-list-item__price-wrapper">
				<template v-if="isInStock">
					<p>
						<span
							v-if="isPriceRangeShown && !price.sale_amount"
							class="product-list-item__price-range"
						>
							{{ translations.from }}
						</span>
						<span :class="{ 'product-list-item__price': price.sale_amount }">
							{{ formatPrice(price.amount, price.currency) }}
						</span>
					</p>
					<p
						v-if="price.sale_amount"
						class="product-list-item__price-content"
					>
						<template v-if="isPriceRangeShown">
							{{ translations.from }}
						</template>
						{{ formatPrice(price.sale_amount, price.currency) }}
					</p>
					<p
						v-if="productType === PRODUCT_TYPE_BOOKING"
						class="product-list-item__duration"
					>
						{{ duration }}
					</p>
				</template>
				<p
					v-else
					class="product-list-item__text"
				>
					{{ translations.soldOut }}
				</p>
			</div>
		</div>
		<div
			v-if="isButtonEnabled"
			class="product-list-item__button-wrapper"
			:class="{
				'product-list-item__button-wrapper--hidden': !isInStock,
				'product-list-item__button-wrapper--with-hover': buttonDisplay === 'hover'
			}"
			@click.native.prevent.stop
		>
			<GridButton
				v-qa="`productlistsection-btn-addtobag`"
				:type="buttonType"
				:content="blockButtonText"
				class="product-list-item__button"
				:class="`product-list-item__button--${buttonType}`"
				tag-name="button"
				:border-width="buttonBorderWidth"
				:border-color="buttonBorderColor.normal"
				:border-color-hover="buttonBorderColor.hover"
				@click="$emit('button-click')"
			/>
		</div>
	</div>
</template>

<script>
import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { PRODUCT_TYPE_BOOKING } from '@zyro-inc/site-modules/constants/ecommerce';
import formatPrice from '@zyro-inc/site-modules/utils/ecommerce/priceFormatter';
import ProductImage from '@zyro-inc/site-modules/components/ecommerce/ProductImage.vue';
import ProductImagePlaceholder from '@zyro-inc/site-modules/components/ecommerce/-partials/ProductImagePlaceholder.vue';
import ProductRibbon from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/ProductRibbon.vue';
import { defineComponent } from 'vue';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import {
	DATA_ATTRIBUTE_ANIMATION_ROLE,
	DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
} from '@zyro-inc/site-modules/constants';

export default defineComponent({
	components: {
		ProductImage,
		ProductImagePlaceholder,
		GridButton,
		ProductRibbon,
	},

	props: {
		image: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Object,
			required: true,
		},
		isCentered: {
			type: Boolean,
			default: false,
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		imageMaxWidth: {
			type: Number,
			required: true,
		},
		duration: {
			type: String,
			required: true,
		},
		productType: {
			type: String,
			default: '',
		},
		translations: {
			type: Object,
			default: () => ({}),
		},
		isStoreQuantityTracked: {
			type: Boolean,
			default: false,
		},
		quantity: {
			type: Number,
			default: 0,
		},
		isButtonEnabled: {
			type: Boolean,
			default: false,
		},
		buttonDisplay: {
			type: String,
			default: '',
		},
		buttonText: {
			type: String,
			default: null,
		},
		buttonStyle: {
			type: Object,
			default: () => ({}),
		},
		buttonType: {
			type: String,
			default: 'primary',
		},
		buttonBorderWidth: {
			type: Number,
			default: 0,
		},
		isPriceRangeShown: {
			type: Boolean,
			default: false,
		},
		ribbon: {
			type: String,
			default: '',
		},
		ribbonStyle: {
			type: Object,
			default: () => ({}),
		},
		siteId: {
			type: String,
			default: null,
		},
	},

	data() {
		return {
			PRODUCT_TYPE_BOOKING,
			DATA_ATTRIBUTE_ANIMATION_ROLE,
			DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT,
		};
	},

	computed: {
		isInStock() {
			return !this.isStoreQuantityTracked || this.quantity > 0;
		},
		blockButtonText() {
			return this.buttonText || this.translations?.addToBag || 'Add to bag';
		},
		buttonBorderColor() {
			return {
				normal: this.buttonStyle[`grid-button-${this.buttonType}-border-color`],
				hover: this.buttonStyle[`grid-button-${this.buttonType}-border-color-hover`],
			};
		},
		computedStyles() {
			return {
				...objectToCssVariables(this.buttonStyle),
			};
		},
	},

	methods: {
		formatPrice,
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";
@import "@zyro-inc/site-modules/scss/mixins/font-style";
@import "@zyro-inc/site-modules/components/blocks/ecommerce/-partials/shared";
@include font-style("h6", "h6", ".product-list-item");
@include font-style("body", "p", ".product-list-item");

.product-list-item {
	$this: &;

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	cursor: pointer;

	&--centered {
		align-items: center;
		text-align: center;

		#{$this}__price-wrapper, #{$this}__button-wrapper {
			justify-content: center;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	&__image-wrapper {
		position: relative;
		display: flex;
		width: 100%;

		// variable defined on parent element
		height: var(--image-max-width);
		padding-bottom: 100%;
		overflow: hidden;
		transition: height 0.2s ease-in;
	}

	&__image {
		position: absolute;
		width: 100%;
		height: 100%;
		transition: filter 0.3s ease-in-out;
		object-fit: cover;
		object-position: center;
	}

	&__title {
		margin: 20px 0 8px;
	}

	&__price-wrapper {
		display: flex;
	}

	&__price-content {
		display: flex;
	}

	&__price {
		margin-right: 8px;
		opacity: 0.4;

		&#{&} {
			text-decoration: line-through;
		}
	}

	&__price-range {
		margin-right: 4px;
	}

	&__text {
		&#{&} {
			text-transform: uppercase;
		}

		opacity: 0.6;
	}

	&__duration {
		&::before {
			margin: 0 8px;
			content: "|";
		}
	}

	&__button-wrapper {
		display: flex;
		width: 100%;
		margin-top: 8px;
		transition: opacity 0.3s ease-in;

		&--hidden {
			pointer-events: none;
			visibility: hidden;
		}

		&--with-hover {
			opacity: 0;
		}
	}

	&__button {
		position: relative;
		display: flex;
		align-items: center;
		height: var(--button-height);
		white-space: break-spaces;

		&--primary {
			margin: calc(-1 * var(--grid-button-primary-border-null, var(--grid-button-primary-border-width, 0px)));
			background-color: var(--grid-button-primary-background-color);

			&:focus,
			&:hover {
				margin: calc(-1 * var(--grid-button-primary-border-null-hover, var(--grid-button-primary-border-width-hover, 0px)));
				background-color: var(--grid-button-primary-background-color-hover, var(--grid-button-primary-background-color));
			}
		}

		&--secondary {
			margin: calc(-1 * var(--grid-button-secondary-border-null, var(--grid-button-secondary-border-width, 0px)));
			background-color: var(--grid-button-secondary-background-color);

			&:focus,
			&:hover {
				margin: calc(-1 * var(--grid-button-secondary-border-null-hover, var(--grid-button-secondary-border-width-hover, 0px)));
				background-color: var(--grid-button-secondary-background-color-hover, var(--grid-button-secondary-background-color));
			}
		}
	}
}

@include site-engine-mobile {
	.product-list-item {
		&__image-wrapper {
			height: 100%;
		}

		&__button-wrapper {
			pointer-events: none;

			&--with-hover {
				opacity: 1;
			}
		}
	}
}

@media screen and (min-width: $media-mobile) {
	.product-list-item {
		$this: &;

		&:hover,
		&:focus {
			#{$this}__image {
				filter: brightness(0.7);
			}

			#{$this}__button-wrapper {
				opacity: 1;
			}
		}
	}
}

</style>
