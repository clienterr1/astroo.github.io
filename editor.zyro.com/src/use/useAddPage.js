import {
    computed
} from 'vue';
import {
    useStore
} from 'vuex';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    PAGE_TYPE_PORTFOLIO,
    PAGE_TYPE_BLOG,
    PAGE_TYPE_ONLINE_STORE,
    PAGE_TYPE_APPOINTMENTS,
} from '@/constants';
import {
    CLOSE_MODAL
} from '@/store/builder/gui';
import {
    NAVIGATION_PAGE_TYPE
} from '@zyro-inc/site-modules/constants';
import {
    useI18n
} from 'vue-i18n';
import {
    useDrawerPageSettingsPopup
} from '@/use/useDrawerPageSettingsPopup';

import {
    getPortfolioBlock,
    getPageTitleBlock,
    getEcommerceProductListBlock,
    getEcommerceProductBlock,
} from '@/components/block/blocks';
import {
    addPage,
    removePage,
} from '@/utils/siteDataUtils';

export const useAddPage = () => {
    const {
        getters,
        dispatch,
        state,
    } = useStore();
    const {
        t
    } = useI18n();
    const {
        setActiveDrawerPageSettingsPopup
    } = useDrawerPageSettingsPopup();

    const website = computed(() => state.website);
    const currentLocale = computed(() => state.currentLocale);

    const portfolioBlock = getPortfolioBlock();

    const pagesByType = {
        [PAGE_TYPE_PORTFOLIO]: {
            pageTitle: t('common.portfolio'),
            blockData: portfolioBlock.blockData,
            blockElements: portfolioBlock.elements,
        },
        [PAGE_TYPE_ONLINE_STORE]: {
            pageTitle: t('builder.onlineStoreName'),
            blockData: getEcommerceProductListBlock(state.ecommerce.products),
            isPageTypeEcommerce: true,
        },
        [PAGE_TYPE_APPOINTMENTS]: {
            pageTitle: t('common.appointments'),
            blockData: getEcommerceProductBlock({
                buttonText: t('common.bookNow'),
            }),
            isPageTypeEcommerce: true,
        },
    };

    const addPageWithContent = async ({
        newPageId = generateRandomId(),
        newPageName,
        newPageSlug,
        newPageBlocks,
        newPageElements,
        isPageTypeEcommerce = false,
        shouldUpdateCurrentPage = false,
        shouldOpenPageSettingsPopup = false,
    }) => {
        const websiteDataWithNewPage = addPage({
            locale: currentLocale.value,
            siteData: website.value,
            pageId: newPageId,
            pageData: {
                name: newPageName,
                slug: newPageSlug,
                blocks: [...Object.keys(newPageBlocks)],
                type: 'default',
                isHidden: false,
            },
            blocks: {
                ...newPageBlocks,
            },
            elements: {
                ...newPageElements,
            },
            navigationItem: {
                linkType: NAVIGATION_PAGE_TYPE,
                subItems: [],
            },
            isPageTypeEcommerce,
        });

        await dispatch('overwriteWebsiteData', {
            websiteData: websiteDataWithNewPage,
        });

        if (shouldUpdateCurrentPage) {
            dispatch('updateCurrentPageId', newPageId);
        }

        if (shouldOpenPageSettingsPopup) {
            setActiveDrawerPageSettingsPopup({
                pageId: newPageId,
            });
        }
    };

    const addPageWithTitle = ({
        pageId,
        pageTitle,
        blockData,
        blockElements = {},
        isPageTypeEcommerce = false,
    }) => {
        const blockId = generateRandomId();
        const titleBlockId = generateRandomId();
        const titleBlock = getPageTitleBlock({
            title: pageTitle,
        });

        const websiteDataWithNewPage = addPage({
            siteData: website.value,
            pageId,
            pageData: {
                name: pageTitle,
                slug: `page-${pageId}`,
                blocks: [
                    titleBlockId,
                    blockId,
                ],
                type: 'default',
            },
            blocks: {
                [titleBlockId]: titleBlock.blockData,
                [blockId]: blockData,
            },
            elements: {
                ...titleBlock.elements,
                ...blockElements,
            },
            navigationItem: {
                linkType: NAVIGATION_PAGE_TYPE,
                subItems: [],
            },
            isPageTypeEcommerce,
        });

        dispatch('overwriteWebsiteData', {
            websiteData: websiteDataWithNewPage,
        });
    };

    const addPageByType = ({
        pageType,
        pageId,
        shouldAddExampleBlogPosts = false,
    }) => {
        if (pageType === PAGE_TYPE_BLOG) {
            dispatch('addBlog', {
                pageTitle: t('common.blog'),
                postTitle: t('builder.blog.blogPost.title'),
                postDescription: t('builder.blog.blogPost.description'),
                postContent: t('builder.blog.blogPageElements.content'),
                pageId,
                shouldAddExampleBlogPosts,
            });

            return;
        }

        const {
            pageTitle,
            blockData,
            blockElements,
            isPageTypeEcommerce,
        } = pagesByType[pageType];

        if (pageType === PAGE_TYPE_ONLINE_STORE) {
            dispatch('generateEcommercePages');
        }

        addPageWithTitle({
            pageId,
            pageTitle,
            blockData,
            blockElements,
            isPageTypeEcommerce,
        });
    };

    const removePageById = ({
        pageType,
        pageId,
    }) => {
        const websiteDataWithRemovedPage = removePage({
            pageId,
            siteData: website.value,
        });

        dispatch('overwriteWebsiteData', {
            websiteData: websiteDataWithRemovedPage,
        });

        const isEcommercePage = pageType === PAGE_TYPE_ONLINE_STORE || pageType === PAGE_TYPE_APPOINTMENTS;
        const isAppointmentsPageAdded = getters.doesPageIdAlreadyExist({
            pageId: PAGE_TYPE_APPOINTMENTS,
        });
        const isOnlineStorePageAdded = getters.doesPageIdAlreadyExist({
            pageId: PAGE_TYPE_ONLINE_STORE,
        });
        const shouldDeleteEcommerceItems = isEcommercePage && !isOnlineStorePageAdded && !isAppointmentsPageAdded;

        if (shouldDeleteEcommerceItems) {
            dispatch('ecommerce/deleteEcommerceItemsFromSite');
        }
    };

    const addBlogPage = ({
        pageId = generateRandomId(),
        shouldOpenPageSettingsPopup = false,
    } = {}) => {
        dispatch('addBlog', {
            pageId,
            pageTitle: t('common.blog'),
            postTitle: t('builder.blog.blogPost.title'),
            postDescription: t('builder.blog.blogPost.description'),
            postContent: t('builder.blog.blogPageElements.content'),
        });

        dispatch(`gui/${CLOSE_MODAL}`);

        // Sends Hotjar event
        window.hj('identify', state.user.user.id, {
            'builder.blog.add_blog_page': true,
        });

        if (shouldOpenPageSettingsPopup) {
            setActiveDrawerPageSettingsPopup({
                pageId,
            });
        }
    };

    return {
        addBlogPage,
        addPageWithContent,
        addPageByType,
        removePageById,
    };
};