import {
    reactive
} from 'vue';

import {
    DRAWER_STYLES_TAB_ID_TYPOGRAPHY,
    DRAWER_STYLES_TAB_ID_BUTTON_SETS,
    DRAWER_GLOBAL_STYLES_TABS,
    DRAWER_STYLES_TAB_ID_COLORS,
    DRAWER_STYLES_TAB_ID_ANIMATIONS,
    DRAWER_GLOBAL_STYLES,
    DRAWER_USER_STYLES,
} from '@/constants';

import {
    useI18n
} from 'vue-i18n';
import {
    useStore
} from 'vuex';

// Declaring currentTabs in global scope so it would be accessible in currentTabs
let currentTabs;

export const useDrawerTabs = () => {
    const {
        getters
    } = useStore();
    const {
        t
    } = useI18n();
    const isLayoutOnly = getters['flags/isLayoutOnly'];

    const userStylesDrawerTabs = [{
            id: DRAWER_STYLES_TAB_ID_COLORS,
            title: t('common.colors'),
        },
        {
            id: DRAWER_STYLES_TAB_ID_TYPOGRAPHY,
            title: t('common.text'),
        },
        {
            id: DRAWER_STYLES_TAB_ID_BUTTON_SETS,
            title: t('common.buttons'),
        },
        (isLayoutOnly && {
            id: DRAWER_STYLES_TAB_ID_ANIMATIONS,
            title: t('common.animations'),
        }),
    ];

    const drawerTabs = {
        [DRAWER_GLOBAL_STYLES]: DRAWER_GLOBAL_STYLES_TABS,
        [DRAWER_USER_STYLES]: userStylesDrawerTabs,
    };

    // setting reactive currentTabs singleton so it could be used across multiple
    // useDrawerTab instances
    if (!currentTabs) {
        currentTabs = reactive({
            [DRAWER_GLOBAL_STYLES]: drawerTabs ? drawerTabs[DRAWER_GLOBAL_STYLES][0] : null,
            [DRAWER_USER_STYLES]: drawerTabs ? drawerTabs[DRAWER_USER_STYLES][0] : null,
        });
    }

    const changeCurrentTab = ({
        drawer,
        tab = null,
        tabId = null,
    }) => {
        currentTabs[drawer] = tab ?
            ? drawerTabs[drawer].find((drawerTab) => drawerTab.id === tabId);
    };

    return {
        changeCurrentTab,
        currentTabs,
        userStylesDrawerTabs,
    };
};