<template>
	<ZyroPill
		class="overlay-pill"
		text-class="z-body-small"
		:text-to-uppercase="false"
		:text="text"
		:background-color="backgroundColor"
		text-color="var(--color-light)"
	>
		<slot />
	</ZyroPill>
</template>

<script>
import ZyroPill from '@/components/global/ZyroPill.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroPill,
	},

	props: {
		text: {
			type: String,
			required: true,
		},
		backgroundColor: {
			type: String,
			default: 'var(--color-azure-dark)',
		},
	},
});
</script>

<style lang="scss" scoped>
.overlay-pill {
	padding: 4px 8px;
	margin-left: 8px;
}
</style>
