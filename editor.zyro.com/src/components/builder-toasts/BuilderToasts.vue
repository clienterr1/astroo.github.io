<template>
	<div
		v-if="toasts.length"
		class="toasts"
	>
		<!-- we could also do :toast="toast", but for better propType checking, spread the props: -->
		<Toast
			v-for="(toast) in toasts"
			:id="toast.id"
			:key="toast.id"
			:icon="toast.icon"
			:message="toast.messageI18nKeyPath ? $t(toast.messageI18nKeyPath) : toast.message"
			:submit-label="toast.submitLabelI18nKeyPath ? $t(toast.submitLabelI18nKeyPath) : null"
			class="toasts__item"
			@submit="handleSubmit(toast)"
			@close="handleClose(toast)"
		/>
	</div>
</template>

<script>
import Toast from '@/components/builder-toasts/Toast.vue';

import {
	mapStateNotifications,
	mapActionsNotifications,
	DELETE_TOAST,
} from '@/store/builder/notifications';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		Toast,
	},

	computed: {
		...mapStateNotifications({
			toasts: 'toasts',
		}),
	},

	methods: {
		...mapActionsNotifications({
			deleteToast: DELETE_TOAST,
		}),
		handleSubmit(toast) {
			const {
				closeOnSubmit,
				submitCallback,
			} = toast;

			if (submitCallback) {
				submitCallback();
			}

			if (closeOnSubmit) {
				this.handleClose(toast);
			}
		},
		handleClose(toast) {
			const {
				id,
				closeCallback,
			} = toast;

			this.deleteToast(id);

			if (closeCallback) {
				closeCallback();
			}
		},
	},
});
</script>

<style lang="scss" scoped>
.toasts {
	position: fixed;
	right: 60px;
	bottom: 0;
	z-index: $z-index-toasts;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	padding: 16px;

	@media screen and (max-width: $media-mobile) {
		right: 0;
	}
}
</style>
