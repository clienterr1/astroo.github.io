<template>
	<div class="stripe-no-key">
		<ZyroSvgDeprecated
			class="stripe-no-key__logo"
			name="stripe-blurple"
		/>
		<p class="stripe-no-key__text z-body z-body-small">
			{{ $t('builder.editButton.stripe.acceptPayments') }}
		</p>
		<ZyroButton
			class="stripe-no-key__button"
			data-qa="stripe-settings-button-setupcheckout"
			theme="primary"
			@click="$emit('continue')"
		>
			{{ $t('builder.editButton.stripe.setup') }}
		</ZyroButton>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroSvgDeprecated,
		ZyroButton,
	},
});
</script>

<style lang="scss" scoped>
.stripe-no-key {
	text-align: center;

	&__logo {
		max-width: 100%;
		height: 60px;
		margin-bottom: 16px;
		color: $color-azure-dark;
	}

	&__text,
	&__button {
		margin: 0 auto 16px;
	}
}
</style>
