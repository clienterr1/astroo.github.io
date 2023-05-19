<template>
	<ZyroModal
		max-width="375px"
		max-height="480px"
		height="auto"
		:title="activeModalSettings.title"
		:show-close-button="activeModalSettings.isClosable"
		class="notification-modal"
		@close-modal="handleClose"
	>
		<div
			class="notification-modal__message"
			v-text="activeModalSettings.message"
		/>
		<div class="notification-modal__actions">
			<ZyroButton
				v-if="!!activeModalSettings.closeCallback"
				theme="primary"
				color="white"
				@click="handleClose"
			>
				{{ $t('common.close') }}
			</ZyroButton>
			<ZyroButton
				v-if="!!activeModalSettings.submitCallback"
				theme="primary"
				@click="handleSubmit"
			>
				{{ activeModalSettings.submitLabel }}
			</ZyroButton>
		</div>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import { mapState } from 'vuex';

import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
	},

	computed: {
		...mapState('gui', ['activeModalSettings']),
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		handleSubmit() {
			if (!this.activeModalSettings.submitCallback) {
				return;
			}

			this.activeModalSettings.submitCallback();

			if (this.activeModalSettings.closeOnSubmit) {
				this.closeModal();
			}
		},
		handleClose() {
			if (this.activeModalSettings.closeCallback) {
				this.activeModalSettings.closeCallback();
			}

			this.closeModal();
		},
	},
});
</script>

<style lang="scss" scoped>
.notification-modal {
	&__actions {
		display: flex;
		justify-content: center;
		padding: 16px 0;
	}
}
</style>
