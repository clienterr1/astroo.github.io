<template>
	<StyleCollapseControl
		:property="getProperty(PROPERTY_BOX_SHADOW_NULL, state)"
		:element="element"
		collapse-title="Shadow"
	>
		<div class="form-group">
			<div class="form-group__item form-grid form-grid--2">
				<StylePropertyControl
					:element="element"
					:property="getProperty(PROPERTY_BOX_SHADOW_SPREAD, state)"
					label="Width"
				/>
			</div>

			<div class="form-group__item form-grid form-grid--3">
				<StylePropertyControl
					:element="element"
					:property="getProperty(PROPERTY_BOX_SHADOW_BLUR, state)"
					label="Blur"
				/>
				<StylePropertyControl
					:element="element"
					:property="getProperty(PROPERTY_BOX_SHADOW_X, state)"
					label="X"
				/>
				<StylePropertyControl
					:element="element"
					:property="getProperty(PROPERTY_BOX_SHADOW_Y, state)"
					label="Y"
				/>
			</div>
		</div>
	</StyleCollapseControl>
</template>

<script>
import {
	PROPERTY_BOX_SHADOW_BLUR,
	PROPERTY_BOX_SHADOW_COLOR,
	PROPERTY_BOX_SHADOW_NULL,
	PROPERTY_BOX_SHADOW_SPREAD,
	PROPERTY_BOX_SHADOW_X,
	PROPERTY_BOX_SHADOW_Y,
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
			PROPERTY_BOX_SHADOW_BLUR,
			PROPERTY_BOX_SHADOW_COLOR,
			PROPERTY_BOX_SHADOW_NULL,
			PROPERTY_BOX_SHADOW_SPREAD,
			PROPERTY_BOX_SHADOW_X,
			PROPERTY_BOX_SHADOW_Y,
			getProperty,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
</style>
