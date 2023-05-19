<template>
	<GridVideo
		v-bind="composedProps"
		@dragstart.stop.prevent
	/>
</template>

<script>
import GridVideo from '@zyro-inc/site-modules/components/elements/video/GridVideo.vue';
import { useGridVideo } from '@zyro-inc/site-modules/components/elements/video/useGridVideo';

import { defineComponent } from 'vue';

export default defineComponent({
	name: 'GridVideoProviderBuilder',

	components: {
		GridVideo,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
	},

	setup(props) {
		const { composedProps } = useGridVideo(props);

		return {
			composedProps,
		};
	},
});
</script>
