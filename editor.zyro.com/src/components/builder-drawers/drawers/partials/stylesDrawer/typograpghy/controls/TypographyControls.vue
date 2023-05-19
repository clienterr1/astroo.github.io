<template>
	<div>
		<div class="form-grid form-grid--3">
			<StyleSelectControl
				:element="element"
				:property="PROPERTY_FONT_WEIGHT"
				:style-options="fontWeightsSelect"
				:label="$t('builder.userStyles.typography.fontWeight')"
			/>
			<StyleSelectControl
				:element="element"
				:property="isMobileView ? PROPERTY_M_FONT_SIZE : PROPERTY_FONT_SIZE"
				:style-options="FONT_SIZE_STEPS"
				:label="$t('builder.userStyles.typography.fontSize')"
			/>
			<StylePropertyControl
				:element="element"
				:property="PROPERTY_LINE_HEIGHT"
				:label="$t('builder.userStyles.typography.lineHeight')"
				unit=""
			/>
		</div>
		<div class="decoration-options">
			<StyleToggleControl
				v-if="isUnderlineControlVisible"
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
</template>

<script>
import {
	mapGetters,
	mapState,
	mapMutations,
} from 'vuex';

import {
	PROPERTY_FONT_WEIGHT,
	PROPERTY_FONT_SIZE,
	PROPERTY_TEXT_DECORATION,
	PROPERTY_TEXT_TRANSFORM,
	PROPERTY_LINE_HEIGHT,
	PROPERTY_COLOR,
	PROPERTY_M_FONT_SIZE,
	TYPOGRAPHY_NAV_LINK,
} from '@zyro-inc/site-modules/constants/globalStyles';

import StylePropertyControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StylePropertyControl.vue';
import StyleSelectControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StyleSelectControl.vue';
import StyleToggleControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StyleToggleControl.vue';
import {
	CHANGE_DRAWER_PAGE,
	mapActionsGui,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

const FONT_SIZE_STEPS = [
	'8px',
	'12px',
	'14px',
	'16px',
	'18px',
	'24px',
	'32px',
	'48px',
	'64px',
	'72px',
	'96px',
	'120px',
].map((size) => ({
	title: size,
	value: size,
}));

const ELEMENTS_WITH_DISABLED_UNDERLINE_CONTROL = [TYPOGRAPHY_NAV_LINK];

export default defineComponent({
	components: {
		StyleToggleControl,
		StyleSelectControl,
		StylePropertyControl,
	},

	props: {
		element: {
			type: String,
			default: null,
		},
		fontType: {
			type: String,
			default: 'primary',
		},
	},

	setup() {
		return {
			FONT_SIZE_STEPS,
			PROPERTY_FONT_WEIGHT,
			PROPERTY_FONT_SIZE,
			PROPERTY_M_FONT_SIZE,
			PROPERTY_TEXT_DECORATION,
			PROPERTY_TEXT_TRANSFORM,
			PROPERTY_LINE_HEIGHT,
		};
	},

	computed: {
		...mapState('gui', ['isMobileView']),
		...mapGetters(['siteStyles']),
		...mapGetters('fonts', [
			'getFontNames',
			'getAvailableFontWeights',
		]),
		fontWeightsSelect() {
			return [...this.getAvailableFontWeights[this.fontType]].sort().map((fontWeight) => ({
				title: fontWeight,
				value: fontWeight,
			}));
		},
		elementColor: {
			get() {
				return this.siteStyles[this.element][PROPERTY_COLOR];
			},
			set(color) {
				this.setStyleProperty({
					element: this.element,
					property: PROPERTY_COLOR,
					value: color,
				});
			},
		},
		isUnderlineControlVisible() {
			return !ELEMENTS_WITH_DISABLED_UNDERLINE_CONTROL.includes(this.element);
		},
	},

	methods: {
		...mapActionsGui({
			changePage: CHANGE_DRAWER_PAGE,
		}),
		...mapMutations(['setStyleProperty']),
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";

.decoration-options {
	margin-top: 12px;
}
</style>
