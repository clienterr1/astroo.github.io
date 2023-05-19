import {
    computed
} from 'vue';
import {
    useI18n
} from 'vue-i18n';
import {
    useStore
} from 'vuex';

const MAX_LENGTH_PAGE_NAME = 512;

export const usePageNameWithSlugValidation = ({
    pageName,
    pageSlug,
    pageId,
}) => {
    const {
        t
    } = useI18n();
    const {
        getters
    } = useStore();

    const pageNameErrorMessage = computed(() => {
        const trimmedPageName = pageName.value.trim();

        if (!trimmedPageName) {
            return t('validate.emptyValue');
        }

        if (trimmedPageName.length > MAX_LENGTH_PAGE_NAME) {
            return t('validate.valueOver512');
        }

        return '';
    });

    const isPageNameValid = computed(() => !pageNameErrorMessage.value);

    const pageSlugErrorMessage = computed(() => {
        const trimmedPageSlug = pageSlug.value.trim();

        if (!trimmedPageSlug) {
            return t('validate.emptyValue');
        }

        if (trimmedPageSlug.length > MAX_LENGTH_PAGE_NAME) {
            return t('validate.valueOver512');
        }

        const isPageSlugUnique = getters.isPageSlugUnique({
            slug: trimmedPageSlug,
            slugPageId: pageId.value,
        });

        if (!isPageSlugUnique || trimmedPageSlug === '/') {
            return t('validate.pageUrlExistsInSite');
        }

        return '';
    });

    const isPageSlugValid = computed(() => !pageSlugErrorMessage.value);

    return {
        pageNameErrorMessage,
        isPageNameValid,
        pageSlugErrorMessage,
        isPageSlugValid,
    };
};