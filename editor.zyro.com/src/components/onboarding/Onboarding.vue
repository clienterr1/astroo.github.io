<template>
	<div class="onboarding">
		<OnboardingPopupIntroductionStep
			v-if="currentOnboardingStep === ONBOARDING_STEP_INTRODUCTION"
			:key="ONBOARDING_STEP_INTRODUCTION"
			ref="onboardingPopupRef"
			content-padding="48px 40px"
			@close="stopOnboarding"
			@click-go-forward="goToNextOnboardingStep"
			@vue:mounted="showIntroductionStepPopup"
		/>
		<OnboardingPopup
			v-else-if="currentOnboardingStep === ONBOARDING_STEP_MULTI_PAGE_DRAWER"
			ref="onboardingPopupRef"
			:key="ONBOARDING_STEP_MULTI_PAGE_DRAWER"
			:current-step-number="1"
			:max-steps-number="onboardingStepsCountToShow"
			:href="!isHostingerBrand ? 'https://www.youtube.com/watch?v=mYrGIXbWpUQ' : ''"
			@click-go-back="goToPreviousOnboardingStep"
			@click-go-forward="goToNextOnboardingStep"
			@close="stopOnboarding"
			@vue:mounted="showDrawerStep({ drawerId: DRAWER_MULTI_PAGE })"
		>
			<template #title>
				{{ $t('builder.onboarding.editPages.title') }}
			</template>
			<template #subtitle>
				{{ $t('builder.onboarding.editPages.description') }}
			</template>
			<template #link>
				{{ $t('builder.onboardingAddPagesStepLinkText') }}
			</template>
		</OnboardingPopup>
		<OnboardingPopup
			v-else-if="currentOnboardingStep === ONBOARDING_STEP_ADD_ELEMENTS_DRAWER"
			ref="onboardingPopupRef"
			:key="ONBOARDING_STEP_ADD_ELEMENTS_DRAWER"
			:current-step-number="2"
			:max-steps-number="onboardingStepsCountToShow"
			:href="!isHostingerBrand ? 'https://www.youtube.com/watch?v=xZ-331lAT5Q' : ''"
			@click-go-back="goToPreviousOnboardingStep"
			@click-go-forward="goToNextOnboardingStep"
			@close="stopOnboarding"
			@vue:mounted="showDrawerStep({ drawerId: DRAWER_ADD_ELEMENT })"
		>
			<template #title>
				{{ $t('builder.onboarding.addElements.title') }}
			</template>
			<template #subtitle>
				{{ $t('builder.onboarding.addElements.description') }}
			</template>
			<template #link>
				{{ $t('builder.onboardingAddElementStepLinkText') }}
			</template>
		</OnboardingPopup>
		<OnboardingPopup
			v-else-if="currentOnboardingStep === ONBOARDING_STEP_USER_STYLES_DRAWER"
			ref="onboardingPopupRef"
			:key="ONBOARDING_STEP_USER_STYLES_DRAWER"
			:current-step-number="3"
			:max-steps-number="onboardingStepsCountToShow"
			:href="!isHostingerBrand ? 'https://support.zyro.com/articles/6043621-how-to-customize-a-website#h_a6dc2a367b' : ''"
			@click-go-back="goToPreviousOnboardingStep"
			@click-go-forward="goToNextOnboardingStep"
			@close="stopOnboarding"
			@vue:mounted="showDrawerStep({ drawerId: DRAWER_USER_STYLES })"
		>
			<template #title>
				{{ $t('builder.onboarding.changeStyles.title') }}
			</template>
			<template #subtitle>
				{{ $t('builder.onboarding.changeStyles.descriptionV2') }}
			</template>
			<template #link>
				{{ $t('builder.onboardingChangeStylesStepLinkText') }}
			</template>
		</OnboardingPopup>
		<OnboardingPopup
			v-else-if="currentOnboardingStep === ONBOARDING_STEP_MOBILE_VIEW"
			ref="onboardingPopupRef"
			:key="ONBOARDING_STEP_MOBILE_VIEW"
			:current-step-number="4"
			:max-steps-number="onboardingStepsCountToShow"
			:href="!isHostingerBrand ? 'https://support.zyro.com/en/articles/4318720-how-to-edit-mobile-and-desktop-views-separately' : ''"
			@click-go-back="goBackFromMobileStep"
			@click-go-forward="goToNextOnboardingStep"
			@close="stopOnboarding"
			@vue:mounted="showMobileStepPopup"
		>
			<template #title>
				{{ $t('builder.onboarding.mobileView.title') }}
			</template>
			<template #subtitle>
				{{ $t('builder.onboarding.mobileView.description') }}
			</template>
			<template #link>
				{{ $t('builder.onboardingMobileStepLinkText') }}
			</template>
		</OnboardingPopup>
		<OnboardingPopup
			v-else-if="currentOnboardingStep === ONBOARDING_STEP_PUBLISH"
			ref="onboardingPopupRef"
			:key="ONBOARDING_STEP_PUBLISH"
			:current-step-number="5"
			:max-steps-number="onboardingStepsCountToShow"
			:href="!isHostingerBrand ? 'https://www.youtube.com/watch?v=X4cRv7_OwRE' : ''"
			@click-go-back="goToPreviousOnboardingStep"
			@click-go-forward="goToNextOnboardingStep"
			@close="stopOnboarding"
			@vue:mounted="showPublishStepPopup"
		>
			<template #title>
				{{ $t('builder.onboarding.goLive.titleV2') }}
			</template>
			<template #subtitle>
				{{ isHostingerBrand
					? $t('builder.onboardingPublishStepHostingerText')
					: $t('builder.onboarding.goLive.description')
				}}
			</template>
			<template #link>
				{{ $t('builder.onboardingPublishStepLinkText') }}
			</template>
			<template #button-text>
				{{ $t('builder.onboardingFinish') }}
			</template>
		</OnboardingPopup>
		<OnboardingPopupBase
			v-if="currentOnboardingStep === ONBOARDING_STEP_RESTART_TOUR"
			ref="onboardingPopupRef"
			:is-with-close-button="false"
			content-padding="24px"
			@vue:mounted="showDrawerStep({
				drawerId: DRAWER_HELP_AND_RESOURCES,
				popupPlacement: 'right-end',
				isHighlighted: false,
			})"
		>
			<h4 class="onboarding__restart-tour-title z-body z-body--strong">
				{{ $t('builder.onboardingRestartTourPopupTitle') }}
			</h4>
			<p class="onboarding__restart-tour-subtitle z-body-small">
				{{ $t('builder.onboardingRestartTourPopupDescription') }}
			</p>
			<ZyroButton
				theme="primary"
				@click="handleRestartTourButtonClick"
			>
				{{ $t('builder.onboardingRestartTourButtonText') }}
			</ZyroButton>
		</OnboardingPopupBase>
	</div>
</template>

<script>
import ZyroButton from '@/components/global/ZyroButton.vue';

import {
	DRAWER_ADD_ELEMENT,
	DRAWER_MULTI_PAGE,
	DRAWER_USER_STYLES,
	DRAWER_HELP_AND_RESOURCES,

	SIDEBAR_WIDTH,
	EXPANDED_SIDEBAR_WIDTH,
	ONBOARDING_STEP_INTRODUCTION,
	ONBOARDING_STEP_MULTI_PAGE_DRAWER,
	ONBOARDING_STEP_ADD_ELEMENTS_DRAWER,
	ONBOARDING_STEP_USER_STYLES_DRAWER,
	ONBOARDING_STEP_MOBILE_VIEW,
	ONBOARDING_STEP_PUBLISH,
	ONBOARDING_STEP_RESTART_TOUR,
} from '@/constants';
import {
	mapStateGui,
	mapActionsGui,
	OPEN_DRAWER,
	CLOSE_DRAWER,
} from '@/store/builder/gui';
import { createPopper } from '@popperjs/core';
import {
	disableBodyScroll,
	enableBodyScroll,
} from 'body-scroll-lock';

import OnboardingPopup from '@/components/onboarding/OnboardingPopup.vue';
import OnboardingPopupBase from '@/components/onboarding/OnboardingPopupBase.vue';
import OnboardingPopupIntroductionStep from '@/components/onboarding/OnboardingPopupIntroductionStep.vue';

import {
	PUBLISH_BUTTON_SELECTOR,
	BUILDER_SIDEBAR_SELECTOR,
	MOBILE_SWITCH_BUTTON_SELECTOR,
} from '@/components/onboarding/onboardingSelectors';
import { useOnboarding } from '@/components/onboarding/useOnboarding';
import { useOverlay } from '@/use/useOverlay';
import { useQuickStartGuide } from '@/use/useQuickStartGuide';
import { isHostingerBrand } from '@/utils/isHostingerBrand';

import { defineComponent } from 'vue';

// Modifier to center popup on screen for popper.js
// https://github.com/popperjs/popper-core/issues/642#issuecomment-718744895
const POPPER_CENTER_ON_SCREEN = {
	name: 'computeStyles',
	enabled: true,
	fn({ state }) {
		state.styles.popper = {
			...state.styles.popper,
			position: 'fixed',
			left: `${(window.innerWidth - state.rects.popper.width) / 2}px`,
			top: '50%',
			transform: 'translateY(-50%)',
		};

		return state;
	},
};

// Same for all instances
const SHARED_MODIFIERS = [
	{
		name: 'arrow',
		options: {
			padding: 6,
		},
	},
	{
		name: 'preventOverflow',
		options: {
			padding: {
				top: 64,
			},
		},
	},
	{
		name: 'offset',
		options: {
			offset: [
				-24,
				24,
			],
		},
	},
];

export default defineComponent({
	components: {
		ZyroButton,
		OnboardingPopup,
		OnboardingPopupBase,
		OnboardingPopupIntroductionStep,
	},

	setup() {
		const {
			goToNextOnboardingStep,
			goToPreviousOnboardingStep,
			onboardingStepsCountToShow,
			currentOnboardingStep,
			currentOnboardingStepIndex,
			endOnboarding,
			onboardingEndCallback,
		} = useOnboarding();
		const {
			setHighlightedElement,
			setHighlightedElementCoordinates,
			isHighlightedElementInteractive,
			resetHighlightedElement,
		} = useOverlay();
		const { openQuickStartGuide } = useQuickStartGuide();

		return {
			isHostingerBrand,
			onboardingStepsCountToShow,
			currentOnboardingStep,
			goToPreviousOnboardingStep,
			goToNextOnboardingStep,
			currentOnboardingStepIndex,
			endOnboarding,
			onboardingEndCallback,
			setHighlightedElement,
			setHighlightedElementCoordinates,
			resetHighlightedElement,
			isHighlightedElementInteractive,
			openQuickStartGuide,
			PUBLISH_BUTTON_SELECTOR,
			BUILDER_SIDEBAR_SELECTOR,
			DRAWER_ADD_ELEMENT,
			DRAWER_MULTI_PAGE,
			DRAWER_USER_STYLES,
			DRAWER_HELP_AND_RESOURCES,
			POPPER_CENTER_ON_SCREEN,
			ONBOARDING_STEP_INTRODUCTION,
			ONBOARDING_STEP_MULTI_PAGE_DRAWER,
			ONBOARDING_STEP_ADD_ELEMENTS_DRAWER,
			ONBOARDING_STEP_USER_STYLES_DRAWER,
			ONBOARDING_STEP_MOBILE_VIEW,
			ONBOARDING_STEP_PUBLISH,
			ONBOARDING_STEP_RESTART_TOUR,
		};
	},

	data() {
		return {
			popperInstance: null,
		};
	},

	computed: {
		...mapStateGui({
			isMobileScreen: 'isMobileScreen',
			isSidebarExpanded: 'isSidebarExpanded',
		}),
	},

	mounted() {
		disableBodyScroll(this.$refs.onboardingPopupRef);
	},

	methods: {
		...mapActionsGui({
			openDrawer: OPEN_DRAWER,
			closeDrawer: CLOSE_DRAWER,
			toggleMobileView: 'toggleMobileView',
		}),
		goBackFromMobileStep() {
			if (!this.isMobileScreen) {
				this.toggleMobileView();
			}

			this.goToPreviousOnboardingStep();
		},
		stopOnboarding() {
			this.destroyPopper();
			this.onboardingEndCallback = null;
			this.endOnboarding();
			enableBodyScroll(this.$refs.onboardingPopupRef);
		},
		destroyPopper() {
			if (this.popperInstance) {
				this.popperInstance.destroy();
			}
		},
		getElementPopperReference(selector) {
			return `[data-popper-reference="${selector}"]`;
		},
		updateStep({
			selector,
			customPopperOptions = {},
		} = {}) {
			this.destroyPopper();

			const mergedModifiers = customPopperOptions.modifiers ? [
				...SHARED_MODIFIERS,
				customPopperOptions.modifiers,
			] : SHARED_MODIFIERS;

			const popperOptions = {
				placement: customPopperOptions.placement || 'right-end',
				modifiers: mergedModifiers,
				strategy: 'fixed',
			};

			// Get dom elements
			const elementPopperReference = this.getElementPopperReference(selector);
			const target = document.querySelector(elementPopperReference);

			this.popperInstance = createPopper(target, this.$refs.onboardingPopupRef.$el, popperOptions);
		},
		showIntroductionStepPopup() {
			this.resetHighlightedElement();
			this.updateStep({
				selector: PUBLISH_BUTTON_SELECTOR,
				customPopperOptions: {
					modifiers: POPPER_CENTER_ON_SCREEN,
				},
			});
		},
		async showDrawerStep({
			drawerId,
			popupPlacement = 'right-start',
		}) {
			this.openDrawer({
				id: drawerId,
			});
			// Drawer appears in the DOM only after next tick
			await this.$nextTick();

			const elementPopperSelector = this.getElementPopperReference(BUILDER_SIDEBAR_SELECTOR);
			const sidebarElement = document.querySelector(elementPopperSelector);

			this.updateStep({
				selector: BUILDER_SIDEBAR_SELECTOR,
				customPopperOptions: {
					placement: popupPlacement,
				},
			});

			const {
				x,
				y,
				width,
				height,
			} = sidebarElement.getBoundingClientRect();

			// We want to highlight not only the drawer, but sidebar as well - so we adjust the X and WIDTH values
			this.setHighlightedElementCoordinates({
				x: this.isSidebarExpanded ? x - EXPANDED_SIDEBAR_WIDTH : x - SIDEBAR_WIDTH,
				y,
				width: this.isSidebarExpanded ? width + EXPANDED_SIDEBAR_WIDTH : width + SIDEBAR_WIDTH,
				height,
			});
			this.isHighlightedElementInteractive = true;
		},
		showPublishStepPopup() {
			if (!this.isMobileScreen) {
				this.toggleMobileView();
			}

			this.updateStep({
				selector: PUBLISH_BUTTON_SELECTOR,
				customPopperOptions: {
					placement: 'bottom-start',
				},
			});

			const elementPopperReference = this.getElementPopperReference(PUBLISH_BUTTON_SELECTOR);

			this.setHighlightedElement({
				element: document.querySelector(elementPopperReference),
			});
		},
		showMobileStepPopup() {
			this.closeDrawer();

			this.updateStep({
				selector: MOBILE_SWITCH_BUTTON_SELECTOR,
				customPopperOptions: {
					placement: 'bottom-start',
				},
			});

			const elementPopperReference = this.getElementPopperReference(MOBILE_SWITCH_BUTTON_SELECTOR);

			this.setHighlightedElement({
				element: document.querySelector(elementPopperReference),
			});
			if (!this.isMobileScreen) {
				this.toggleMobileView();
			}
		},
		handleRestartTourButtonClick() {
			this.endOnboarding();
			this.closeDrawer();
			this.openQuickStartGuide();
		},
	},
});
</script>

<style lang="scss" scoped>
.onboarding {
	pointer-events: all;

	&__restart-tour-title {
		margin-bottom: 8px;
	}

	&__restart-tour-subtitle {
		margin-bottom: 24px;
		color: $color-gray;
	}
}
</style>
