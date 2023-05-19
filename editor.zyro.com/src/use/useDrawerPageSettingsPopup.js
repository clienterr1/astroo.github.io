import {
    ref
} from 'vue';

import {
    TAB_GENERAL
} from '@zyro-inc/site-modules/constants';

const activeDrawerPageSettingsPopup = ref(null);

export const useDrawerPageSettingsPopup = () => {
    const setActiveDrawerPageSettingsPopup = ({
        pageId,
        tab = TAB_GENERAL,
    }) => {
        activeDrawerPageSettingsPopup.value = {
            id: pageId,
            tab,
        };
    };

    return {
        activeDrawerPageSettingsPopup,
        setActiveDrawerPageSettingsPopup,
    };
};