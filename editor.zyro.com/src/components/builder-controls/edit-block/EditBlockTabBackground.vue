<template>
	<div>
		<slot name="top" />
		<ZyroBackground
			:model-value="background"
			:use-color-picker-v2="isCurrentBlockTypeEcommerce"
			:is-segment-control-background-dark="isCurrentBlockTypeEcommerce"
			@update:model-value="updateBackgroundValue"
		/>
		<ZyroFieldToggle
			v-if="background.current === 'image'"
			id="backgroundAttachment"
			:label="$t('common.fixedBackground')"
			:model-value="backgroundAttachment === 'fixed'"
			@update:model-value="handleAttachmentToggle"
		/>
	</div>
</template>

<script>
import ZyroBackground from '@/components/global/ZyroBackground.vue';
import ZyroFieldToggle from '@/components/global/ZyroFieldToggle.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroBackground,
		ZyroFieldToggle,
	},

	data() {
		return {
			blockId: '',
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlock']),
		background() {
			const { background } = this.currentBlock;
			const defaultBackground = {
				color: 'rgb(255, 255, 255)',
				current: 'color',
			};

			return background?.current ? background : defaultBackground;
		},
		backgroundAttachment: {
			get() {
				return this.currentBlock?.attachment || 'unset';
			},
			set(newValue) {
				this.updateBlockData({
					blockId: this.blockId,
					blockData: {
						attachment: newValue,
					},
					merge: true,
				});
			},
		},
		isCurrentBlockTypeEcommerce() {
			return [
				'BlockEcommerceProduct',
				'BlockEcommerceProductList',
			].includes(this.currentBlock.type);
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
		handleAttachmentToggle(isChecked) {
			this.backgroundAttachment = isChecked ? 'fixed' : 'unset';
		},
		updateBackgroundValue(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					background: newValue,
				},
				merge: true,
			});
		},
	},
});
</script>
