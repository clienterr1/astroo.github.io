<template>
	<ZyroFieldInput
		:model-value="stylePropertyValue"
		:bold="false"
		class="style-property"
		:suffix="unit"
		:label="label"
		input-type="number"
		maxlength="5"
		@update:model-value="setStyleProperty({
			element,
			property,
			value: `${$event}${unit}`
		})"
	/>
</template>

<script>
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import {
	mapGetters,
	mapMutations,
} from 'vuex';

import {
	PROPERTY_LETTER_SPACING,
	PROPERTY_LINE_HEIGHT,
} from '@zyro-inc/site-modules/constants/globalStyles';

import {
	extractMobileProperty,
	isMobileProperty,
} from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/utils/getProperty';

import { defineComponent } from 'vue';

const DEFAULT_NORMAL_PROPERTIES = [
	PROPERTY_LETTER_SPACING,
	PROPERTY_LINE_HEIGHT,
];
const DEFAULT_NORMAL_VALUE = 'normal';

export default defineComponent({
	components: {
		ZyroFieldInput,
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
		unit: {
			type: String,
			default: 'px',
		},
		label: {
			type: String,
			default: '',
		},
	},

	computed: {
		...mapGetters(['siteStyles']),
		stylePropertyValue() {
			const elementPropertyValue = this.siteStyles[this.element][this.property];
			const elementPropertyValueWithoutMobile = this.siteStyles[this.element][extractMobileProperty(
				this.property,
			)];

			if (
				isMobileProperty(this.property)
				&& !elementPropertyValue
				&& elementPropertyValueWithoutMobile
			) {
				return elementPropertyValueWithoutMobile.replace(this.unit, '');
			}

			if (
				DEFAULT_NORMAL_PROPERTIES.includes(this.property)
				&& (elementPropertyValue === '0' || elementPropertyValue === DEFAULT_NORMAL_VALUE)
			) {
				this.setStyleProperty({
					element: this.element,
					property: this.property,
					value: DEFAULT_NORMAL_VALUE,
				});

				return '0';
			}

			if (!elementPropertyValue) {
				return '';
			}

			return elementPropertyValue.replace(this.unit, '');
		},
	},

	methods: {
		...mapMutations(['setStyleProperty']),
	},
});
</script>

<style lang="scss" scoped>
.style-property {
	margin: 0;
}
</style>
