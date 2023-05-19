<template>
	<div>
		<div class="ecommerce-no-products">
			<p class="ecommerce-no-products__text z-body z-body-small">
				{{ $t('builder.editButton.ecommerce.noProducts') }}
			</p>
			<ZyroButton
				class="ecommerce-no-products__button"
				data-qa="ecommerce-settings-button-addproducts"
				theme="outline"
				@click="handleButtonClick"
			>
				{{ $t('builder.editButton.ecommerce.addProducts') }}
			</ZyroButton>
		</div>
		<NpsRateFeature
			:feature-name="$t('builder.npsRateOnlineStore')"
			:type="NPS_TYPE_FEATURE_SIMPLE_STORE"
		/>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import EventLogApi from '@/api/EventLogApi';
import NpsRateFeature from '@/components/ui/NpsRateFeature.vue';
import { NPS_TYPE_FEATURE_SIMPLE_STORE } from '@/constants';
import {
	mapActionsGui,
	OPEN_MODAL,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		NpsRateFeature,
	},

	setup() {
		const { redirectToEcommerceProducts } = useRedirects();

		return {
			redirectToEcommerceProducts,
			NPS_TYPE_FEATURE_SIMPLE_STORE,
		};
	},

	methods: {
		...mapActionsGui({
			openModal: OPEN_MODAL,
			closeModal: CLOSE_MODAL,
		}),
		handleButtonClick() {
			EventLogApi.logEvent({
				eventName: 'builder.buy_button.add_products',
			});

			this.redirectToEcommerceProducts();
		},
	},
});
</script>

<style lang="scss" scoped>
.ecommerce-no-products {
	margin-bottom: 24px;
	text-align: center;

	&__text {
		margin-bottom: 8px;
	}
}
</style>
