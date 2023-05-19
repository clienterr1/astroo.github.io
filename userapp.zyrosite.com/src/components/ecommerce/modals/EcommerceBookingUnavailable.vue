<template>
	<ModalLayout ref="modal">
		<ModalContent
			:title="translations.checkoutModalBookingUnavailable"
			:text="translations.checkoutModalChooseDifferentTime"
			:button-text="translations.gotIt"
			data-qa-modal-type="booking-unavailable"
			@handle-close="$refs.modal.handleCloseModalAction()"
		/>
	</ModalLayout>
</template>

<script>
import ModalContent from '@/components/ecommerce/modals/partials/ModalContent.vue';
import ModalLayout from '@/components/ecommerce/modals/partials/ModalLayout.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ModalLayout,
		ModalContent,
	},

	props: {
		translations: {
			type: Object,
			default: () => {},
		},
	},
});
</script>
