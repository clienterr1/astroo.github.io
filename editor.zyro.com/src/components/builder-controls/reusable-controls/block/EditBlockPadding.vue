<template>
	<div>
		<slot name="top" />
		<ZyroCssShorthandControl
			:model-value="padding"
			:show-horizontal="isMobileMode"
			units="px"
			:label="$t('builder.editBlockTabLayout.controlRangeLabel')"
			:title-horizontal="$t('builder.cssShorthandControlRange.horizontal')"
			:title-vertical="$t('builder.cssShorthandControlRange.vertical')"
			bold
			color="light"
			@update:model-value="updatePadding"
		/>
	</div>
</template>

<script>
import ZyroCssShorthandControl from '@/components/global/ZyroCssShorthandControl.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCssShorthandControl,
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlockStyles']),
		...mapGetters('gui', ['isMobileMode']),
		padding() {
			const key = this.isMobileMode ? 'm-block-padding' : 'block-padding';

			return this.currentBlockStyles?.[key] || '0';
		},
	},

	methods: {
		...mapActions([
			'updateBlockData',
			'leaveElementEditMode',
		]),

		updatePadding(newValue) {
			const key = this.isMobileMode ? 'm-block-padding' : 'block-padding';

			this.leaveElementEditMode();
			this.updateBlockData({
				blockId: this.currentBlockId,
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
