<template>
	<div class="ecommerce-tab-pagination">
		<ZyroFieldRange
			:model-value="productsPerPage"
			min="1"
			has-number-input
			class="ecommerce-tab-pagination__controls"
			:max="MAX_PRODUCTS_PER_PAGE"
			:label="$t('builder.ecommerceProductsPerPage')"
			units=""
			@update:model-value="updateProductsPerPage"
		/>
	</div>
</template>

<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import {
	COLUMN_COUNT_2,
	COLUMN_COUNT_4,
	productsPerPageByColumnCount,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';

const MAX_PRODUCTS_PER_PAGE = 50;

export default {
	components: {
		ZyroFieldRange,
	},
	data() {
		return {
			COLUMN_COUNT_4,
			MAX_PRODUCTS_PER_PAGE,
			initialCurrentBlockData: null,
		};
	},
	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockStyles',
		]),
		defaultProductsCount() {
			return productsPerPageByColumnCount[this.currentBlock.columnCount || COLUMN_COUNT_2];
		},
		productsPerPage() {
			return this.currentBlock.productsPerPage || this.defaultProductsCount;
		},
	},
	mounted() {
		this.blockId = this.currentBlockId;
		this.initialCurrentBlockData = cloneDeep(this.currentBlock);
	},
	beforeUnmount() {
		this.pushBlockDataToHistory(
			{
				blockId: this.blockId,
				initialBlockData: this.initialCurrentBlockData,
			},
		);
	},
	methods: {
		...mapActions([
			'updateBlockData',
			'pushBlockDataToHistory',
		]),

		updateIsPaginationEnabled(isEnabled) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					isPaginationEnabled: isEnabled,
				},
				merge: true,
			});
		},
		updateProductsPerPage(newValue) {
			const realValue = newValue > MAX_PRODUCTS_PER_PAGE ? MAX_PRODUCTS_PER_PAGE : newValue;

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					productsPerPage: Number.parseInt(realValue, 10),
				},
				merge: true,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.ecommerce-tab-pagination {
	&__controls {
		padding: 0;
		margin-top: 0;
		margin-bottom: 24px;

		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
