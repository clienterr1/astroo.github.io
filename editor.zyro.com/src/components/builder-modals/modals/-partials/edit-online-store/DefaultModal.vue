<template>
	<div class="edit-store">
		<img
			:src="getImageSrc(modalConfig.imageName)"
			:alt="modalConfig.title"
			class="edit-store__image"
		>
		<h5 class="z-h5 z-font-weight-normal edit-store__title">
			{{ $t(modalConfig.titleTranslationKey) }}
		</h5>
		<div class="edit-store__text">
			{{ $t(modalConfig.textTranslationKey) }}
		</div>
		<ZyroButton
			v-qa="`${dataQaType}-btn-close`"
			theme="primary"
			color="black"
			size="sm"
			@click="handleButtonClick"
		>
			{{ $t(modalConfig.buttonTextTranslationKey) }}
		</ZyroButton>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import { mapGetters } from 'vuex';

import EventLogApi from '@/api/EventLogApi';

import { defineComponent } from 'vue';

const MANAGE_TYPE = 'manageStore';
const CHOOSE_TYPE = 'choose';

const MODAL_CONFIG = {
	[MANAGE_TYPE]: {
		titleTranslationKey: 'builder.editOnlineStoreModal.manageStore.title',
		textTranslationKey: 'builder.editOnlineStoreModal.manageStore.text',
		buttonTextTranslationKey: 'builder.editOnlineStoreModal.manageStore.btn',
		closeEventName: 'builder.manageStore_store_modal.close',
		buttonClickEventName: 'builder.manageStore_store_modal.click_button',
		imageName: 'store-manageStore.png',
	},
	[CHOOSE_TYPE]: {
		titleTranslationKey: 'builder.editOnlineStoreModal.choose.title',
		textTranslationKey: 'builder.editOnlineStoreModal.choose.text',
		buttonTextTranslationKey: 'builder.editOnlineStoreModal.choose.btn',
		closeEventName: 'builder.choose_store_modal.close',
		buttonClickEventName: 'builder.choose_store_modal.click_button',
		imageName: 'store-upgradeSite.png',
	},
};

export default defineComponent({

	components: {
		ZyroButton,
	},

	props: {
		dataQaType: {
			type: String,
			required: true,
		},
	},

	emits: ['button-click'],

	computed: {
		...mapGetters('subscription', ['hasActiveEcommerceSubscription']),
		modalConfig() {
			if (this.hasActiveEcommerceSubscription) {
				return MODAL_CONFIG[MANAGE_TYPE];
			}

			return MODAL_CONFIG[CHOOSE_TYPE];
		},
	},

	methods: {
		handleCloseModal() {
			EventLogApi.logEvent({
				eventName: this.modalConfig.closeEventName,
			});
		},
		handleButtonClick() {
			EventLogApi.logEvent({
				eventName: this.modalConfig.buttonClickEventName,
			});

			this.$emit('button-click');
		},
		getImageSrc(imageName) {
			return new URL(`../../../../../assets/images/${imageName}`, import.meta.url).href;
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./style";
</style>
