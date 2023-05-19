<template>
	<ZyroCollapse
		size="x-large"
		has-separator
	>
		<template #trigger>
			<h3 class="z-body-small z-body-small--strong">
				{{ capitalizeFirstLetter(state) }}
			</h3>
		</template>
		<div>
			<BorderControl
				:element="element"
				:state="state"
			/>
			<ShadowControl
				:element="element"
				:state="state"
			/>
			<div class="form-group">
				<h3
					class="form-group__header form-group__header--padding z-subheading z-subheading--spaced"
				>
					Button text
				</h3>
			</div>
		</div>
	</ZyroCollapse>
</template>

<script>
import ZyroCollapse from '@/components/global/ZyroCollapse.vue';

import {
	PROPERTY_COLOR,
	STATE_HOVER,
} from '@zyro-inc/site-modules/constants/globalStyles';
import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import BorderControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/BorderControl.vue';
import ShadowControl
	from '@/components/builder-drawers/drawers/partials/globalStylesDrawer/controls/sections/ShadowControl.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroCollapse,
		ShadowControl,
		BorderControl,
	},

	props: {
		element: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
			validator(value) {
				return [STATE_HOVER].includes(value);
			},
		},
	},

	setup() {
		return {
			PROPERTY_COLOR,
			STATE_HOVER,
			capitalizeFirstLetter,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@/components/builder-drawers/drawers/partials/forms";
</style>
