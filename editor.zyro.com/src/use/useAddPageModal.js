import {
    computed,
    ref,
} from 'vue';
import {
    useStore
} from 'vuex';

import {
    useI18n
} from 'vue-i18n';
import {
    useAddPage
} from '@/use/useAddPage';
import {
    useDrawerPageSettingsPopup
} from '@/use/useDrawerPageSettingsPopup';
import {
    cloneBlock
} from '@/utils/siteDataUtils';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    getTemplateStylesCssVariables
} from '@/utils/getTemplateStylesCssVariables';

import {
    CLOSE_MODAL,
    OPEN_MODAL,
} from '@/store/builder/gui';

import layoutTemplate from '@/data/AddLayoutPageModalTemplate.json';
import {
    PAGE_TYPE_BLOG,
    PAGE_TYPE_ONLINE_STORE,
    PAGE_TYPE_ABOUT,
    PAGE_TYPE_CONTACT,
    PAGE_TYPE_PROJECTS,
    PAGE_TYPE_SERVICES,
    PAGE_TYPE_PRIVACY_POLICY,
    PAGE_TYPE_REFUND_POLICY,
    PAGE_TYPE_TERMS_AND_CONDITIONS,
    LEGAL_CONTENT_PAGES,
    MODAL_LEGAL_CONTENT_GENERATOR,
} from '@/constants';
import EventLogApi from '@/api/EventLogApi';

export const getPagesByCategory = ({
        category,
        pages,
    }) => Object.keys(pages)
    .map((pageId) => ({
        ...pages[pageId],
        id: pageId,
    }))
    .filter((page) => pages[page.id].slug.includes(category));

export const getNewPageContent = ({
    blocksIds,
    template,
    currentLocale,
}) => {
    const newPageBlocks = Object.fromEntries(blocksIds.map((blockId) => {
        const {
            newBlock,
            newElements,
        } = cloneBlock({
            siteData: template,
            blockId,
            slot: '',
            fromLocale: 'system',
            toLocale: currentLocale,
        });

        const newBlockId = generateRandomId();

        return [
            newBlockId,
            {
                newBlock,
                newElements,
            },
        ];
    }));

    const newPageContent = Object.entries(newPageBlocks).reduce((acc, [
        blockId,
        {
            newBlock,
            newElements,
        },
    ]) => ({
        newBlocks: {
            ...acc.newBlocks,
            [blockId]: newBlock,
        },
        newElements: {
            ...acc.newElements,
            ...newElements,
        },
    }), {
        newBlocks: {},
        newElements: {},
    });

    return newPageContent;
};

export const useAddPageModal = () => {
    const template = layoutTemplate;
    const templatePages = template.languages.system.pages;
    const templateBlocks = template.languages.system.blocks;

    const {
        state,
        getters,
        dispatch,
    } = useStore();
    const {
        t
    } = useI18n();

    const {
        addPageWithContent,
        addBlogPage,
    } = useAddPage();

    const {
        setActiveDrawerPageSettingsPopup
    } = useDrawerPageSettingsPopup();
    const isOnlineStoreAvailableToAdd = !getters['subscription/isOnlyEcwidStoreAvailable'] || getters['ecommerce/isSiteWithEcommerceItems'];

    const categories = {
        [PAGE_TYPE_BLOG]: {
            name: t('common.blog'),
        },
        ...(isOnlineStoreAvailableToAdd && {
            [PAGE_TYPE_ONLINE_STORE]: {
                name: t('common.onlineStoreTitle'),
            },
        }),
        separator: {
            type: 'separator',
        },
        [PAGE_TYPE_ABOUT]: {
            name: t('common.about'),
        },
        [PAGE_TYPE_CONTACT]: {
            name: t('common.contactPage'),
        },
        [PAGE_TYPE_SERVICES]: {
            name: t('common.services'),
        },
        [PAGE_TYPE_PROJECTS]: {
            name: t('common.projects'),
        },
        separator2: {
            type: 'separator',
        },
        [PAGE_TYPE_PRIVACY_POLICY]: {
            name: t('common.privacyPolicy'),
        },
        [PAGE_TYPE_REFUND_POLICY]: {
            name: t('common.refundPolicy'),
        },
        [PAGE_TYPE_TERMS_AND_CONDITIONS]: {
            name: t('common.termsAndConditions'),
        },
    };

    const currentCategoryId = ref(PAGE_TYPE_ABOUT);

    const currentLocale = computed(() => state.currentLocale);

    // Overriding website styles with templates styles for font-size, font-weight and line-height
    // otherwise global styles breaks design of elements inside AndPageModal
    const computedStyles = computed(() => getTemplateStylesCssVariables({
        templateStyles: template.styles,
        websiteStyles: state.website.styles,
    }));

    const templateElements = computed(() => {
        if (currentCategoryId.value === PAGE_TYPE_ONLINE_STORE) {
            return {};
        }

        return template.languages.system.elements;
    });

    const selectedCategoryPages = computed(() => {
        const selectedPages = getPagesByCategory({
            category: currentCategoryId.value,
            pages: templatePages,
        });

        const selectedPagesWithBlocks = Object.fromEntries(selectedPages.map((page) => {
            const pageBlocks = page.blocks.map((blockId) => templateBlocks[blockId]);

            return [
                page.id,
                pageBlocks,
            ];
        }));

        return selectedPagesWithBlocks;
    });

    const pageDescriptions = computed(() => ({
        ecommerceProductList: {
            title: t('builder.productList'),
            text: t('builder.productListDescription'),
        },
        ecommerceProduct: {
            title: t('builder.singleProduct'),
            text: t('builder.singleProductDescription'),
        },
    }));

    const addNewPage = async ({
        pageId,
        isPageEmpty = false,
        newPageId = generateRandomId(),
    }) => {
        const isLegalContentBlock = LEGAL_CONTENT_PAGES.includes(currentCategoryId.value);
        const isNewPageBlog = currentCategoryId.value === PAGE_TYPE_BLOG;
        const isNewPageOnlineStore = currentCategoryId.value === PAGE_TYPE_ONLINE_STORE;

        const newPageName = isNewPageOnlineStore ?
            pageDescriptions.value[pageId].title :
            categories[currentCategoryId.value].name;

        if (!isLegalContentBlock) {
            EventLogApi.logEvent({
                eventName: 'website_builder.add_page.added',
                isHostingerEvent: true,
            });
        }

        if (isLegalContentBlock) {
            dispatch(`gui/${CLOSE_MODAL}`);
            dispatch(`gui/${OPEN_MODAL}`, {
                name: MODAL_LEGAL_CONTENT_GENERATOR,
                settings: {
                    legalContentType: currentCategoryId.value,
                    shouldAddPage: true,
                    newPageId,
                    newPageName,
                },
            });

            return;
        }

        if (isNewPageBlog) {
            addBlogPage({
                pageId: newPageId,
                shouldOpenPageSettingsPopup: true,
            });

            return;
        }

        if (isPageEmpty) {
            await dispatch('addEmptyPage', {
                pageId: newPageId,
            });

            setActiveDrawerPageSettingsPopup({
                pageId: newPageId,
            });
        } else {
            const templatePage = templatePages[pageId];
            const newPageSlug = `${currentCategoryId.value}-${newPageId}`;
            const newPageContent = getNewPageContent({
                blocksIds: templatePage.blocks,
                template,
                currentLocale: currentLocale.value,
            });

            if (isNewPageOnlineStore) {
                dispatch('generateEcommercePages');
            }

            await addPageWithContent({
                newPageId,
                newPageName,
                newPageSlug,
                newPageBlocks: newPageContent.newBlocks,
                newPageElements: newPageContent.newElements,
                shouldUpdateCurrentPage: true,
                shouldOpenPageSettingsPopup: true,
                isPageTypeEcommerce: isNewPageOnlineStore,
            });
        }

        dispatch(`gui/${CLOSE_MODAL}`);
    };

    return {
        template,
        categories,
        templateElements,
        currentCategoryId,
        selectedCategoryPages,
        addNewPage,
        pageDescriptions,
        computedStyles,
    };
};