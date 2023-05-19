<template>
	<GridMap
		ref="mapRef"
		v-bind="composedProps"
		class="no-pointer-events"
	/>
</template>

<script>
import {
	ref,
	defineComponent,
} from 'vue';

import GridMap from '@zyro-inc/site-modules/components/elements/map/GridMap.vue';
import { useGridMap } from '@zyro-inc/site-modules/components/elements/map/useGridMap';

export default defineComponent({
	name: 'GridMapProviderBuilder',

	components: {
		GridMap,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const mapRef = ref(null);

		const { composedProps } = useGridMap(props, mapRef);

		return {
			mapRef,
			composedProps,
		};
	},
});
</script>

<style lang="scss" scoped>
.no-pointer-events {
	pointer-events: none;
}
</style>
