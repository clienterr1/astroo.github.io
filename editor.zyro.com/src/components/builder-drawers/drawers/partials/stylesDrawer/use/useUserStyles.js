import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    NOTIFICATION_TYPE_RENDERLESS
} from '@/store/builder/notifications';
import {
    useApi,
    TEMPLATE,
} from '@/use/useApi';

const hasLoadedCurrentTemplateStyles = ref(false);
const currentTemplateUneditedStyles = ref(null);

export const useUserStyles = () => {
    const {
        callApi,
        result: currentTemplate,
        hasLoaded,
    } = useApi();
    const {
        getters
    } = useStore();

    const getCurrentTemplateStyles = async () => {
        if (hasLoadedCurrentTemplateStyles.value || !getters.siteMeta.template) {
            return;
        }

        await callApi(`${TEMPLATE}/${getters.siteMeta.template}`, {
            method: 'get',
        }, {
            type: NOTIFICATION_TYPE_RENDERLESS,
        });

        if (hasLoaded.value) {
            currentTemplateUneditedStyles.value = currentTemplate.value.styles;
        }

        hasLoadedCurrentTemplateStyles.value = true;
    };

    return {
        getCurrentTemplateStyles,
        currentTemplateUneditedStyles: computed(() => currentTemplateUneditedStyles.value),
        hasLoadedCurrentTemplateStyles: computed(() => hasLoadedCurrentTemplateStyles.value),
    };
};