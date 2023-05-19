<template>
	<div class="form-group">
		<h3
			class="form-group__header
			form-group__header--padding-large z-subheading z-subheading--spaced"
		>
			Animation settings
		</h3>
		<div class="form-group__item form-grid form-grid--2">
			<StylePropertyControl
				:element="element"
				:property="PROPERTY_TRANSITION_DURATION"
				label="Duration"
				unit="s"
			/>
			<StyleSelectControl
				:element="element"
				:property="PROPERTY_TRANSITION_TIMING_FUNCTION"
				label="Function"
				:style-options="TRANSITION_FUNCTIONS"
			/>
		</div>
	</div>
</template>

<script>
import {
	PROPERTY_TRANSITION_DURATION,
	PROPERTY_TRANSITION_TIMING_FUNCTION,
} from '@zyro-inc/site-modules/constants/globalStyles';

import StylePropertyControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StylePropertyControl.vue';
import StyleSelectControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/StyleSelectControl.vue';

import { defineComponent } from 'vue';

const TRANSITION_FUNCTIONS = [
	{
		title: 'Ease',
		value: 'ease',
	},
	{
		title: 'Linear',
		value: 'linear',
	},
	{
		title: 'Ease in',
		value: 'ease-in',
	},
	{
		title: 'Ease out',
		value: 'ease-out',
	},
	{
		title: 'Ease in out',
		value: 'ease-in-out',
	},
];

export default defineComponent({
	TRANSITION_FUNCTIONS,

	components: {
		StyleSelectControl,
		StylePropertyControl,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
	},

	setup() {
		return {
			PROPERTY_TRANSITION_DURATION,
			PROPERTY_TRANSITION_TIMING_FUNCTION,
			TRANSITION_FUNCTIONS,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
</style>
