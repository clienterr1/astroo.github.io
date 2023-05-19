<template>
	<div class="ecommerce-tab-quantity">
		<ZyroFieldToggle
			id="enableQuantityPicker"
			v-qa="`editproductlist-tablayout-enablequantitypicker-${isQuantityPickerEnabled}`"
			class="ecommerce-tab-quantity__controls"
			:label="$t('builder.enableQuantityPicker')"
			:model-value="isQuantityPickerEnabled"
			@update:model-value="updateIsQuantityPickerEnabled"
		/>
	</div>
</template>

<script>
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

export default {
	components: {
		ZyroFieldToggle,
	},
	data() {
		return {
			initialCurrentBlockData: null,
		};
	},
	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockStyles',
		]),
		isQuantityPickerEnabled() {
			return this.currentBlock.isQuantityPickerEnabled ?? true;
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

		updateIsQuantityPickerEnabled(isEnabled) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					isQuantityPickerEnabled: isEnabled,
				},
				merge: true,
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.ecommerce-tab-quantity {
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
