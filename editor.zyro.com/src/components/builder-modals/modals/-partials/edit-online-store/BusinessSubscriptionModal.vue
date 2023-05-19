<template>
	<div class="edit-store">
		<img
			src="@/assets/images/store-upgradeSite.png"
			:alt="$t('builder.editStoreModalContainsAdvanced')"
			class="edit-store__image"
		>
		<h5 class="z-h5 z-font-weight-normal edit-store__title">
			{{ $t('builder.editStoreModalContainsAdvanced') }}
		</h5>
		<i18n-t
			class="edit-store__text"
			keypath="builder.editStoreModalSwitchToOnline"
		>
			<a
				href="//support.zyro.com/en/articles/6000617-how-to-switch-to-the-lite-store"
				target="_blank"
				class="edit-store__link"
			>
				{{ $t('builder.editStoreModalSwitchToOnlineSlot') }}
			</a>
		</i18n-t>
	</div>
</template>

<script>
import EventLogApi from '@/api/EventLogApi';

import { defineComponent } from 'vue';

export default defineComponent({

	props: {
		dataQaType: {
			type: String,
			required: true,
		},
	},
	emits: ['button-click'],

	methods: {
		handleCloseModal() {
			EventLogApi.logEvent({
				eventName: 'builder.upgradeSite_store_modal.close',
			});
		},
		handleButtonClick() {
			EventLogApi.logEvent({
				eventName: 'builder.upgradeSite_store_modal.click_button',
			});

			this.$emit('button-click');
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./style";
</style>
