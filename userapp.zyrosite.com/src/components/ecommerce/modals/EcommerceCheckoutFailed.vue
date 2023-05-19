<template>
	<ModalLayout ref="modal">
		<ModalContent
			:title="translations.checkoutModalCantAcceptOrders"
			:text="translations.checkoutModalPleaseContact"
			:button-text="translations.close"
			data-qa-modal-type="failed"
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
