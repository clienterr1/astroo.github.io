<template>
	<ZyroModal
		max-width="868px"
		max-height="200px"
		class="publish-error-modal"
		@close-modal="closeModal"
	>
		<h2 class="publish-error-modal__title z-h4">
			{{ $t('builder.publishErrorModal.title') }}
		</h2>
		<p class="publish-error-modal__subtitle z-body-small">
			{{ $t('builder.publishErrorModal.subtitle') }}
		</p>
	</ZyroModal>
</template>

<script>
import ZyroModal from '@/components/global/ZyroModal.vue';

import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroModal,
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
	},
});
</script>

<style lang="scss" scoped>
.publish-error-modal {
	/* stylelint-disable-next-line selector-class-pattern */
	:deep(.modal__content) {
		display: flex;
		flex-direction: column;
		padding: 50px 66px;
	}

	&__title {
		color: $color-dark;
		text-align: center;
	}

	&__subtitle {
		max-width: 280px;
		margin: 9px auto 20px;
		color: $color-gray;
		text-align: center;
	}
}
</style>
