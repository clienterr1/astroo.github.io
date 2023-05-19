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
		<ZyroButton
			v-qa="`${dataQaType}-btn-choose`"
			theme="primary"
			color="black"
			size="sm"
			@click="handleButtonClick"
		>
			{{ $t('common.choosePlan') }}
		</ZyroButton>
		<div class="edit-store__text edit-store__text--small">
			{{ $t('common.or') }}
		</div>
		<i18n-t
			class="edit-store__text"
			keypath="builder.editStoreModalDeleteStorePage"
		>
			<span class="edit-store__highlight">
				{{ $t('builder.editStoreModalDeleteStorePageSlot') }}
			</span>
		</i18n-t>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import EventLogApi from '@/api/EventLogApi';

import { defineComponent } from 'vue';

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

	methods: {
		handleCloseModal() {
			EventLogApi.logEvent({
				eventName: 'builder.choose_store_modal.close',
			});
		},
		handleButtonClick() {
			EventLogApi.logEvent({
				eventName: 'builder.choose_store_modal.click_button',
			});

			this.$emit('button-click');
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./style";
</style>
