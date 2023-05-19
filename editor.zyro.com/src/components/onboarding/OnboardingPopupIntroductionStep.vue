<template>
	<OnboardingPopupBase
		class="onboarding-introduction-popup"
		content-padding="48px 40px"
		max-width="540px"
		@close="$emit('close')"
	>
		<h4 class="onboarding-introduction-popup__title z-h5 z-font-weight-bold">
			{{ $t('builder.onboarding.welcome.title') }}
		</h4>
		<p class="onboarding-introduction-popup__subtitle z-body">
			{{ $t('builder.onboarding.welcome.description') }}
		</p>
		<iframe
			v-if="!isHostingerBrand"
			class="onboarding-introduction-popup__video"
			:src="ONBOARDING_INTRODUCTION_VIDEO_SRC"
			title="YouTube video player"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		/>
		<template #footer>
			<ZyroButton
				v-qa="'onboarding-btn-right'"
				theme="primary"
				class="onboarding-introduction-popup__button"
				@click="$emit('click-go-forward')"
			>
				{{ $t('builder.onboardingIntroductionStepButtonText') }}
			</ZyroButton>
		</template>
	</OnboardingPopupBase>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import OnboardingPopupBase from '@/components/onboarding/OnboardingPopupBase.vue';
import { ONBOARDING_INTRODUCTION_VIDEO_SRC } from '@/constants';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

export default defineComponent({
	components: {
		ZyroButton,
		OnboardingPopupBase,
	},

	setup() {
		return {
			isHostingerBrand,
			ONBOARDING_INTRODUCTION_VIDEO_SRC,
		};
	},
});
</script>

<style lang="scss" scoped>
@import "@zyro-inc/site-modules/scss/mixins/site-engine-mobile";

.onboarding-introduction-popup {
	text-align: center;

	&__title {
		margin-bottom: 16px;
	}

	&__subtitle {
		margin-bottom: 32px;
		color: $color-gray;
	}

	&__button {
		display: flex;
		margin-left: auto;
	}

	&__video {
		width: 460px;
		height: 258px;

		@include site-engine-mobile {
			width: 100%;
		}
	}
}
</style>
