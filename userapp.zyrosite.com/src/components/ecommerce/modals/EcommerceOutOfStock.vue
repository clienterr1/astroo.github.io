<template>
	<ModalLayout ref="modal">
		<ModalContent
			:title="translations.checkoutModalOutOfStock"
			:text="translations.checkoutModalTryOrChoose"
			:button-text="translations.gotIt"
			data-qa-modal-type="outofstock"
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
