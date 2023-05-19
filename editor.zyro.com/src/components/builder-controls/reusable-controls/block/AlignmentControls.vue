<template>
	<div class="alignment">
		<ZyroIconControls
			:model-value="propertyValue"
			:icons="icons"
			:toggleable="false"
			@update:model-value="updatePropertyValue"
		/>
	</div>
</template>

<script>
import ZyroIconControls from '@/components/global/ZyroIconControls.vue';

import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { alignText } from '@/components/builder-controls//reusable-controls/alignText';
import {
	alignIcons,
	justifyIcons,
} from '@/components/builder-controls/reusable-controls/alignIcons';

import { defineComponent } from 'vue';

export const TEXT_ALIGN_PROPERTY = 'text-align';
export const ALIGN_PROPERTY = 'align';
export const JUSTIFY_PROPERTY = 'justify';

const propertiesMap = {
	[TEXT_ALIGN_PROPERTY]: alignText,
	[ALIGN_PROPERTY]: alignIcons,
	[JUSTIFY_PROPERTY]: justifyIcons,
};

export default defineComponent({
	components: {
		ZyroIconControls,
	},

	props: {
		styleProperty: {
			type: String,
			validator: (value) => [
				TEXT_ALIGN_PROPERTY,
				ALIGN_PROPERTY,
				JUSTIFY_PROPERTY,
			].includes(value),
			required: true,
		},
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters(['currentBlockStyles']),
		icons() {
			return propertiesMap[this.styleProperty];
		},
		propertyValue() {
			return this.currentBlockStyles?.[this.styleProperty];
		},
	},

	methods: {
		...mapActions(['updateBlockData']),

		updatePropertyValue(newValue) {
			this.updateBlockData({
				blockId: this.currentBlockId,
				blockData: {
					settings: {
						styles: {
							[this.styleProperty]: newValue,
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
.alignment {
	display: flex;

	> *:not(:last-child) {
		margin-right: 24px;
	}
}
</style>
