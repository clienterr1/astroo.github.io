<template>
	<GridSocialIcons v-bind="composedProps" />
</template>

<script>
import GridSocialIcons from '@zyro-inc/site-modules/components/elements/social-icons/GridSocialIcons.vue';
import { useGridSocialIcons } from '@zyro-inc/site-modules/components/elements/social-icons/useGridSocialIcons';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		GridSocialIcons,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	setup(props, context) {
		return {
			composedProps: useGridSocialIcons(props, context),
		};
	},
});
</script>
