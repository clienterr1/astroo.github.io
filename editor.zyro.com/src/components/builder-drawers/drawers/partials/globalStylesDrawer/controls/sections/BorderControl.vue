<template>
	<StyleCollapseControl
		:element="element"
		:property="getProperty(PROPERTY_BORDER_NULL, state)"
		collapse-title="Stroke"
	>
		<div class="form-group">
			<div class="form-group__item form-grid form-grid--2">
				<StylePropertyControl
					:element="element"
					:property="getProperty(PROPERTY_BORDER_WIDTH, state)"
					label="Width"
				/>
			</div>
		</div>
	</StyleCollapseControl>
</template>

<script>
import {
	PROPERTY_BORDER_COLOR,
	PROPERTY_BORDER_WIDTH,
	PROPERTY_BORDER_NULL,
} from '@zyro-inc/site-modules/constants/globalStyles';

import StyleCollapseControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StyleCollapseControl.vue';
import StylePropertyControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StylePropertyControl.vue';
import { getProperty } from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/utils/getProperty';

import { defineComponent } from 'vue';

export default defineComponent({
	getProperty,

	components: {
		StylePropertyControl,
		StyleCollapseControl,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			default: null,
			validator(value) {
				return ['hover'].includes(value);
			},
		},
	},

	setup() {
		return {
			PROPERTY_BORDER_COLOR,
			PROPERTY_BORDER_WIDTH,
			PROPERTY_BORDER_NULL,
			getProperty,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
</style>
