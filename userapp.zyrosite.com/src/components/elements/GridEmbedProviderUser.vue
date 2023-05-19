<template>
	<!--
		As user can embed anything to grid embed it can greatly impact his page speed in addition to skewing
		the overall statistics of the user site speed, so we use IntersectionObserver to render GridEmbed only
		when it has been intersected
	-->
	<GridEmbed
		:id="id"
		ref="gridEmbedRef"
		:should-render="isObserved"
		:srcdoc="srcdoc"
		:height="data.settings.styles.height"
	/>
</template>
<script>
import {
	ref,
	defineComponent,
	onMounted,
} from 'vue';

import GridEmbed from '@zyro-inc/site-modules/components/elements/embed/GridEmbed.vue';
import { constructSrcdoc } from '@zyro-inc/site-modules/components/elements/embed/constructSrcdoc';
import { useObserver } from '@zyro-inc/site-modules/use/useObserver';

export default defineComponent({
	components: {
		GridEmbed,
	},

	props: {
		data: {
			type: Object,
			default: () => ({}),
		},
		id: {
			type: String,
			default: null,
		},
	},

	setup(props) {
		const gridEmbedRef = ref(null);
		const { isObserved } = useObserver(gridEmbedRef);
		const srcdoc = ref(null);

		onMounted(() => {
			srcdoc.value = constructSrcdoc(props.data.content);
		});

		return {
			gridEmbedRef,
			isObserved,
			srcdoc,
		};
	},
});
</script>
