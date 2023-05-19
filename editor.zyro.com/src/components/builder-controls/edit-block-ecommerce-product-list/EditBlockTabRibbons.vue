<template>
	<div class="ecommerce-tab-ribbons">
		<div class="ecommerce-tab-ribbons__item">
			<ZyroLabel>
				{{ $t('builder.editButton.customButtonStyles.fillColor') }}
			</ZyroLabel>
			<ColorPicker
				:model-value="backgroundColor"
				placement="left"
				:offset="250"
				:is-open="isBackgroundColorPickerOpen"
				@click-outside="isBackgroundColorPickerOpen = false"
				@toggle="isBackgroundColorPickerOpen = !isBackgroundColorPickerOpen"
				@update:model-value="setRibbonStyle(PROPERTIES.backgroundColor, $event)"
			/>
		</div>
		<div class="ecommerce-tab-ribbons__item">
			<ZyroLabel>
				{{ $t('builder.editButton.customButtonStyles.textColor') }}
			</ZyroLabel>
			<ColorPicker
				:model-value="color"
				placement="left"
				:offset="250"
				:is-open="isColorPickerOpen"
				@click-outside="isColorPickerOpen = false"
				@toggle="isColorPickerOpen = !isColorPickerOpen"
				@update:model-value="setRibbonStyle(PROPERTIES.color, $event)"
			/>
		</div>
	</div>
</template>

<script>
import ColorPicker from '@/components/global/ColorPicker.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import cloneDeep from 'lodash.clonedeep';
import {
	mapState,
	mapGetters,
	mapActions,
} from 'vuex';

import { defineComponent } from 'vue';

const PROPERTIES = {
	backgroundColor: 'ribbon-background-color',
	color: 'ribbon-color',
};

export default defineComponent({
	components: {
		ColorPicker,
		ZyroLabel,
	},

	data() {
		return {
			PROPERTIES,
			blockId: '',
			initialCurrentBlockData: null,
			isColorPickerOpen: false,
			isBackgroundColorPickerOpen: false,
		};
	},

	computed: {
		...mapState(['currentBlockId']),
		...mapGetters([
			'siteMeta',
			'currentBlock',
		]),
		ribbonStyle() {
			return this.currentBlock.ribbonStyle || {};
		},
		backgroundColor() {
			return this.ribbonStyle[PROPERTIES.backgroundColor] || 'black';
		},
		color() {
			return this.ribbonStyle[PROPERTIES.color] || 'white';
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

		setRibbonStyle(property, style) {
			this.updateBlockData({
				blockId: this.blockId,
				blockData: {
					ribbonStyle: {
						[property]: style,
					},
				},
				merge: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-tab-ribbons {
	display: flex;
	flex-direction: column;

	&__item {
		display: flex;
		justify-content: space-between;

		&:first-child {
			margin-bottom: 16px;
		}
	}
}
</style>
