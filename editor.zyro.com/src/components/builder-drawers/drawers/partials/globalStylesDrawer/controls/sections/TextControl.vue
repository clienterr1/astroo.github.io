<template>
	<div class="form-group">
		<h3
			v-if="title"
			class="form-group__header form-group__header--padding z-subheading z-subheading--spaced"
		>
			{{ title }} text
		</h3>

		<div class="form-group__item form-grid">
			<StyleSelectControl
				:element="element"
				:property="PROPERTY_FONT_FAMILY"
				:style-options="availableFontTypeSelection"
				label="Font"
				@update="checkForUnavailableFontWeights"
			/>
			<StyleSelectControl
				:element="element"
				:property="PROPERTY_FONT_WEIGHT"
				:style-options="availableFontWeightSelection"
				label="Weight"
			/>
		</div>

		<div class="form-group__item form-grid form-grid--3">
			<StylePropertyControl
				:element="element"
				:property="PROPERTY_FONT_SIZE"
				label="Size"
			/>
			<StylePropertyControl
				v-if="isMobileFontSize"
				:element="element"
				:property="PROPERTY_M_FONT_SIZE"
				label="Mobile size"
			/>
			<StylePropertyControl
				:element="element"
				:property="PROPERTY_LINE_HEIGHT"
				label="Line height"
				unit=""
			/>
			<StylePropertyControl
				:element="element"
				:property="PROPERTY_LETTER_SPACING"
				label="Spacing"
				unit="em"
			/>
		</div>

		<div class="form-group__item form-grid">
			<div>
				<ZyroLabel
					class="form-group__item--label"
					:bold="false"
				>
					Other options
				</ZyroLabel>
				<StyleToggleControl
					:element="element"
					:property="PROPERTY_TEXT_DECORATION"
					toggle-value="underline"
				/>
				<StyleToggleControl
					:element="element"
					:property="PROPERTY_TEXT_TRANSFORM"
					toggle-value="uppercase"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import ZyroLabel from '@/components/global/ZyroLabel.vue';

import {
	mapGetters,
	mapMutations,
} from 'vuex';

import {
	PROPERTY_FONT_SIZE,
	PROPERTY_M_FONT_SIZE,
	PROPERTY_FONT_FAMILY,
	PROPERTY_FONT_STYLE,
	PROPERTY_FONT_WEIGHT,
	PROPERTY_LINE_HEIGHT,
	PROPERTY_COLOR,
	PROPERTY_TEXT_DECORATION,
	PROPERTY_TEXT_TRANSFORM,
	PROPERTY_LETTER_SPACING,
} from '@zyro-inc/site-modules/constants/globalStyles';
import {
	convertWeightStringToNumber,
	extractFontTypeFromVariable,
	transformFontTypeToVariable,
} from '@zyro-inc/site-modules/utils/font';
import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import StylePropertyControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StylePropertyControl.vue';
import StyleSelectControl from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StyleSelectControl.vue';
import StyleToggleControl from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StyleToggleControl.vue';
import { getClosestNumberInArray } from '@/utils/array';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroLabel,
		StyleSelectControl,
		StyleToggleControl,
		StylePropertyControl,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			default: null,
			required: false,
		},
		isMobileFontSize: {
			type: Boolean,
			default: true,
		},
	},

	setup() {
		return {
			PROPERTY_FONT_SIZE,
			PROPERTY_M_FONT_SIZE,
			PROPERTY_FONT_FAMILY,
			PROPERTY_FONT_STYLE,
			PROPERTY_FONT_WEIGHT,
			PROPERTY_LINE_HEIGHT,
			PROPERTY_COLOR,
			PROPERTY_TEXT_DECORATION,
			PROPERTY_TEXT_TRANSFORM,
			PROPERTY_LETTER_SPACING,
		};
	},

	computed: {
		...mapGetters([
			'siteStyles',
			'siteFonts',
		]),
		...mapGetters('fonts', ['getAvailableFontWeights']),
		availableFontWeightSelection() {
			return this.availableFontWeights
				.map((fontWeight) => ({
					title: fontWeight,
					value: fontWeight,
				}));
		},
		availableFontTypeSelection({ siteFonts }) {
			return Object.keys(siteFonts).map((key) => ({
				title: capitalizeFirstLetter(key),
				value: transformFontTypeToVariable(key),
			}));
		},
		availableFontWeights({ siteStyles }) {
			const fontType = extractFontTypeFromVariable(siteStyles[this.element][PROPERTY_FONT_FAMILY]);

			return this.getAvailableFontWeights[fontType];
		},
	},

	mounted() {
		/**
		 * This should not be needed but might prevent a bug
		 */
		this.checkForUnavailableFontWeights();
	},

	methods: {
		...mapMutations(['setStyleProperty']),
		checkForUnavailableFontWeights() {
			const elementFontWeight = convertWeightStringToNumber(
				this.siteStyles[this.element][PROPERTY_FONT_WEIGHT],
			);
			const isElementFontWeightUnavailable = !this.availableFontWeights.includes(elementFontWeight);

			if (isElementFontWeightUnavailable) {
				this.setClosestFontWeight(elementFontWeight);
			}
		},
		setClosestFontWeight(elementFontWeight) {
			const closestAvailableFontWeight = getClosestNumberInArray(
				this.availableFontWeights,
				elementFontWeight,
			);

			this.setStyleProperty({
				element: this.element,
				property: PROPERTY_FONT_WEIGHT,
				value: closestAvailableFontWeight,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
</style>
