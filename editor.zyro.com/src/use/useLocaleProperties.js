import {
    computed
} from 'vue';
import {
    useI18n
} from 'vue-i18n';

import ALL_LOCALES from '@/i18n/locales.json';

export const useLocaleProperties = () => {
    const {
        locale
    } = useI18n();

    // Object containing all locale properties, defined in src/i18n/locales.json
    const localeProperties = computed(() => Object.values(ALL_LOCALES).find(({
        code
    }) => code === locale.value));

    return {
        localeProperties,
    };
};