<template>
	<div class="layout">
		<ZyroFieldToggle
			v-if="!isMobileMode"
			:id="`${blockId}-toggle`"
			v-qa="`sectionsettings-toggle-${gapsEnabled ? 'on': 'off'}-enablegriddaps`"
			:model-value="gapsEnabled"
			:label="$t('builder.editBlockTabLayout.toggleFieldLabel')"
			@update:model-value="updateGapsEnabled"
		/>
		<ZyroCssShorthandControl
			v-qa="'sectionsettings-inputfield-topbottompadding'"
			:model-value="padding"
			:show-horizontal="isMobileMode"
			units="px"
			:title-horizontal="$t('builder.cssShorthandControlRange.horizontal')"
			:title-vertical="$t('builder.cssShorthandControlRange.vertical')"
			:label="$t('builder.editBlockTabLayout.controlRangeLabel')"
			bold
			@update:model-value="updatePaddingValue"
		/>
	</div>
</template>

<script>
import ZyroCssShorthandControl from '@/components/global/ZyroCssShorthandControl.vue';
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
		ZyroCssShorthandControl,
		ZyroFieldToggle,
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
		padding() {
			const key = this.isMobileMode ? 'm-block-padding' : 'block-padding';

			return this.currentBlockStyles?.[key] || '0';
		},
		gapsEnabled() {
			return this.currentBlockStyles?.['column-gap'] !== '0px'
				&& this.currentBlockStyles?.['row-gap'] !== '0px';
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
		...mapActions([
			'updateBlockData',
			'leaveElementEditMode',
		]),
		...mapActions('undoRedo', ['createSnapshot']),
		updateGapsEnabled(newValue) {
			this.leaveElementEditMode();
			const rowSizeInt = Number.parseInt(this.currentBlockStyles?.['row-size'], 10);

			if (newValue) {
				const gridGap = (this.currentBlockStyles?.['grid-gap-history'] || '16px 16px').split(' ');
				const rowGapInt = Number.parseInt(gridGap[0], 10);

				this.updateBlockData({
					blockId: this.blockId,
					blockData: {
						settings: {
							styles: {
								'row-gap': gridGap[0],
								'column-gap': gridGap[1],
								'row-size': `${rowSizeInt - rowGapInt}px`,
							},
						},
					},
					merge: true,
				});
			} else {
				const rowGap = this.currentBlockStyles?.['row-gap'];
				const columnGap = this.currentBlockStyles?.['column-gap'];

				// Save old gaps
				const rowGapInt = Number.parseInt(rowGap, 10);

				this.updateBlockData({
					blockId: this.blockId,
					blockData: {
						settings: {
							styles: {
								'column-gap': '0px',
								'row-gap': '0px',
								'row-size': `${rowSizeInt + rowGapInt}px`,
								'grid-gap-history': `${rowGap} ${columnGap}`,
							},
						},
					},
					merge: true,
				});
			}
		},
		updatePaddingValue(newValue) {
			const key = this.isMobileMode ? 'm-block-padding' : 'block-padding';

			this.leaveElementEditMode();
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
	},
});
</script>

<style lang="scss" scoped>
.layout {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;

	&__alignment {
		display: flex;

		> *:not(:last-child) {
			margin-right: 24px;
		}

		&-label {
			margin-top: 16px;
		}
	}
}
</style>
