<template>
	<GridShape
		:svg="data.svg"
		:style="cssVars"
	/>
</template>

<script>
import GridShape from '@zyro-inc/site-modules/components/elements/shape/GridShape.vue';
import {
	MOBILE_BLOCK_WIDTH,
	DESKTOP_BLOCK_WIDTH,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridShapeProviderUser',

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
			const mobileShapeHeightInVw = (this.data.mobile.height * 100) / MOBILE_BLOCK_WIDTH;
			const smallDesktopShapeHeightInVw = (this.data.desktop.height * 100) / DESKTOP_BLOCK_WIDTH;

			return {
				'--shape-height': `${this.data.desktop.height}px`,
				'--m-shape-height': `${mobileShapeHeightInVw}vw`,
				'--t-shape-height': `${this.data.mobile.height}px`,
				'--small-desktop-shape-height': `${smallDesktopShapeHeightInVw}vw`,
				'--shape-color': `${this.data.color}`,
			};
		},
	},
});
</script>
