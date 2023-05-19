<template>
	<ModalLayout
		v-if="isEcommerceStoreCreated"
		ref="modal"
	>
		<ModalContent
			:title="modalContent.title"
			:text="modalContent.text"
			:button-text="modalContent.buttonText"
			:data-qa-modal-type="modalContent.modalType"
			@handle-close="$refs.modal.handleCloseModalAction()"
		/>
	</ModalLayout>
</template>

<script>
import {
	mapActions,
	mapGetters,
} from 'vuex';
import {
	defineComponent,
	onMounted,
	ref,
} from 'vue';
import {
	PRODUCT_TYPE_DONATION,
	PRODUCT_TYPE_BOOKING,
} from '@zyro-inc/site-modules/constants/ecommerce';
import ModalContent from '@/components/ecommerce/modals/partials/ModalContent.vue';
import ModalLayout from '@/components/ecommerce/modals/partials/ModalLayout.vue';

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
	setup(props) {
		const modalContent = ref({
			title: props.translations.checkoutModalThanksForOrder,
			text: props.translations.checkoutModalOrderReceived,
			buttonText: props.translations.gotIt,
			modalType: 'success-order',
		});

		onMounted(() => {
			const params = new URLSearchParams(window.location.search);
			const productType = params.get('product');

			if (productType === PRODUCT_TYPE_BOOKING) {
				modalContent.value = {
					title: props.translations.checkoutModalThanksForOrder,
					text: props.translations.checkoutModalSuccessfullyBooked,
					buttonText: props.translations.gotIt,
					modalType: 'success-orderbooking',
				};
			} else if (productType === PRODUCT_TYPE_DONATION) {
				modalContent.value = {
					title: props.translations.checkoutModalThanksForDonation,
					text: props.translations.checkoutModalDonationReceived,
					buttonText: props.translations.gotIt,
					modalType: 'success-orderdonation',
				};
			}
		});

		return {
			modalContent,
		};
	},
	computed: {
		...mapGetters('ecommerce', ['isEcommerceStoreCreated']),
	},
	created() {
		this.setShoppingCartItems([]);
	},
	methods: {
		...mapActions('ecommerce', ['setShoppingCartItems']),
	},
});
</script>
