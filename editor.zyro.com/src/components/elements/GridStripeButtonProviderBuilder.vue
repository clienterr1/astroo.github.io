<template>
	<div>
		<GridButton
			ref="stripeRef"
			tag-name="button"
			data-qa="builder-gridelement-stripecheckout"
			:content="content"
			:type="type"
			@click.prevent
			@drag.prevent
			@dragstart.prevent
		/>
		<div
			v-if="!isPriceIdValid || !isStripeKeyValid"
			class="stripe-warning"
			:style="warningStyle"
		>
			<ZyroTooltip
				toggle-event="hover"
				mode="dark"
				position="right"
			>
				<template #trigger>
					<ZyroSvgDeprecated
						name="warning"
						dimensions="32px"
					/>
				</template>
				{{ $t('builder.stripe.unfinishedSetup') }}
			</ZyroTooltip>
		</div>
	</div>
</template>

<script>
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';
import ZyroTooltip from '@/components/global/ZyroTooltip.vue';

import {
	ref,
	computed,
	defineComponent,
} from 'vue';
import { useStore } from 'vuex';

import GridButton from '@zyro-inc/site-modules/components/elements/button/GridButton.vue';
import { useGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridButton';
import { useStripeGridButton } from '@zyro-inc/site-modules/components/elements/button/useGridStripeButton';

import {
	STRIPE_PRICE_ID_REGEX,
	STRIPE_PUBLIC_KEY_REGEX,
} from '@/constants';

export default defineComponent({
	name: 'GridStripeButtonProviderBuilder',

	components: {
		ZyroSvgDeprecated,
		ZyroTooltip,
		GridButton,
	},

	props: {
		data: {
			type: Object,
			required: true,
		},
	},

	setup(props, context) {
		const stripeRef = ref(null);

		const {
			content,
			type,
		} = useGridButton(props, context);
		const { getters } = useStore();
		const { priceId } = useStripeGridButton(props);

		const WARNING_SIZE = 32;

		const warningStyle = computed(() => {
			if (!stripeRef.value?.$el) {
				return null;
			}

			const topOffset = (WARNING_SIZE + stripeRef.value.$el.clientHeight) / 2;
			const rightOffset = (WARNING_SIZE + stripeRef.value.$el.clientWidth) / 2;

			return {
				top: `calc(50% - ${topOffset}px)`,
				right: `calc(50% - ${rightOffset}px)`,
			};
		});

		const isPriceIdValid = computed(() => STRIPE_PRICE_ID_REGEX.test(priceId.value));
		const isStripeKeyValid = computed(() => STRIPE_PUBLIC_KEY_REGEX.test(getters.siteMeta?.stripePublicApiKey));

		return {
			stripeRef,
			warningStyle,
			content,
			type,
			priceId,
			isPriceIdValid,
			isStripeKeyValid,
		};
	},
});
</script>

<style>
.stripe-warning {
	position: absolute;
}
</style>
