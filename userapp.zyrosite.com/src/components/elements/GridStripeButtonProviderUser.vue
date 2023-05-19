<template>
	<GridButton
		v-qa="'button-stripe-checkout'"
		tag-name="button"
		:content="content"
		:type="type"
		:is-disabled="isLoadingStripeScript"
		@click="handleClick"
	/>
</template>

<script>

import {
	ref,
	defineComponent,
	computed,
} from 'vue';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridButton';
import { useStripeGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridStripeButton';
import { useStore } from 'vuex';

const STRIPE_JS_URL = 'https://js.stripe.com/v3';

export default defineComponent({
	name: 'GridStripeButtonProviderUser',

	components: {
		GridButton,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
		successPageSlug: {
			type: String,
			required: true,
		},
		cancellationPageSlug: {
			type: String,
			required: true,
		},
		stripePublicApiKey: {
			type: String,
			default: '',
		},
	},

	setup(props, context) {
		const { getters } = useStore();
		const {
			content,
			type,
		} = useGridButton(props, context, {
			href: computed(() => getters.getButtonHref({
				isFormButton: props.data.settings.isFormButton,
				linkedPageId: props.data.linkedPageId,
				linkType: props.data.linkType,
				href: props.data.href,
			})),
		});

		const {
			stripeInstance,
			priceId,
			paymentType,
		} = useStripeGridButton(props);

		const isLoadingStripeScript = ref(false);

		// Loads and appends stripe script to DOM
		const loadScript = () => new Promise((resolve, reject) => {
			const isStripeLoaded = !!(stripeInstance.value && window.Stripe);

			if (isStripeLoaded) {
				resolve();

				return;
			}

			const script = document.createElement('script');

			script.addEventListener('load', () => {
				if (window.Stripe) {
					stripeInstance.value = window.Stripe(props.stripePublicApiKey);
					resolve();
				}
			});

			script.addEventListener('error', () => {
				reject();
			});

			// Stripe docs require to always load from this url
			script.src = STRIPE_JS_URL;

			document.head.appendChild(script);
		});

		// Triggers load script, redirects to checkout
		const handleClick = async () => {
			if (!priceId.value) {
				return;
			}

			isLoadingStripeScript.value = true;

			await loadScript();

			isLoadingStripeScript.value = false;

			stripeInstance.value.redirectToCheckout({
				lineItems: [
					{
						price: priceId.value,
						quantity: 1,
					},
				],
				mode: paymentType.value,
				/**
				 * TODO:
				 * What to do in builder?
				 * Add default pages
				 */
				successUrl: `${window.location.origin}/${props.successPageSlug}`,
				cancelUrl: `${window.location.origin}/${props.cancellationPageSlug}`,
			})
				.then((result) => {
					if (result.error) {
						// eslint-disable-next-line no-console
						console.error(result.error.message);
					}
				});
		};

		return {
			content,
			type,
			isLoadingStripeScript,
			handleClick,
		};
	},
});
</script>
