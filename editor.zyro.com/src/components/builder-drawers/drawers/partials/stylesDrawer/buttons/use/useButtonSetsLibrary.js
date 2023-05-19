import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    ELEMENT_GRID_BUTTON_PRIMARY,
    ELEMENT_GRID_BUTTON_SECONDARY,
} from '@zyro-inc/site-modules/constants/globalStyles';

import {
    BUTTON_SET_LIST
} from '@/data';

export const useButtonSetsLibrary = () => {
    const {
        getters,
        commit,
    } = useStore();

    const currentButtonSetId = computed(() => getters.siteMeta.buttonSetId);

    const setButtonSet = (buttonSetId) => {
        commit('setWebsiteMeta', {
            key: 'buttonSetId',
            value: buttonSetId,
        });
        commit('setStyleProperties', {
            element: ELEMENT_GRID_BUTTON_PRIMARY,
            value: BUTTON_SET_LIST[buttonSetId].primary,
        });
        commit('setStyleProperties', {
            element: ELEMENT_GRID_BUTTON_SECONDARY,
            value: BUTTON_SET_LIST[buttonSetId].secondary,
        });
    };

    return {
        setButtonSet,
        currentButtonSetId,
    };
};