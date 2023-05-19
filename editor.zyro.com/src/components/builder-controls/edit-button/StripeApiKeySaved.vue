<template>
	<div
		class="stripe-set-up-success"
	>
		<ZyroSvgDeprecated
			class="stripe-set-up-success__icon"
			name="check-circle"
			dimensions="24px"
		/>
		<p class="z-body z-body-small z-body-small--strong">
			{{ $t('builder.editButton.stripe.setUpSuccess') }}
		</p>
		<ZyroButton
			class="stripe-set-up-success__button"
			data-qa="stripe-settings-setup-addproduct"
			theme="primary"
			@click="$emit('continue')"
		>
			{{ $t('builder.editButton.stripe.addProduct') }}
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
.stripe-set-up-success {
	text-align: center;

	&__icon {
		color: $color-success;
	}

	&__icon,
	&__button {
		margin: 24px auto;
	}
}
</style>
