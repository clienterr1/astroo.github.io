<template>
	<div
		ref="stickyTriggerRef"
		class="sticky-trigger"
	/>
</template>

<script>
import {
	ref,
	onMounted,
	onBeforeUnmount,
	defineComponent,
} from 'vue';

import { useStickyTrigger } from '@zyro-inc/site-modules/use/useStickyTrigger';

const OBSERVER_OPTIONS = {
	threshold: 1,
};

export default defineComponent({
	name: 'StickyTrigger',

	setup() {
		const stickyTriggerRef = ref(null);
		const { setIntersectingState } = useStickyTrigger();

		const observer = new IntersectionObserver(([{ isIntersecting }]) => {
			setIntersectingState(isIntersecting);
		}, OBSERVER_OPTIONS);

		onMounted(() => {
			observer.observe(stickyTriggerRef.value);
		});

		onBeforeUnmount(() => {
			observer.disconnect();
		});

		return {
			stickyTriggerRef,
		};
	},
});
</script>

<style lang="scss">
.sticky-trigger {
	position: relative;
	top: 0;
	z-index: -1;
	height: 1px;
	margin-bottom: -1px;
	pointer-events: none;
}
</style>
