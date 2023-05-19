<template>
	<Component
		:is="openEcommerceModalName"
		v-if="openEcommerceModalName"
		:translations="ecommerceTranslations"
		:language="language"
		:current-locale="currentLocale"
		:is-cart-visible="isCartVisible"
		is-quick-preview
	/>
</template>

<script>
import {
	defineComponent,
	onMounted,
} from 'vue';

import EcommerceProductPreview from '@/components/ecommerce/modals/EcommerceProductPreview.vue';
import EcommerceBookingEventSelect from '@/components/ecommerce/modals/EcommerceBookingEventSelect.vue';
import EcommerceBookingUnavailable from '@/components/ecommerce/modals/EcommerceBookingUnavailable.vue';
import EcommerceCheckoutFailed from '@/components/ecommerce/modals/EcommerceCheckoutFailed.vue';
import EcommerceCheckoutSuccess from '@/components/ecommerce/modals/EcommerceCheckoutSuccess.vue';
import EcommerceMessageButtonDisabled from '@/components/ecommerce/modals/EcommerceMessageButtonDisabled.vue';
import EcommerceOutOfStock from '@/components/ecommerce/modals/EcommerceOutOfStock.vue';
import { useEcommerceModal } from '@/components/ecommerce/modals/useEcommerceModal';

const OPEN_MODAL_QUERY_PARAM = 'open-modal';

export default defineComponent({
	components: {
		EcommerceProductPreview,
		EcommerceBookingEventSelect,
		EcommerceBookingUnavailable,
		EcommerceCheckoutFailed,
		EcommerceCheckoutSuccess,
		EcommerceMessageButtonDisabled,
		EcommerceOutOfStock,
	},

	props: {
		ecommerceTranslations: {
			type: Object,
			default: () => ({}),
		},
		language: {
			type: String,
			default: 'en',
		},
		currentLocale: {
			type: String,
			required: true,
		},
		isCartVisible: {
			type: Boolean,
			default: false,
		},
	},

	setup() {
		const {
			openEcommerceModal,
			closeEcommerceModal,
			openEcommerceModalName,
		} = useEcommerceModal();

		onMounted(() => {
			const params = new URLSearchParams(window.location.search);
			const queryModalName = params.get(OPEN_MODAL_QUERY_PARAM);

			if (queryModalName) {
				openEcommerceModal(queryModalName);
			}
		});

		return {
			openEcommerceModal,
			closeEcommerceModal,
			openEcommerceModalName,
		};
	},

});
</script>
