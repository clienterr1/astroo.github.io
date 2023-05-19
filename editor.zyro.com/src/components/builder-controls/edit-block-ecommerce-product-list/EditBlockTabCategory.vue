<template>
	<div class="ecommerce-tab-category">
		<ZyroDropdown
			:model-value="productCategory"
			:options="categoryList"
			value-to-match-checked="id"
			color="light"
			:label="$t('builder.ecommerceProductListCategorySelect')"
			@update:model-value="updateProductCategory"
		/>
	</div>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';
import { getFilteredProductsByCategoryId } from '@/utils/ecommerce';

export default defineComponent({
	components: {
		ZyroDropdown,
	},

	data() {
		return {
			categoryList: [],
			blockId: '',
			initialCurrentBlockData: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters('ecommerce', [
			'categories',
			'products',
		]),
		...mapGetters([
			'siteMeta',
			'currentBlock',
		]),
		productCategory() {
			return this.categories.find(({ id }) => id === this.currentBlock.productCategoryId) || this.defaultCategory;
		},
		defaultCategory() {
			return {
				id: '',
				title: this.$t('builder.ecommerceProductListCategoryAllProducts'),
			};
		},
	},

	created() {
		this.loadCategories();
	},

	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},

	beforeUnmount() {
		this.createSnapshot();
	},

	methods: {
		...mapActions('ecommerce', ['getCategories']),
		...mapActions(['updateBlockData']),
		...mapActions('undoRedo', ['createSnapshot']),

		async loadCategories() {
			await this.getCategories();

			const sortedCategories = this.categories.sort((a, b) => a.title.localeCompare(b.title));

			this.categoryList = [
				this.defaultCategory,
				...sortedCategories,
			];

			if (!this.productCategory?.id) {
				this.productCategory = this.defaultCategory;
			}
		},
		updateProductCategory(newValue) {
			const filteredProducts = !newValue.id
				? this.products.sort((a, b) => a.title.localeCompare(b.title))
				: getFilteredProductsByCategoryId(this.products, newValue.id);

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					productCategoryId: newValue.id,
					productIds: filteredProducts.map((product) => product.id),
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-tab-category {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
</style>
