<template>
	<div
		v-qa="`ecommerce-modal-checkout-${dataQaModalType}`"
		class="payment-info"
	>
		<div class="payment-info__content">
			<h5 class="payment-info__title">
				{{ title }}
			</h5>
			<p class="payment-info__text body-large">
				{{ text }}
			</p>
			<button
				class="payment-info__button"
				type="primary"
				@click="$emit('handle-close')"
			>
				{{ buttonText }}
			</button>
		</div>
	</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'EcommerceModalContent',

	props: {
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		buttonText: {
			type: String,
			required: true,
		},
		dataQaModalType: {
			type: String,
			default: 'success',
		},
	},
});
</script>

<style lang="scss" scoped>
@import "./styles";

.payment-info__button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: auto;
	min-width: 150px;
	padding: 10px 16px;
	font-family: var(--body-font-family);
	font-size: 14px;
	color: $color-light;
	cursor: pointer;
	background-color: $color-azure;
	border-radius: 4px;
	transition: max-width 0.2s ease;
}
</style>
