import {
    computed,
    ref,
} from 'vue';

const isPageUnlocked = ref({});

export const usePasswordProtection = ({
    pagePassword,
    locale,
    pageId,
}) => {
    const pageKey = computed(() => `${pageId}-${locale}`);

    const isPageOpen = computed(() => !pagePassword || (pagePassword && !!isPageUnlocked.value[pageKey.value]));

    const openUnlockedPage = () => {
        isPageUnlocked.value = {
            ...isPageUnlocked.value,
            [pageKey.value]: true,
        };
    };

    return {
        isPageUnlocked,
        openUnlockedPage,
        isPageOpen,
    };
};