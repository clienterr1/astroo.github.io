<template>
	<div
		:id="blockId"
		class="block-product-list-wrapper"
		:style="computedStyles"
	>
		<ListSkeletonLoader
			v-if="isLoading"
			:column-count="columnCount"
		/>
		<div
			v-else-if="isProductListShown"
			ref="productList"
			class="block-product-list"
		>
			<div class="block-product-list__content">
				<RouterLink
					v-for="(product, index) in currentPageProducts"
					:key="`product-${index}-${product.id}`"
					:to="getItemProductPageTo(product.id)"
					class="block-product-list__link"
				>
					<ProductListItem
						:image="getProductImage(product)"
						:title="product.title"
						:ribbon="product.ribbon_text"
						:price="getSmallestProductPrice(product)"
						:is-centered="isCentered"
						:is-eager="isEager && index === 0"
						:duration="getFormattedBookingDuration(product, translations)"
						:image-max-width="imageWidth"
						:is-store-quantity-tracked="product.variants[0].manage_inventory"
						:is-price-range-shown="isProductPriceRangeShown(product)"
						:quantity="getFullProductQuantity(product)"
						:product-type="product.type.value"
						:translations="translations"
						:is-button-enabled="isButtonEnabled"
						:button-display="buttonDisplay"
						:button-text="buttonText"
						:button-style="buttonStyle"
						:button-type="buttonType"
						:button-border-width="buttonBorderWidth"
						:ribbon-style="ribbonStyle"
						:[DATA_ATTRIBUTE_ANIMATION_STATE]="isAnimationActive ? DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE : null"
						:site-id="siteId"
						@button-click="$emit('button-click', product)"
					/>
				</RouterLink>
			</div>
			<ZyroPagination
				:current-page="currentPage"
				:page-count="pageCount"
				class="block-product-list__pagination"
				color="var(--body-color)"
				@change-page="handlePageChange($event)"
			/>
		</div>
		<ProductListEmptyState
			v-else
			:text-color-vars="textColorVars"
			:empty-page-message="emptyPageMessage"
		/>
	</div>
</template>

<script>
import ListSkeletonLoader from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/ListSkeletonLoader.vue';
import ZyroPagination from '@zyro-inc/site-modules/components/ZyroPagination.vue';
import ProductListEmptyState from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/ProductListEmptyState.vue';
import ProductListItem from '@zyro-inc/site-modules/components/blocks/ecommerce/-partials/ProductListItem.vue';
import { objectToCssVariables } from '@zyro-inc/site-modules/utils/objectToCssVariables';
import { DEFAULT_ECOMMERCE_PRODUCT_CONTENT_WIDTH } from '@zyro-inc/site-modules/constants/defaultStyles';
import {
	getFormattedBookingDuration,
	isProductPriceRangeShown,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';
import {
	DATA_ATTRIBUTE_ANIMATION_STATE,
	DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
} from '@zyro-inc/site-modules/constants';
import {
	defineComponent,
	ref,
	onMounted,
	computed,
	onBeforeUnmount,
} from 'vue';

const GAP_SIZE = 24;

export default defineComponent({
	components: {
		ProductListItem,
		ProductListEmptyState,
		ZyroPagination,
		ListSkeletonLoader,
	},

	props: {
		blockId: {
			type: String,
			required: true,
		},
		products: {
			type: Array,
			default: () => ([]),
		},
		productPages: {
			type: Object,
			default: () => ({}),
		},
		blockStyle: {
			type: Object,
			default: () => ({}),
		},
		textColorVars: {
			type: Object,
			default: () => ({}),
		},
		isProductListShown: {
			type: Boolean,
			default: true,
		},
		isLoading: {
			type: Boolean,
			default: false,
		},
		isEager: {
			type: Boolean,
			default: false,
		},
		columnCount: {
			type: Number,
			default: 3,
		},
		productsPerPage: {
			type: Number,
			default: 9,
		},
		translations: {
			type: Object,
			default: () => ({}),
		},
		productIds: {
			type: Array,
			default: () => ([]),
		},
		productCategoryId: {
			type: String,
			default: '',
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
		ribbonStyle: {
			type: Object,
			default: () => ({}),
		},
		isProductListItemLinkDisabled: {
			type: Boolean,
			default: false,
		},
		siteId: {
			type: String,
			default: null,
		},
		variantsQuantity: {
			type: Array,
			default: () => [],
		},
	},

	setup(props, context) {
		const currentPage = ref(1);
		const blockStorePageQuery = computed(() => `store-page-${props.blockId}`);
		const pageCount = computed(() => Math.ceil(props.productIds.length / props.productsPerPage));
		const modifiedCurrentPage = computed(() => {
			if (currentPage.value > pageCount.value) {
				return pageCount.value;
			}

			return currentPage.value < 1 ? 1 : currentPage.value;
		});
		const startIndex = computed(() => (modifiedCurrentPage.value - 1) * props.productsPerPage);
		const endIndex = computed(() => startIndex.value + props.productsPerPage);
		const targetIds = computed(() => props.productIds.slice(startIndex.value, endIndex.value));
		const currentPageProducts = computed(() => {
			const productValues = Object.values(props.products);
			const displayedProducts = productValues.filter((product) => targetIds.value.includes(product.id));

			return displayedProducts.length ? displayedProducts : productValues.slice(startIndex.value, endIndex.value);
		});
		const emptyPageMessage = computed(() => props.translations.onlineStoreNoProducts || 'No publicly visible products');

		const handleBrowserNavigationPageChange = () => {
			const params = new URLSearchParams(window.location.search);
			const pageFromParams = Number.parseInt(params.get(blockStorePageQuery.value), 10) || 1;

			if (pageFromParams === currentPage.value) {
				return;
			}

			currentPage.value = pageFromParams;
		};

		onMounted(() => {
			const params = new URLSearchParams(window.location.search);

			const pageFromParams = Number.parseInt(params.get(blockStorePageQuery.value), 10) || 1;

			if (pageFromParams !== currentPage.value) {
				currentPage.value = pageFromParams;

				context.emit('page-changed', targetIds.value);
			}

			window.addEventListener('popstate', () => {
				handleBrowserNavigationPageChange();
			});
		});

		onBeforeUnmount(() => {
			window.removeEventListener('popstate', handleBrowserNavigationPageChange);
		});

		return {
			targetIds,
			pageCount,
			currentPage,
			blockStorePageQuery,
			currentPageProducts,
			emptyPageMessage,
		};
	},

	data() {
		return {
			DATA_ATTRIBUTE_ANIMATION_STATE,
			DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE,
			isAnimationActive: false,
		};
	},

	computed: {
		isCentered() {
			return this.blockStyle?.textAlign === 'center';
		},
		imageWidth() {
			const totalGapsWidth = (this.columnCount - 1) * GAP_SIZE;
			const listWidth = DEFAULT_ECOMMERCE_PRODUCT_CONTENT_WIDTH - totalGapsWidth;

			return Math.floor(listWidth / this.columnCount);
		},
		computedStyles() {
			return {
				'--image-max-width': `${this.imageWidth}px`,
				'--gap-size': `${GAP_SIZE}px`,
				...objectToCssVariables(this.textColorVars),
			};
		},
	},

	methods: {
		isProductPriceRangeShown,
		getFormattedBookingDuration,
		handlePageChange(page) {
			this.currentPage = page;

			this.$emit('page-changed', this.targetIds);
			this.isAnimationActive = true;

			this.$router.push({
				query: {
					[this.blockStorePageQuery]: this.currentPage,
				},
			}).then(() => {
				if (!document) {
					return;
				}

				// direct document.location.hash assignment triggers page scroll to provided id
				// because this is a property it retains the value after page scroll
				// so we need to reset it (set to empty string) so it won't interfere later
				document.location.hash = this.blockId;
				document.location.hash = '';
			});
		},
		getItemProductPage(productId) {
			return Object.values(this.productPages).find((page) => page.productId === productId);
		},
		getItemProductPageTo(productId) {
			if (this.isProductListItemLinkDisabled) {
				return {};
			}

			const productPage = this.getItemProductPage(productId);

			if (!productPage) {
				return {
					path: '/',
				};
			}

			return {
				path: `/${productPage.slug}`,
			};
		},
		getFullProductQuantity(product) {
			return product.variants.reduce((acc, curr) => acc
			+ (this.variantsQuantity.find((variant) => variant.id === curr.id)?.inventory_quantity || 0), 0);
		},
		getSmallestPriceVariant(product) {
			return product.variants.reduce((acc, curr) => {
				const accPrice = acc.prices[0].sale_amount || acc.prices[0].amount;
				const currPrice = curr.prices[0].sale_amount || curr.prices[0].amount;

				return accPrice < currPrice ? acc : curr;
			});
		},
		getSmallestProductPrice(product) {
			return isProductPriceRangeShown(product) ? this.getSmallestPriceVariant(product).prices[0] : product.variants[0].prices[0];
		},
		getProductImage(product) {
			if (!isProductPriceRangeShown(product)) {
				return product.thumbnail;
			}

			return this.getSmallestPriceVariant(product).image_url || product.thumbnail;
		},
	},
});
</script>

<style lang="scss" scoped>
@mixin product-list-mobile {
	.block-product-list-wrapper {
		padding: var(--m-block-padding);
	}

	.block-product-list {
		&__content {
			grid-template-columns: 1fr;
		}
	}
}

.block-product-list-wrapper {
	z-index: $z-index-site-engine-block-grid;
	display: flex;
	justify-content: center;
	padding: var(--block-padding);
}

.block-product-list {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;

	&__link {
		text-decoration: none;
	}

	&__content {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--image-max-width), 1fr));
		gap: var(--gap-size);
		width: 100%;
		max-width: var(--content-width);
	}

	&__pagination {
		margin-top: 16px;
	}
}

.zyro-mb-preview {
	@include product-list-mobile;
}

@media screen and (max-width: 700px) {
	@include product-list-mobile;
}

</style>
