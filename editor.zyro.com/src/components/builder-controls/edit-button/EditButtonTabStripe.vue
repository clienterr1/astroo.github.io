<template>
	<div class="stripe-product">
		<StripeNoKey
			v-if="currentStep === STEP_NO_KEY"
			@continue="currentStep = STEP_NO_KEY_CONTINUE"
		/>
		<StripeKeySetUp
			v-if="currentStep === STEP_NO_KEY_CONTINUE"
			:is-api-key-valid="isApiKeyValid"
			@save-key="apiKey = $event"
		/>
		<StripeApiKeySaved
			v-else-if="currentStep === STEP_API_KEY_SET"
			@continue="currentStep = STEP_ADD_PRODUCT"
		/>
		<template v-else-if="currentStep === STEP_ADD_PRODUCT">
			<a
				:href="$t('siteSettings.integrationStripeLinkHref')"
				target="_blank"
				class="stripe-product__link"
			>
				<ZyroNotification
					class="stripe-product__notification"
					:message="isApiKeyTest ? $t('builder.editButton.stripe.usingTestKey') : $t('builder.editButton.stripe.usingLiveKey')"
					:type="isApiKeyTest ? 'warning': 'info'"
					:padding="'8px 14px'"
				/>
			</a>
			<ZyroFieldInput
				:model-value="priceId"
				input-data-qa="stripe-settings-input-priceid"
				class="stripe-product__price-id-field"
				:placeholder="$t('builder.editButton.stripe.priceId')"
				:error="!isPriceIdValid && priceId.length > 0"
				:label="$t('builder.editButton.stripe.priceId')"
				@update:model-value="updatePriceId"
			>
				<template #error>
					{{ $t('builder.editButton.stripe.priceIdIncorrect') }}
					<a
						class="stripe-product__notification--error-link"
						:href="$t('siteSettings.integrationStripeLinkHref')"
					>
						{{ $t('builder.editButton.stripe.findPriceId') }}
					</a>
				</template>
			</ZyroFieldInput>
			<a
				v-if="isPriceIdValid || priceId.length === 0"
				class="z-body-small z-link setting-description"
				:href="$t('siteSettings.integrationStripeLinkHref')"
				target="_blank"
			>
				{{ $t('builder.editButton.stripe.findPriceId') }}
			</a>
			<ZyroLabel class="label">
				{{ $t('builder.editButton.stripe.paymentType') }}
			</ZyroLabel>
			<ZyroSegmentControl
				class="segment-control"
				:controls="PAYMENT_TYPES"
				:active-control="paymentType"
				@update:active-control="paymentType = $event"
			/>
			<ZyroLabel class="label">
				{{ $t('builder.editButton.stripe.successPage') }}
			</ZyroLabel>
			<ZyroDropdown
				:model-value="successPage"
				:options="pages"
				class="page-dropdown"
				@update:model-value="updateSuccessPage"
			/>
			<p class="z-body-small setting-description">
				{{ $t('builder.editButton.stripe.successPageDescription') }}
			</p>
			<ZyroLabel class="label">
				{{ $t('builder.editButton.stripe.cancellationPage') }}
			</ZyroLabel>
			<ZyroDropdown
				:model-value="cancellationPage"
				:options="pages"
				class="page-dropdown"
				@update:model-value="updateCancellationPage"
			/>
			<p class="z-body-small setting-description">
				{{ $t('builder.editButton.stripe.cancelPageDescription') }}
			</p>
		</template>
	</div>
</template>

<script>
import ZyroDropdown from '@/components/global/ZyroDropdown.vue';
import ZyroFieldInput from '@/components/global/ZyroFieldInput.vue';
import ZyroLabel from '@/components/global/ZyroLabel.vue';
import ZyroSegmentControl from '@/components/global/ZyroSegmentControl.vue';

import {
	mapGetters,
	mapMutations,
	mapActions,
} from 'vuex';

import { capitalizeFirstLetter } from '@zyro-inc/site-modules/utils/modifyString';

import {
	STRIPE_PUBLIC_KEY_REGEX,
	STRIPE_PRICE_ID_REGEX,
} from '@/constants';

import StripeApiKeySaved from '@/components/builder-controls/edit-button/StripeApiKeySaved.vue';
import StripeKeySetUp from '@/components/builder-controls/edit-button/StripeKeySetUp.vue';
import StripeNoKey from '@/components/builder-controls/edit-button/StripeNoKey.vue';
import ZyroNotification from '@/components/site-settings/components/ZyroNotification.vue';
import { useI18n } from 'vue-i18n';

import { defineComponent } from 'vue';

const STEP_ADD_PRODUCT = 'addProduct';
const STEP_NO_KEY = 'noKey';
const STEP_API_KEY_SET = 'apiKeySet';
const STEP_NO_KEY_CONTINUE = 'noKeyContinue';

export default defineComponent({
	components: {
		ZyroDropdown,
		ZyroFieldInput,
		ZyroLabel,
		ZyroSegmentControl,
		ZyroNotification,
		StripeApiKeySaved,
		StripeKeySetUp,
		StripeNoKey,
	},

	setup() {
		const { t } = useI18n();

		const PAYMENT_TYPES = [
			{
				title: t('builder.editButton.stripe.paymentPayment'),
				value: 'payment',
			},
			{
				title: t('builder.editButton.stripe.paymentRecurring'),
				value: 'subscription',
			},
		];

		return {
			PAYMENT_TYPES,
			STEP_ADD_PRODUCT,
			STEP_NO_KEY,
			STEP_API_KEY_SET,
			STEP_NO_KEY_CONTINUE,
		};
	},

	data() {
		return {
			currentStep: null,
			isApiKeyValid: true,
		};
	},

	computed: {
		...mapGetters([
			'siteMeta',
			'currentElementSettings',
			'defaultPages',
		]),
		pages() {
			return Object.entries(this.defaultPages).map(([id, page]) => ({
				id,
				path: page.slug,
				title: page.name
					|| capitalizeFirstLetter(page.slug)
					|| 'Home',
			}));
		},
		paymentType: {
			get() {
				const currentType = this.currentElementSettings?.paymentType || 'payment';
				const paymentObject = this.PAYMENT_TYPES.find((payment) => payment.value === currentType);

				return paymentObject;
			},
			set(payment) {
				this.mergeCurrentElementData({
					elementData: {
						settings: {
							paymentType: payment.value,
						},
					},
				});
			},
		},
		successPage() {
			const { successPageId } = this.currentElementSettings;
			const successPage = this.pages.find(({ id }) => id === successPageId);

			return successPage || Object.values(this.pages)[0];
		},
		cancellationPage() {
			const { cancellationPageId } = this.currentElementSettings;
			const cancellationPage = this.pages.find(({ id }) => id === cancellationPageId);

			return cancellationPage || Object.values(this.pages)[0];
		},
		priceId() {
			return this.currentElementSettings?.priceId || '';
		},
		apiKey: {
			get() {
				return this.siteMeta?.stripePublicApiKey || '';
			},
			set(value) {
				this.isApiKeyValid = STRIPE_PUBLIC_KEY_REGEX.test(value);
				if (this.isApiKeyValid) {
					this.currentStep = STEP_API_KEY_SET;
					this.setWebsiteMeta({
						key: 'stripePublicApiKey',
						value,
					});
				}
			},
		},
		isApiKeyTest() {
			return this.apiKey.includes('test');
		},
		isPriceIdValid() {
			return STRIPE_PRICE_ID_REGEX.test(this.priceId);
		},
	},

	created() {
		this.currentStep = this.apiKey ? STEP_ADD_PRODUCT : STEP_NO_KEY;
	},

	methods: {
		...mapMutations(['setWebsiteMeta']),
		...mapActions(['mergeCurrentElementData']),

		updateSuccessPage(page) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						successPageId: page.id,
					},
				},
			});
		},
		updateCancellationPage(page) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						cancellationPageId: page.id,
					},
				},
			});
		},
		updatePriceId(newValue) {
			this.mergeCurrentElementData({
				elementData: {
					settings: {
						priceId: newValue,
					},
				},
			});
		},
	},
});
</script>
<style lang="scss" scoped>
.stripe-product {
	&__price-id-field {
		margin-bottom: 4px;
	}

	&__notification {
		margin: 0 0 16px;

		&--error-link {
			text-decoration: underline;
			cursor: pointer;
		}
	}

	&__link {
		text-decoration: none;
	}
}

.label,
.segment-control {
	margin-bottom: 8px;
}

.setting-description {
	display: inline-block;
	margin-bottom: 12px;
	color: $color-gray;
}

.page-dropdown {
	margin-bottom: 8px;
}
</style>
