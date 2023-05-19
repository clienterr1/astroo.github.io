<template>
	<AnimationsLibrary :element-id="currentElementId" />
</template>

<script>
import {
	defineComponent,
	computed,
} from 'vue';
import AnimationsLibrary from '@/components/builder-drawers/drawers/partials/stylesDrawer/animations/AnimationsLibrary.vue';
import { useStore } from 'vuex';

export default defineComponent({
	components: {
		AnimationsLibrary,
	},
	setup() {
		const { getters } = useStore();
		const currentElementId = computed(() => getters.currentElementId);

		return {
			currentElementId,
		};
	},
});
</script>
