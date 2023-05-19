<template>
	<div class="ecommerce-tab-product">
		<NoProducts v-if="!products.length" />
		<div
			v-else
			class="ecommerce-tab-product__content"
		>
			<template v-if="!isBlockInEcommerceProductPage(blockId)">
				<ZyroLabel>
					{{ $t('builder.editButton.ecommerce.connectButtonTo') }}
				</ZyroLabel>
				<ZyroDropdown
					value-to-match-checked="id"
					:options="products"
					:model-value="product"
					color="light"
					class="ecommerce-tab-product__dropdown"
					option-prefix-key="sku"
					@update:model-value="handleProductSelect"
				/>
			</template>
			<ZyroButton
				v-if="isProductIdValid && !isDemoMode"
				v-qa="'product-tab-product-edit-button'"
				color="black"
				theme="outline"
				class="ecommerce-tab-product__edit-button"
				@click="handleButtonClick(product.id)"
			>
				{{ $t('builder.editButton.ecommerce.editProduct') }}
			</ZyroButton>
		</div>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapGetters,
	mapState,
	mapActions,
} from 'vuex';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import NoProducts from '@/components/builder-controls/edit-button/EcommerceNoProducts.vue';
import { useI18n } from 'vue-i18n';
import { useRedirects } from '@/use/useRedirects';
import EventLogApi from '@/api/EventLogApi';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroDropdown,
		ZyroLabel,
		NoProducts,
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

	data() {
		return {
			blockId: '',
		};
	},

	computed: {
		...mapState([
			'currentBlockId',
			'isDemoMode',
		]),
		...mapGetters([
			'siteMeta',
			'currentBlock',
		]),
		...mapGetters('ecommerce', [
			'isBlockInEcommerceProductPage',
			'products',
		]),
		isProductIdValid() {
			return this.product.id !== -1;
		},
		product() {
			const { product } = this.currentBlock;
			const assignedProduct = this.products.find(({ id }) => id === product.id);

			return assignedProduct || this.DEFAULT_DROPDOWN_FIELD;
		},
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),

		handleProductSelect(product) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					product: {
						id: product.id,
					},
				},
				merge: true,
			});
		},
		async handleButtonClick(productId) {
			await EventLogApi.logEvent({
				eventName: 'website_builder.ecomm_products.edit',
				eventProperties: {
					location: 'section',
				},
				isHostingerEvent: isHostingerBrand,
			});

			this.redirectToEcommerceProductsEdit(productId);
		},
	},
});
</script>
<style lang="scss" scoped>
.ecommerce-tab-product {
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	&__content {
		display: flex;
		flex-direction: column;
	}

	&__dropdown {
		margin-bottom: 24px;
	}

	&__edit-button {
		margin: 0 auto;
	}
}
</style>
