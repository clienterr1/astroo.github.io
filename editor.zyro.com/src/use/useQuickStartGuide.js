import {
    ref,
    computed,
} from 'vue';
import EventLogApi from '@/api/EventLogApi';
import {
    QUICK_START_GUIDE_DOMAIN_STEP,
    QUICK_START_GUIDE_EVENT_NAMES,
    QUICK_START_GUIDE_LOGO_STEP,
    QUICK_START_GUIDE_PUBLISH_STEP,
    QUICK_START_GUIDE_SEO_STEP,
} from '@/constants';
import {
    useStore
} from 'vuex';
import {
    getSites
} from '@/api/BillingApi';
import {
    useI18n
} from 'vue-i18n';
import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';

const isQuickStartGuideVisible = ref(false);

export const useQuickStartGuide = () => {
    const {
        state,
        getters,
        dispatch,
    } = useStore();

    const {
        t
    } = useI18n();

    // Step completeness check
    const hasChangedLogo = computed(() => !!getters.builderCompletedSteps ? .hasChangedLogo);
    const hasCustomDomain = computed(() => !!state.customDomain);
    const hasSitePublished = computed(() => !!getters.builderCompletedSteps ? .hasPublishedWebsite || !!state.zyroDomain);

    // Step availability conditions
    const isChangeLogoStepVisible = computed(() => {
        if (hasChangedLogo.value) return true;

        // user has disabled nav or header block is missing - hide step
        if (getters.currentLanguageData.isNavHidden || !getters.currentLanguageData.blocks ? .header) return false;

        // user has enabled nav and show logo setting is enabled - show step else hide step
        return !getters.currentLanguageData.isNavHidden && getters.currentLanguageData.blocks.header.settings.showLogo;
    });

    const quickStartGuideAllSteps = computed(() => [{
            id: QUICK_START_GUIDE_LOGO_STEP,
            title: t('builder.editBlockButton.changeLogo'),
            isCompleted: hasChangedLogo.value,
            isDisabled: hasChangedLogo.value,
            isAvailable: isChangeLogoStepVisible.value,
        },
        {
            id: QUICK_START_GUIDE_SEO_STEP,
            title: t('builder.optimizeForGoogle'),
            isCompleted: !!getters.builderCompletedSteps ? .hasCompletedPageSeo,
            isDisabled: !!getters.builderCompletedSteps ? .hasCompletedPageSeo,
        },
        {
            id: QUICK_START_GUIDE_DOMAIN_STEP,
            title: t('builder.publishModal.label'),
            isCompleted: isHostingerBrand ? true : hasCustomDomain.value,
            isDisabled: isHostingerBrand ? true : hasCustomDomain.value,
        },
        {
            id: QUICK_START_GUIDE_PUBLISH_STEP,
            title: t('builder.publishYourWebsite'),
            isCompleted: hasSitePublished.value,
            isDisabled: hasSitePublished.value,
        },
    ]);

    const availableQuickStartGuideSteps = computed(() => quickStartGuideAllSteps.value.filter((step) => !Object.keys(step).includes('isAvailable') || step.isAvailable));
    const completedQuickStartGuideSteps = computed(() => availableQuickStartGuideSteps.value.filter((step) => step.isCompleted));

    const isQuickStartGuideCompleted = computed(
        () => availableQuickStartGuideSteps.value.length === completedQuickStartGuideSteps.value.length,
    );

    const completeQuickStartGuideStep = ({
        completedStepKey,
        eventProperties,
    }) => {
        if (getters.builderCompletedSteps ? .[completedStepKey]) return;

        dispatch('addBuilderCompletedStep', {
            [completedStepKey]: true,
        });

        EventLogApi.logEvent({
            eventName: QUICK_START_GUIDE_EVENT_NAMES.STEP_COMPLETED,
            ...(eventProperties ? {
                eventProperties,
            } : {}),
            isHostingerEvent: true,
        });

        if (isQuickStartGuideCompleted.value) {
            EventLogApi.logEvent({
                eventName: QUICK_START_GUIDE_EVENT_NAMES.GUIDE_COMPLETED,
                isHostingerEvent: true,
            });
        }
    };

    const toggleQuickStartGuide = async () => {
        isQuickStartGuideVisible.value = !isQuickStartGuideVisible.value;

        const userOwnedSiteCount = (await getSites()) ? .length;

        if (isQuickStartGuideVisible.value) {
            EventLogApi.logEvent({
                eventName: QUICK_START_GUIDE_EVENT_NAMES.ENTER,
                isHostingerEvent: true,
                eventProperties: {
                    isFirst: userOwnedSiteCount === 1 ? 1 : 0,
                },
            });
        }
    };

    const openQuickStartGuide = () => {
        isQuickStartGuideVisible.value = true;
    };

    const activeStepId = ref(availableQuickStartGuideSteps.value.find((step) => !step.isCompleted) ? .id || {});
    const selectStep = (stepId) => {
        if (activeStepId.value === stepId && isQuickStartGuideCompleted.value) {
            activeStepId.value = null;

            return;
        }

        activeStepId.value = stepId;
    };

    return {
        activeStepId,
        selectStep,
        availableQuickStartGuideSteps,
        completedQuickStartGuideSteps,
        isQuickStartGuideCompleted,
        completeQuickStartGuideStep,
        isQuickStartGuideVisible,
        toggleQuickStartGuide,
        openQuickStartGuide,
        hasChangedLogo,
    };
};