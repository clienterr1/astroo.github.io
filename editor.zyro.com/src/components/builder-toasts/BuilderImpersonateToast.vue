<template>
	<div class="impersonating">
		<Toast
			v-if="show"
			class="impersonating__toast"
			button-color="red"
			:message="`Currently impersonating: ${email}`"
			@close="show = false"
		/>
	</div>
</template>

<script>
import Toast from '@/components/builder-toasts/Toast.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Toast,
	},

	props: {
		email: {
			type: String,
			required: true,
		},
	},

	data() {
		return {
			show: true,
		};
	},
});
</script>

<style lang="scss" scoped>
.impersonating {
	position: fixed;
	right: 60px;
	bottom: 0;
	z-index: $z-index-toasts;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	padding: 16px;

	&__toast {
		max-width: 600px;
		background-color: $color-primary;
	}
}
</style>
