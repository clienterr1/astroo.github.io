<template>
	<EditTextMoreItem
		:title="$t('builder.editText.backgroundColor')"
		direction="row"
	>
		<div class="input">
			<ColorPicker
				v-if="textBoxBackgroundColor"
				v-qa="'text-backgorund-color-input'"
				class="input__color-picker"
				portal-selector="[data-portal='builder-preview']"
				:model-value="textBoxBackgroundColor"
				:is-open="isOpen"
				@click-outside="isOpen = false"
				@toggle="isOpen = !isOpen"
				@update:model-value="handleColorInput"
			/>
			<ZyroToggle
				id="text-backgorund-color-toggle"
				v-qa="'text-backgorund-color-toggle'"
				:model-value="!!textBoxBackgroundColor"
				@update:model-value="handleToggle"
			/>
		</div>
	</EditTextMoreItem>
</template>

<script>
import ColorPicker from '@/components/global/ColorPicker.vue';
import ZyroToggle from '@/components/global/ZyroToggle.vue';

import {
	mapGetters,
	mapActions,
} from 'vuex';
import EditTextMoreItem from '@/components/builder-controls/edit-text/EditTextMoreItem.vue';

import { defineComponent } from 'vue';

const DEFAULT_COLOR = 'rgb(221, 221, 221)';

export default defineComponent({
	components: {
		ColorPicker,
		ZyroToggle,
		EditTextMoreItem,
	},

	data() {
		return {
			isOpen: false,
		};
	},

	computed: {
		...mapGetters(['currentElement']),
		textBoxBackgroundColor() {
			if (!this.currentElement) {
				return null;
			}

			return this.currentElement.backgroundColor || null;
		},
	},

	methods: {
		...mapActions(['mergeCurrentElementData']),
		handleToggle(isChecked) {
			this.mergeCurrentElementData({
				elementData: {
					backgroundColor: isChecked ? DEFAULT_COLOR : null,
				},
			});
		},
		handleColorInput(value) {
			this.mergeCurrentElementData({
				elementData: {
					backgroundColor: value,
				},
			});
		},
	},
});
</script>

<style lang="scss" scoped>
.input {
	display: flex;
	align-items: center;

	&__color-picker {
		margin-right: 8px;
	}
}
</style>
