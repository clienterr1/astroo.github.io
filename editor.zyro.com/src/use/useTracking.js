import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';

import EventLogApi from '@/api/EventLogApi';

const TEXT_BOX_LOG_CHANGE_THRESHOLDS = [
    50,
    100,
    1000,
];

const HOME_PAGE_TEXT_BOX_LOG_CHANGE_THRESHOLD = 3;

export const useTracking = () => {
    const {
        state,
        getters,
        dispatch,
    } = useStore();

    const websiteId = computed(() => state.websiteId);
    const customDomain = computed(() => state.customDomain);
    const isCurrentPageHomePage = computed(() => state.currentPageId === getters.homePageId);
    const currentTextBoxChangeCount = computed(() => getters.builderCompletedSteps ? .textBoxChangeCount ? ? 0);
    const currentHomePageTextBoxChangeCount = computed(() => getters.builderCompletedSteps ? .homePageTextBoxChangeCount ? ? 0);

    const trackTextBoxCountChanges = () => {
        dispatch('addBuilderCompletedStep', {
            textBoxChangeCount: currentTextBoxChangeCount.value + 1,
        });

        if (isCurrentPageHomePage.value) {
            dispatch('addBuilderCompletedStep', {
                homePageTextBoxChangeCount: currentHomePageTextBoxChangeCount.value + 1,
            });
        }

        if (TEXT_BOX_LOG_CHANGE_THRESHOLDS.includes(currentTextBoxChangeCount.value)) {
            EventLogApi.logEvent({
                eventName: 'website_builder.text_box_threshold.reached',
                eventProperties: {
                    website_id: websiteId.value,
                    domain_name: customDomain.value,
                    threshold: currentTextBoxChangeCount.value,
                },
                isHostingerEvent: true,
            });
        }

        if (currentHomePageTextBoxChangeCount.value === HOME_PAGE_TEXT_BOX_LOG_CHANGE_THRESHOLD) {
            EventLogApi.logEvent({
                eventName: 'website_builder.home_page_text_threshold.reached',
                eventProperties: {
                    website_id: websiteId.value,
                    domain_name: customDomain.value,
                    threshold: currentHomePageTextBoxChangeCount.value,
                },
                isHostingerEvent: true,
            });
        }
    };

    return {
        websiteId,
        customDomain,
        currentTextBoxChangeCount,
        currentHomePageTextBoxChangeCount,
        trackTextBoxCountChanges,
    };
};