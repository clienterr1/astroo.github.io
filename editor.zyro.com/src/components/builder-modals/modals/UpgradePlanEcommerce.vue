<template>
	<!-- This modal's code is copied from EditOnlineStoreModal.vue (reused, because another one was too big) -->
	<ZyroModal
		max-width="458px"
		max-height="auto"
		height="auto"
		width="auto"
		@close-modal="handleModalClose"
	>
		<div class="edit-store">
			<img
				src="@/assets/images/store-upgradeSite.png"
				:alt="$t('builder.editOnlineStoreModal.upgradeSite.title')"
				class="edit-store__image"
			>
			<h5 class="z-h5 z-font-weight-normal edit-store__title">
				{{ $t('builder.editOnlineStoreModal.upgradeSite.title') }}
			</h5>
			<div class="edit-store__text">
				{{ $t('builder.ecommerceUpgradeSite') }}
			</div>
			<ZyroButton
				v-qa="`builder-ecommercestoremanager-modal-btn-upgrade`"
				theme="primary"
				color="black"
				class="edit-store__btn"
				size="sm"
				@click="redirectToWWWPayments"
			>
				{{ $t('builder.editOnlineStoreModal.upgradeSite.btn') }}
			</ZyroButton>
		</div>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';

import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
	},

	setup() {
		const { redirectToWWWPayments } = useRedirects();

		return {
			redirectToWWWPayments,
		};
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
		handleModalClose() {
			this.closeModal();
		},
	},
});
</script>

<style lang="scss" scoped>
.edit-store {
	padding: 62px 4px 32px;
	text-align: center;

	&__image {
		display: inline-block;
		width: 100%;
		margin: 28px 0;
	}

	&__text {
		padding: 4px 0 24px;
		letter-spacing: 0.032em;
	}
}
</style>
