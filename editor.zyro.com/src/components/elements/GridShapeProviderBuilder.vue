<template>
	<GridShape
		:svg="data.svg"
		:style="cssVars"
	/>
</template>

<script>
import GridShape from '@zyro-inc/site-modules/components/elements/shape/GridShape.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridShapeProviderBuilder',

	components: {
		GridShape,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	computed: {
		cssVars() {
			return {
				'--shape-color': `${this.data.color}`,
			};
		},
	},
});
</script>
