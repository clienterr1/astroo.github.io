import {
    useStore
} from 'vuex';
import EventLogApi from '@/api/EventLogApi';
import {
    computed
} from 'vue';
import {
    QUICK_START_GUIDE_LOGO_STEP,
    GAMIFICATION_TASK_CHANGE_LOGO,
} from '@/constants';
import {
    useQuickStartGuide
} from '@/use/useQuickStartGuide';
import {
    useGamification
} from '@/use/useGamification';

export const useUpdateLogo = () => {
    const {
        getters,
        dispatch,
    } = useStore();

    const {
        completeQuickStartGuideStep
    } = useQuickStartGuide();

    const {
        completeAchievement
    } = useGamification();

    const updateLogo = ({
        origin,
        path,
        fullResolutionHeight,
        fullResolutionWidth,
    }) => {
        const logoAspectRatio = fullResolutionWidth / fullResolutionHeight;
        const desktopLogoWidth = computed(() => Number.parseInt(getters.headerBlock.settings.styles ? .['logo-width'], 10) / logoAspectRatio);
        const mobileLogoWidth = computed(() => Number.parseInt(getters.headerBlock.settings.styles ? .['m-logo-width'], 10) / logoAspectRatio);

        dispatch('updateBlockData', {
            blockId: 'header',
            blockData: {
                logoAspectRatio,
                desktop: {
                    logoHeight: desktopLogoWidth.value,
                },
                mobile: {
                    logoHeight: mobileLogoWidth.value,
                },
                settings: {
                    logoImagePath: path,
                    logoImageOrigin: origin,
                    logoSvg: null,
                },
            },
            merge: true,
        });

        EventLogApi.logEvent({
            eventName: 'builder.header.change_logo',
        });

        completeAchievement(GAMIFICATION_TASK_CHANGE_LOGO);

        completeQuickStartGuideStep({
            completedStepKey: 'hasChangedLogo',
            eventProperties: {
                stepName: QUICK_START_GUIDE_LOGO_STEP,
            },
        });
    };

    return {
        updateLogo,
    };
};