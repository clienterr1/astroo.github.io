<template>
	<ZyroDropdown
		:model-value="selectedStyle"
		:label="label"
		:options="styleOptions"
		:bold="false"
		class="select-control"
		button-size="large"
		@update:model-value="updateSelectedStyle"
	/>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';

import {
	mapActions,
	mapGetters,
	mapMutations,
} from 'vuex';

import { PROPERTY_FONT_WEIGHT } from '@zyro-inc/site-modules/constants/globalStyles';
import { convertWeightStringToNumber } from '@zyro-inc/site-modules/utils/font';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'StyleSelectControl',

	components: {
		ZyroDropdown,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
		property: {
			type: String,
			required: true,
		},
		styleOptions: {
			type: Array,
			required: true,
		},
		label: {
			type: String,
			default: '',
		},
	},

	computed: {
		...mapGetters([
			'siteStyles',
			'siteFonts',
			'siteBlocks',
		]),

		selectedStyle() {
			const isPropertyFontWeight = this.property === PROPERTY_FONT_WEIGHT;
			let styleValue = this.siteStyles[this.element][this.property];

			if (isPropertyFontWeight) {
				styleValue = convertWeightStringToNumber(styleValue);
			}

			if (!styleValue) {
				return {
					title: `Select ${this.label} ...`,
				};
			}

			const selectedOption = this.styleOptions
				.find((styleOption) => styleOption.value === styleValue);

			const defaultSelectedOption = {
				title: styleValue,
				value: styleValue,
			};

			return selectedOption ?? defaultSelectedOption;
		},
	},

	methods: {
		...mapMutations(['setStyleProperty']),
		...mapActions(['updateBlockData']),

		updateSelectedStyle(style) {
			const isEditingNavigationFont = this.element === 'nav-link' && [
				'font-weight',
				'font-family',
			].includes(this.property);

			if (isEditingNavigationFont) {
				const headerBlockData = this.siteBlocks.header;
				const {
					fontFamily: _fontFamily,
					fontWeight: _fontWeight,
					...restData
				} = headerBlockData;

				// Reset local header font so it could fallback to global
				this.updateBlockData({
					blockId: 'header',
					blockData: {
						...restData,
					},
				});
			}

			this.$emit('update', style);
			this.setStyleProperty({
				element: this.element,
				property: this.property,
				value: style.value,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";

.select-control {
	margin: 0;
}
</style>
