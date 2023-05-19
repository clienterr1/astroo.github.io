<template>
	<div class="form-group">
		<h3 class="form-group__header z-subheading z-subheading--spaced">
			Padding and border
		</h3>
		<div class="form-group__item form-grid form-grid--3">
			<StylePropertyControl
				:element="element"
				:property="getProperty(PROPERTY_PADDING_X, STATE_NORMAL, mobile)"
				label="Horizontal"
			/>
			<StylePropertyControl
				:element="element"
				:property="getProperty(PROPERTY_PADDING_Y, STATE_NORMAL, mobile)"
				label="Vertical"
			/>
			<StylePropertyControl
				:element="element"
				:property="getProperty(PROPERTY_BORDER_RADIUS, STATE_NORMAL, mobile)"
				label="Radius"
			/>
		</div>
	</div>
</template>

<script>
import {
	PROPERTY_PADDING_X,
	PROPERTY_PADDING_Y,
	PROPERTY_BORDER_RADIUS,
	STATE_NORMAL,
} from '@zyro-inc/site-modules/constants/globalStyles';

import StylePropertyControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StylePropertyControl.vue';
import { getProperty } from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/utils/getProperty';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		StylePropertyControl,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
		mobile: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		return {
			getProperty,
			PROPERTY_PADDING_X,
			PROPERTY_PADDING_Y,
			PROPERTY_BORDER_RADIUS,
			STATE_NORMAL,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
</style>
