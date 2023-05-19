<template>
	<ZyroModal
		max-width="600px"
		max-height="700px"
		height="auto"
		class="before-publish-modal"
		@close-modal="closeModal"
	>
		<div class="before-publish-modal__content">
			<h2 class="z-h4 before-publish-modal__title">
				{{ $t('builder.expiredSubscriptionModalTitle') }}
			</h2>
			<p class="z-body before-publish-modal__subtitle">
				{{ $t('builder.expiredSubscriptionModalSubtitle') }}
			</p>

			<ZyroButton
				v-qa="'builder-modal-beforepublish-btn'"
				theme="primary"
				color="black"
				size="sm"
				@click="redirectToSubscriptions({
					subscriptionId: subscription.id,
					websiteId,
				})"
			>
				{{ $t('builder.expiredSubscriptionModalButtonText') }}
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
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
	},

	setup() {
		const { redirectToSubscriptions } = useRedirects();

		return {
			redirectToSubscriptions,
		};
	},

	computed: {
		...mapState(['websiteId']),
		...mapState('subscription', ['subscription']),
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
	},
});
</script>

<style lang="scss" scoped>
.before-publish-modal {
	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48px;
		text-align: center;
	}

	&__title {
		margin-bottom: 16px;
	}

	&__subtitle {
		margin-bottom: 48px;
	}
}
</style>
