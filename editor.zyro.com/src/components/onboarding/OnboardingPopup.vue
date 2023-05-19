<template>
	<OnboardingPopupBase @close="$emit('close')">
		<h4 class="onboarding-popup__title z-body z-body--strong">
			<slot name="title" />
		</h4>
		<p class="onboarding-popup__subtitle z-body-small">
			<slot name="subtitle" />
		</p>
		<div
			v-if="href"
			class="onboarding-popup__link"
		>
			<a
				class="z-link z-body-small"
				:href="href"
				target="_blank"
				rel="noopener noreferrer"
			>
				<slot name="link" />
			</a>
		</div>
		<template
			v-if="hasSlotContent($slots.media)"
			#media
			class="onboarding-popup__media"
		>
			<slot name="media" />
		</template>
		<template #footer>
			<div class="onboarding-popup__controls">
				<ZyroButton
					@click="$emit('click-go-back')"
				>
					<template #icon>
						<Icon
							name="wizard-arrow-left"
							dimensions="20px"
							is-custom
						/>
					</template>
				</ZyroButton>
				<p class="onboarding-popup__steps z-body-small">
					{{ `${currentStepNumber}/${maxStepsNumber}` }}
				</p>
				<ZyroButton
					v-qa="'onboarding-btn-right'"
					theme="primary"
					class="onboarding-popup__go-forward-button"
					@click="$emit('click-go-forward')"
				>
					<slot name="button-text">
						{{ $t('builder.onboarding.next') }}
					</slot>
				</ZyroButton>
			</div>
		</template>
	</OnboardingPopupBase>
</template>

<script>
import { defineComponent } from 'vue';

import { hasSlotContent } from '@zyro-inc/site-modules/utils/hasSlotContent';

import Icon from '@/components/global/Icon.vue';
import ZyroButton from '@/components/global/ZyroButton.vue';
import OnboardingPopupBase from '@/components/onboarding/OnboardingPopupBase.vue';

export default defineComponent({
	components: {
		Icon,
		ZyroButton,
		OnboardingPopupBase,
	},

	props: {
		href: {
			type: String,
			required: true,
		},
		currentStepNumber: {
			type: Number,
			default: 1,
		},
		maxStepsNumber: {
			type: Number,
			default: 2,
		},
	},

	setup() {
		return {
			hasSlotContent,
		};
	},
});
</script>

<style lang="scss" scoped>
.onboarding-popup {
	&__title {
		margin-bottom: 8px;
	}

	&__subtitle {
		color: $color-gray;
	}

	&__media {
		margin-top: 24px;
	}

	&__link {
		margin-top: 16px;
	}

	&__controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	&__go-forward-button {
		margin-left: 16px;
	}

	&__steps {
		margin-left: auto;
		color: $color-gray;
	}
}
</style>
