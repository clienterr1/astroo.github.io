<template>
	<div class="ecommerce-tab-layout">
		<ZyroLabel>{{ $t('builder.ecommerceProductListProductDisplay') }}</ZyroLabel>
		<ZyroIconSelect
			:model-value="textAlignment"
			:options="textAlignmentOptions"
			:items-per-row="3"
			icon-container-padding="12px 20px"
			class="ecommerce-tab-layout__text-alignment"
			group-name="text-alignment"
			active-icon-color="var(--color-azure)"
			active-background-color="var(--color-azure-lighter)"
			@update:model-value="updateTextAlignment"
		/>
		<ZyroFieldRange
			:model-value="columnCount"
			:min="COLUMN_COUNT_2"
			:max="COLUMN_COUNT_6"
			:label="$t('common.columns')"
			units=""
			has-number-input
			class="ecommerce-tab-layout__controls"
			@update:model-value="updateColumnCount"
		/>
		<EditBlockPadding />
	</div>
</template>

<script>
import ZyroFieldRange from '@/components/global/ZyroFieldRange.vue';
import ZyroIconSelect from '@/components/global/ZyroIconSelect.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import EditBlockPadding from '@/components/builder-controls/reusable-controls/block/EditBlockPadding.vue';

import {
	COLUMN_COUNT_6,
	COLUMN_COUNT_2,
} from '@zyro-inc/site-modules/components/blocks/ecommerce/utils';

import { defineComponent } from 'vue';

const MAX_PRODUCTS_PER_PAGE = 99;
const DEFAULT_COLUMN_COUNT = 3;

export default defineComponent({
	components: {
		ZyroFieldRange,
		ZyroIconSelect,
		ZyroLabel,
		EditBlockPadding,
	},

	data() {
		return {
			COLUMN_COUNT_6,
			COLUMN_COUNT_2,
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
		textAlignmentOptions() {
			return {
				left: {
					name: this.$t('common.left'),
					icon: 'text-layout-left',
					iconDimensions: '40px',
				},
				center: {
					name: this.$t('common.center'),
					icon: 'text-layout-center',
					iconDimensions: '40px',
				},
			};
		},
		columnCount() {
			return this.currentBlock.columnCount || DEFAULT_COLUMN_COUNT;
		},
		textAlignment() {
			return this.currentBlockStyles?.textAlign || 'left';
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

		updateTextAlignment(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							textAlign: newValue,
						},
					},
				},
				merge: true,
			});
		},
		updateColumnCount(newValue) {
			// OR needed for input field to display correct value
			let columnCount = Number.parseInt(newValue || DEFAULT_COLUMN_COUNT, 10);

			if (columnCount > COLUMN_COUNT_6) {
				columnCount = COLUMN_COUNT_6;
			} else if (columnCount < COLUMN_COUNT_2) {
				columnCount = COLUMN_COUNT_2;
			}

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					columnCount,
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-tab-layout {
	--select-background: #{$color-light};

	&__text-alignment {
		color: $color-gray;
	}

	&__controls {
		padding: 0;
		margin: 24px 0 12px;

		&:first-child {
			margin-top: 0;
		}

		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
