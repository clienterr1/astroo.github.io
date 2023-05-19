<template>
	<div class="ecommerce-tab">
		<DemoJoinZyroInlineDisclaimer
			v-if="isDemoMode"
			:text="$t('builder.demoBuilderChooseBuilderToAddProducts')"
		/>
		<NoProducts v-else-if="!products.length" />
		<template v-else>
			<ZyroLabel class="ecommerce-tab__label">
				{{ $t('builder.editButton.ecommerce.connectButtonTo') }}
			</ZyroLabel>
			<ZyroDropdown
				:model-value="selectedProduct"
				value-to-match-checked="id"
				:options="productSelectOptions"
				class="ecommerce-tab__dropdown"
				option-prefix-key="sku"
				@update:model-value="updateSelectedProduct"
			/>
			<template v-if="isVariantSelectVisible">
				<ZyroLabel class="ecommerce-tab__label">
					{{ $t('builder.editButton.ecommerce.productOption') }}:
				</ZyroLabel>
				<ZyroDropdown
					:model-value="selectedVariant"
					value-to-match-checked="title"
					:options="selectedProduct.variants"
					class="ecommerce-tab__dropdown"
					option-prefix-key="sku"
					@update:model-value="updateSelectedVariant"
				/>
			</template>
			<ZyroButton
				v-if="isProductIdValid"
				color="black"
				theme="outline"
				class="ecommerce-tab__edit-button"
				data-qa="ecommerce-settings-button-editthisproduct"
				@click="handleButtonClick"
			>
				{{ $t('builder.editButton.ecommerce.editProduct') }}
			</ZyroButton>
		</template>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import EventLogApi from '@/api/EventLogApi';
import NoProducts from '@/components/builder-controls/edit-button/EcommerceNoProducts.vue';
import { useI18n } from 'vue-i18n';
import { useRedirects } from '@/use/useRedirects';
import DemoJoinZyroInlineDisclaimer from '@/components/reusable-components/DemoJoinZyroInlineDisclaimer.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroDropdown,
		ZyroLabel,
		NoProducts,
		DemoJoinZyroInlineDisclaimer,
	},

	setup() {
		const { redirectToEcommerceProductsEdit } = useRedirects();
		const { t } = useI18n();

		const DEFAULT_DROPDOWN_FIELD = {
			id: -1,
			title: t('builder.ecommerce.chooseProduct'),
		};

		return {
			DEFAULT_DROPDOWN_FIELD,
			redirectToEcommerceProductsEdit,
		};
	},

	computed: {
		...mapState(['isDemoMode']),
		...mapGetters('ecommerce', ['products']),
		...mapGetters([
			'siteMeta',
			'currentElementSettings',
		]),
		isProductIdValid() {
			return this.selectedProduct.id !== -1;
		},
		isVariantSelectVisible() {
			return this.isProductIdValid ? !!this.selectedProduct.options.length : false;
		},
		product() {
			const { productId } = this.currentElementSettings;

			return this.products.find((product) => product.id === productId);
		},
		variant() {
			const { productVariantId } = this.currentElementSettings;

			return this.product.variants.find((variant) => variant.id === productVariantId);
		},
		productSelectOptions() {
			return this.products.map((product) => {
				const [firstVariant] = product.variants;

				return {
					id: product.id,
					title: product.title,
					defaultVariantId: firstVariant.id,
					sku: !product.options.length ? firstVariant.sku : null,
				};
			});
		},
		selectedProduct() {
			return this.product || this.DEFAULT_DROPDOWN_FIELD;
		},
		selectedVariant() {
			return this.variant || this.DEFAULT_DROPDOWN_FIELD;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		async handleButtonClick() {
			if (isHostingerBrand) {
				await EventLogApi.logEvent({
					eventName: 'website_builder.ecomm_products.edit',
					eventProperties: {
						location: 'button',
					},
					isHostingerEvent: true,
				});
			} else {
				await EventLogApi.logEvent({
					eventName: 'builder.buy_button.edit_product',
				});
			}

			this.redirectToEcommerceProductsEdit(this.selectedProduct.id);
		},
		updateSelectedProduct(product) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						productId: product.id,
						productVariantId: product.defaultVariantId,
					},
				},
			});

			EventLogApi.logEvent({
				eventName: 'builder.buy_button.product_picked',
			});
		},
		updateSelectedVariant(variant) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						productVariantId: variant.id,
					},
				},
			});
		},
	},
});
</script>
<style lang="scss" scoped>
.ecommerce-tab {
	display: flex;
	flex-direction: column;

	&__edit-button {
		margin: 40px auto 26px;
	}
}
</style>
