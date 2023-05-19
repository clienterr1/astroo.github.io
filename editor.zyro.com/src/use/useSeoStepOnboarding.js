import {
    computed,
    ref,
} from 'vue';

const isOnboardingStarted = ref(false);
const isOnboardingRestarted = ref(false);
const currentOnboardingStep = ref(0);

export const useSeoStepOnboarding = ({
    steps
} = {}) => {
    const onboardingStepCount = computed(() => steps.value.length);

    const startOnboarding = () => {
        isOnboardingStarted.value = true;
    };

    const endOnboarding = () => {
        isOnboardingRestarted.value = false;
        isOnboardingStarted.value = false;
        currentOnboardingStep.value = 0;
    };

    const restartOnboarding = () => {
        isOnboardingRestarted.value = true;
        startOnboarding();
    };

    const isCurrentStepLastStep = computed(() => currentOnboardingStep.value === onboardingStepCount.value - 1);

    const goToNextStep = () => {
        if (isCurrentStepLastStep.value) {
            endOnboarding();

            return;
        }

        currentOnboardingStep.value += 1;
    };

    const isCurrentStepFirstStep = computed(() => currentOnboardingStep.value === 0);

    const goToPreviousStep = () => {
        if (isCurrentStepFirstStep.value) return;

        currentOnboardingStep.value -= 1;
    };

    return {
        isOnboardingRestarted,
        isCurrentStepLastStep,
        onboardingStepCount,
        isCurrentStepFirstStep,
        isOnboardingStarted,
        currentOnboardingStep,
        startOnboarding,
        restartOnboarding,
        endOnboarding,
        goToNextStep,
        goToPreviousStep,
    };
};