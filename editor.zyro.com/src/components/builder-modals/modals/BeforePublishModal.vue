<template>
	<ZyroModal
		max-width="518px"
		height="auto"
		class="before-publish-modal"
		@close-modal="closeModal"
	>
		<div class="before-publish-modal__content">
			<ZyroSvgDeprecated
				class="before-publish-modal__image"
				name="before-publish-modal"
			/>
			<h2 class="z-h5 before-publish-modal__title">
				{{ $t('builder.beforePublishTitle') }}
			</h2>
			<p class="z-body before-publish-modal__subtitle">
				{{ $t('builder.beforePublishSubtitle', [discountPercentage]) }}
			</p>

			<ZyroButton
				v-qa="'builder-modal-beforepublish-btn'"
				theme="primary"
				color="plump-purple"
				size="sm"
				@click="redirectToPayments"
			>
				{{ $t('builder.beforePublishModalButtonText') }}
			</ZyroButton>
		</div>
	</ZyroModal>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroModal from '@/components/global/ZyroModal.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { getCookie } from '@zyro-inc/site-modules/utils/cookies';

import {
	REDIRECT_PARAM_VALUES,
	REDIRECT_PARAM_KEYS,
	COOKIE_PRODUCTS_PRICING_VALUES,
	DEFAULT_BIGGEST_DISCOUNT_PERCENTAGE,
} from '@/constants';
import {
	mapActionsGui,
	CLOSE_MODAL,
} from '@/store/builder/gui';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		ZyroModal,
		ZyroSvgDeprecated,
	},

	setup() {
		const { redirectToWWWPayments } = useRedirects();
		const redirectToPayments = () => {
			redirectToWWWPayments({
				[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_PUBLISH,
			});
		};

		return {
			redirectToPayments,
		};
	},

	computed: {
		// The cookie is set on WWW side so we would not need to introduce the whole pricing module into builder
		// (it is needed to count this percentage)
		discountPercentage() {
			const productsPricingValuesCookie = getCookie(COOKIE_PRODUCTS_PRICING_VALUES);

			return productsPricingValuesCookie
				? JSON.parse(productsPricingValuesCookie).biggestDiscountPercentage : DEFAULT_BIGGEST_DISCOUNT_PERCENTAGE;
		},
	},

	methods: {
		...mapActionsGui({
			closeModal: CLOSE_MODAL,
		}),
	},
});
</script>

<style lang="scss" scoped>
.before-publish-modal {
	z-index: $z-index-popup;

	&__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 48px 48px 72px;
		text-align: center;
	}

	&__image {
		max-height: 96px;
		margin-bottom: 32px;
	}

	&__title {
		max-width: 360px;
		margin-bottom: 16px;
	}

	&__subtitle {
		margin-bottom: 32px;
	}
}
</style>
