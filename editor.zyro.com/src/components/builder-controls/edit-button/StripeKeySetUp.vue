<template>
	<form
		class="stripe-set-up"
		@submit.prevent="$emit('save-key', tempApiKey)"
	>
		<div class="stripe-set-up__text">
			<p class="z-body z-body-small z-body-small--strong z-body--spaced">
				{{ $t('builder.editButton.stripe.setup') }}
			</p>
			<i18n-t
				tag="p"
				class="z-body z-body-small"
				keypath="builder.editButton.stripe.activateKey"
			>
				<a
					class="z-link"
					:href="$t('siteSettings.integrationStripeLinkHref')"
					target="_blank"
					v-text="$t('builder.editButton.stripe.activateKeyHow')"
				/>
			</i18n-t>
		</div>
		<ZyroFieldInput
			v-model="tempApiKey"
			class="stripe-set-up__field"
			input-data-qa="stripe-settings-setup-input-apikey"
			:placeholder="$t('builder.editButton.stripe.publicApiKey')"
			:label="$t('builder.editButton.stripe.publicApiKey')"
			:error="isApiKeyValid ? null : 'The publishable API key doesn\'t seem to be right. Please try again.'"
		/>
		<ZyroButton
			data-qa="stripe-settings-setup-button-save"
			class="stripe-set-up__button"
			theme="primary"
			type="submit"
		>
			{{ $t('common.save') }}
		</ZyroButton>
	</form>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroFieldInput,
	},

	props: {
		isApiKeyValid: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			tempApiKey: null,
		};
	},
});
</script>

<style lang="scss" scoped>
.stripe-set-up {
	text-align: center;

	&__text {
		margin: 24px 0;
	}

	&__field,
	&__button {
		margin-bottom: 16px;
	}
}
</style>
