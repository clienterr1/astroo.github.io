<template>
	<div class="layout">
		<ZyroLabel>
			{{ $t('builder.editButton.tabLayoutLabel') }}
		</ZyroLabel>
		<AlignmentControls :style-property="$options.TEXT_ALIGN_PROPERTY" />
		<ZyroLabel>
			{{ $t('builder.editBlockTabLayout.controlRangeLabel') }}
		</ZyroLabel>
		<ZyroCssShorthandControlRange
			:model-value="verticalPadding"
			units="px"
			bold
			qa="editblogheader-tablayout-verticalpadding"
			@update:model-value="updateVerticalPadding"
		/>
		<ZyroCssShorthandControlRange
			v-if="isMobileMode"
			:model-value="horizontalPadding"
			:change-vertical="false"
			:max-range="48"
			units="px"
			bold
			qa="editblogheader-tablayout-horizontalpadding"
			@update:model-value="updateHorizontalPadding"
		/>
	</div>
</template>

<script>
import ZyroCssShorthandControlRange from '@/components/global/ZyroCssShorthandControlRange.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import AlignmentControls, { TEXT_ALIGN_PROPERTY } from '@/components/builder-controls/reusable-controls/block/AlignmentControls.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	TEXT_ALIGN_PROPERTY,

	components: {
		ZyroCssShorthandControlRange,
		ZyroLabel,
		AlignmentControls,
	},

	data() {
		return {
			blockId: null,
			initialCurrentBlockData: null,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'currentBlock',
			'currentBlockStyles',
		]),
		...mapGetters('gui', ['isMobileMode']),
		verticalPadding() {
			const key = this.isMobileMode ? 'm-block-padding' : 'block-padding';

			return this.currentBlockStyles?.[key];
		},
		horizontalPadding() {
			return this.currentBlockStyles?.['m-block-padding'];
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
		updateVerticalPadding(newValue) {
			const key = this.isMobileMode ? 'm-block-padding' : 'block-padding';

			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							[key]: newValue,
						},
					},
				},
				merge: true,
			});
		},
		updateHorizontalPadding(newValue) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					settings: {
						styles: {
							'm-block-padding': newValue,
						},
					},
				},
				merge: true,
			});
		},
	},
});
</script>
