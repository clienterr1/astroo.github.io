import {
    ref
} from 'vue';
import {
    useOverlay
} from '@/use/useOverlay';
import {
    ONBOARDING_STEP_RESTART_TOUR,
    LOCAL_STORAGE_KEY_ONBOARDING_COMPLETED,
} from '@/constants';

const isOnboardingVisible = ref(false);
const onboardingEndCallback = ref(null);
const onboardingSteps = ref(null);
const onboardingStepsCountToShow = ref(null);
const currentOnboardingStep = ref(null);
const currentOnboardingStepIndex = ref(null);

export const useOnboarding = () => {
    const {
        showOverlay,
        hideOverlay,
    } = useOverlay();

    const setOnboardingStep = (stepIndex) => {
        currentOnboardingStepIndex.value = stepIndex;
        currentOnboardingStep.value = onboardingSteps.value[stepIndex];
    };

    const startOnboarding = ({
        steps,
        stepCountToShow = steps.length,
        onEndCallback,
    } = {}) => {
        onboardingSteps.value = steps;
        onboardingStepsCountToShow.value = stepCountToShow;
        onboardingEndCallback.value = onEndCallback;

        setOnboardingStep(0);
        isOnboardingVisible.value = true;
        showOverlay();
    };

    const endOnboarding = () => {
        isOnboardingVisible.value = false;
        onboardingSteps.value = null;
        currentOnboardingStepIndex.value = null;

        window.localStorage.setItem(LOCAL_STORAGE_KEY_ONBOARDING_COMPLETED, true);
        hideOverlay();

        if (onboardingEndCallback.value) {
            onboardingEndCallback.value();
            onboardingEndCallback.value = null;
        }
    };

    const goToNextOnboardingStep = () => {
        if (currentOnboardingStepIndex.value !== onboardingSteps.value.length - 1) {
            setOnboardingStep(currentOnboardingStepIndex.value + 1);
        } else {
            endOnboarding();
        }
    };

    const goToPreviousOnboardingStep = () => {
        if (currentOnboardingStepIndex.value !== 0) {
            setOnboardingStep(currentOnboardingStepIndex.value - 1);
        } else {
            endOnboarding();
        }
    };

    const openRestartTourPopup = () => {
        currentOnboardingStep.value = ONBOARDING_STEP_RESTART_TOUR;
        isOnboardingVisible.value = true;
    };

    return {
        onboardingStepsCountToShow,
        currentOnboardingStepIndex,
        startOnboarding,
        goToNextOnboardingStep,
        goToPreviousOnboardingStep,
        endOnboarding,
        onboardingEndCallback,
        currentOnboardingStep,
        openRestartTourPopup,
        isOnboardingVisible,
    };
};