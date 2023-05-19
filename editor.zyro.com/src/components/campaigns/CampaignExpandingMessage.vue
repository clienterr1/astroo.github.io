<template>
	<div
		v-if="isCampaignBannerShown"
		ref="messageTrigger"
		class="campaign-message"
		:class="{ [`campaign-message--${theme}`]: theme }"
	>
		<div
			class="campaign-message__pill"
			@click="toggleExpandingSection"
		>
			<span class="z-body-small campaign-message__title">
				{{ $t(campaignData.pillTextPath) }}
			</span>
			<ZyroSvgDeprecated
				class="campaign-message__pill-arrow"
				:class="{ 'campaign-message__pill-arrow--flipped' : isExpanded }"
				name="chevron"
			/>
		</div>
		<Popup
			v-if="isExpanded"
			placement="bottom"
			:target-ref="$refs.messageTrigger"
			@click-outside="isExpanded = false"
		>
			<div
				class="campaign-message__expandable-section"
				:class="{ 'campaign-message__expandable-section--black-friday': theme === THEME_BLACK_FRIDAY, }"
			>
				<p class="z-h5">
					{{ $t(campaignData.titleTextPath) }}:
				</p>
				<p class="z-h5">
					{{ $t(campaignData.subtitleTextPath, [biggestDiscountPercentage]) }}
				</p>
				<ul class="campaign-message__list">
					<li
						v-for="guaranteeText in guarateesTextList"
						:key="guaranteeText"
						class="campaign-message__list-item"
					>
						<ZyroSvgDeprecated name="check-mark" />
						<p class="campaign-message__list-item-text z-body-small">
							{{ guaranteeText }}
						</p>
					</li>
				</ul>
				<div class="campaign-message__button-wrapper">
					<ZyroButton
						theme="primary"
						color="plump-purple"
						@click="redirectToPricing"
					>
						{{ $t('builder.campaignExpandingMessageButtonText') }}
					</ZyroButton>
					<div class="campaign-message__timer z-body-small z-body-small--strong">
						{{ timerDays }} : {{ timerHours }} : {{ timerMinutes }} : {{ timerSeconds }}
					</div>
				</div>
				<div class="campaign-message__guarantee">
					<ZyroSvgDeprecated name="check-round-white" />
					<p class="z-body-small">
						{{ $t('builder.campaignExpandingMessageGuaranteeText') }}
					</p>
				</div>
			</div>
		</Popup>
	</div>
</template>
<script>
import ZyroButton from '@/components/global/ZyroButton.vue';
import ZyroSvgDeprecated from '@/components/global/ZyroSvgDeprecated.vue';

import { mapGetters } from 'vuex';

import { getCookie } from '@zyro-inc/site-modules/utils/cookies';
import Popup from '@/components/global/Popup.vue';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import {
	COOKIE_PRODUCTS_PRICING_VALUES,
	DEFAULT_BIGGEST_DISCOUNT_PERCENTAGE,
	REDIRECT_PARAM_KEYS,
	REDIRECT_PARAM_VALUES,
} from '@/constants';
import {
	useCampaigns,
	CAMPAIGN_BRAZIL_CONSUMERS_DAY,
	CAMPAIGN_SPRING,
	CAMPAIGN_BLACK_FRIDAY,
} from '@/use/useCampaigns';
import { useRedirects } from '@/use/useRedirects';

import { defineComponent } from 'vue';

const DEFAULT_LOWEST_PRODUCT_PRICE = '$2.90';
const THEME_BLACK_FRIDAY = 'black-friday';

const CAMPAIGNS_CONFIG = {
	[CAMPAIGN_BRAZIL_CONSUMERS_DAY]: {
		pillTextPath: 'builder.campaignExpandingMessageConsumerDayPillText',
		titleTextPath: 'builder.campaignExpandingMessageConsumerDayTitle',
		subtitleTextPath: 'builder.campaignExpandingMessageConsumerDaySubtitle',
	},
	[CAMPAIGN_SPRING]: {
		pillTextPath: 'builder.campaignExpandingMessageSpringTitle',
		titleTextPath: 'builder.campaignExpandingMessageSpringTitle',
		subtitleTextPath: 'builder.campaignExpandingMessageSpringSubtitle',
	},
	[CAMPAIGN_BLACK_FRIDAY]: {
		pillTextPath: 'builder.blackFriday.campaignExpandingMessagePillText',
		titleTextPath: 'builder.blackFriday.campaignExpandingMessageTitle',
		subtitleTextPath: 'builder.blackFriday.campaignExpandingMessageSubtitle',
		theme: THEME_BLACK_FRIDAY,
	},
};

export default defineComponent({
	components: {
		ZyroButton,
		ZyroSvgDeprecated,
		Popup,
	},

	setup() {
		const { redirectToWWWPayments } = useRedirects();
		const {
			timerDays,
			timerHours,
			timerMinutes,
			timerSeconds,
			campaigns,
		} = useCampaigns();

		return {
			redirectToWWWPayments,
			timerDays,
			timerHours,
			timerMinutes,
			timerSeconds,
			campaigns,
			THEME_BLACK_FRIDAY,
		};
	},

	data() {
		return {
			isExpanded: false,
		};
	},

	computed: {
		...mapGetters('subscription', [
			'hasActiveSubscription',
			'hasExpiredSubscription',
			'activeSitesSubscriptions',
			'hasActiveUnassignedSubscription',
		]),
		guarateesTextList() {
			return [
				this.$t('builder.campaignExpandingMessageFirstOffer'),
				this.$t('builder.campaignExpandingMessageSecondOffer'),
				this.$t('builder.campaignExpandingMessageThirdOffer', [this.lowestPrice]),
				this.$t('builder.campaignExpandingMessageFourthOffer'),
			];
		},
		campaignData() {
			if (this.campaigns[CAMPAIGN_BRAZIL_CONSUMERS_DAY]) {
				return CAMPAIGNS_CONFIG[CAMPAIGN_BRAZIL_CONSUMERS_DAY];
			}

			if (this.campaigns[CAMPAIGN_SPRING]) {
				return CAMPAIGNS_CONFIG[CAMPAIGN_SPRING];
			}

			if (this.campaigns[CAMPAIGN_BLACK_FRIDAY]) {
				return CAMPAIGNS_CONFIG[CAMPAIGN_BLACK_FRIDAY];
			}

			return null;
		},
		isCampaignBannerShown() {
			return !!this.campaignData && this.activeSitesSubscriptions.length === 0 && !this.hasExpiredSubscription && !isHostingerBrand;
		},
		biggestDiscountPercentage() {
			const productsPricingValuesCookie = getCookie(COOKIE_PRODUCTS_PRICING_VALUES);

			return productsPricingValuesCookie
				? JSON.parse(productsPricingValuesCookie).biggestDiscountPercentage
				: DEFAULT_BIGGEST_DISCOUNT_PERCENTAGE;
		},
		lowestPrice() {
			const productsPricingValuesCookie = getCookie(COOKIE_PRODUCTS_PRICING_VALUES);

			return productsPricingValuesCookie
				? JSON.parse(productsPricingValuesCookie).lowestProductPrice
				: DEFAULT_LOWEST_PRODUCT_PRICE;
		},
		theme() {
			return this.campaignData.theme;
		},
	},

	methods: {
		toggleExpandingSection() {
			this.isExpanded = !this.isExpanded;
		},
		redirectToPricing() {
			this.redirectToWWWPayments({
				[REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_BUILDER,
				[REDIRECT_PARAM_KEYS.PLANS_TO_SHOW]: REDIRECT_PARAM_VALUES.PLANS_TO_SHOW_ALL,
				[REDIRECT_PARAM_KEYS.ACTIVATE_PLAN]: true,
			});
		},
	},
});
</script>

<style lang="scss" scoped>
$linear-gradient-new-year: linear-gradient(180deg, $color-danger 0%, $color-danger-light 100%);
$background-color-black-friday-timer: rgba(255, 255, 255, 15%);

.campaign-message {
	$this: &;

	position: relative;
	display: flex;
	justify-content: center;

	&--black-friday {
		#{$this}__pill {
			background: $color-dark;
		}
	}

	&__title {
		white-space: nowrap;
	}

	&__pill {
		display: flex;
		align-items: center;
		padding: 6px 16px;
		margin: 0 8px;
		color: $color-light;
		cursor: pointer;
		user-select: none;
		background: $linear-gradient-new-year;
		border-radius: 16px;
	}

	&__pill-arrow {
		margin-left: 8px;
		transition: transform 0.2s ease-in-out;
		transform: rotate(180deg);

		&--flipped {
			transition: transform 0.2s ease-in-out;
			transform: rotate(360deg);
		}
	}

	&__expandable-section {
		position: relative;
		top: 9px;
		z-index: 0;
		width: 424px;
		padding: 24px;
		color: $color-light;
		background: $linear-gradient-new-year;
		border-radius: 8px;

		&::before {
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			content: "";
			background:
				url("../../components/campaigns/new-year-figure-left--big.png") left no-repeat,
				url("../../components/campaigns/new-year-figure-right--big.png") right no-repeat;
			background-size: contain;
			border-radius: 12px;
		}

		&--black-friday {
			background: $color-dark;

			&::before {
				background: url("../../components/campaigns/black-friday-message-background.png");
				background-size: cover;
			}
		}
	}

	&__list {
		margin: 24px 0;
	}

	&__list-item {
		line-height: 22px;
		list-style: none;
	}

	&__list-item-text {
		display: inline-block;
		margin-left: 8px;
	}

	&__button-wrapper {
		display: flex;
		gap: 10px;
		margin-bottom: 12px;
	}

	&__guarantee {
		display: flex;
		gap: 8px;
		align-items: center;
		color: $color-light;
	}

	&__timer {
		$timer-background: rgba($color-light, 0.15);

		position: relative;
		display: flex;
		padding: 8px 12px;
		background: $timer-background;
		border-radius: 4px;

		&::before {
			$triangle-dimension: 6px;

			position: absolute;
			top: 12px;
			left: -$triangle-dimension;
			display: block;
			width: 0;
			height: 0;
			content: "";
			border-top: $triangle-dimension solid transparent;
			border-right: $triangle-dimension solid $timer-background;
			border-bottom: $triangle-dimension solid transparent;
		}
	}
}
</style>
