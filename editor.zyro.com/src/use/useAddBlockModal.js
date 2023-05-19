import {
    ref,
    computed,
} from 'vue';
import {
    useStore
} from 'vuex';
import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';
import {
    getTemplateStylesCssVariables
} from '@/utils/getTemplateStylesCssVariables';

import {
    PAGE_TYPE_ECOMMERCE_PRODUCT
} from '@zyro-inc/site-modules/constants';
import {
    BLOCKS_ECOMMERCE,
    DEMO_PRODUCTS,
} from '@zyro-inc/site-modules/constants/ecommerce';
import {
    filterObject
} from '@zyro-inc/site-modules/utils/object';
import {
    useRoute,
    useRouter,
} from 'vue-router';
import EventLogApi from '@/api/EventLogApi';
import {
    getBlogListBlock,
    getEcwidBlock,
    getEcommerceProductBlock,
    getEcommerceProductListBlock,
    getGridBlock,
    getLayoutBlock,
} from '@/components/block/blocks';
import gridTemplate from '@/data/AddGridBlockModalTemplate.json';
import layoutTemplate from '@/data/AddLayoutBlockModalTemplate.json';
import {
    CLOSE_MODAL,
    OPEN_MODAL,
} from '@/store/builder/gui';
import {
    MODAL_LEGAL_CONTENT_GENERATOR,
    BLOCK_CATEGORY_BLOG,
    BLOCK_CATEGORY_ECWID,
    BLOCK_CATEGORY_LITE_STORE,
    BLOCK_CATEGORY_FOOTER,
    BLOCK_CATEGORY_ABOUT,
    LEGAL_CONTENT_BLOCKS,
} from '@/constants';
import {
    BUILDER_ROUTE
} from '@/constants/routes';
import {
    useI18n
} from 'vue-i18n';
import {
    useAddBlock
} from '@/use/useAddBlock';

export const useAddBlockModal = () => {
    const {
        state,
        getters,
        dispatch,
    } = useStore();
    const {
        t
    } = useI18n();
    const isLayoutOnly = getters['flags/isLayoutOnly'];
    const template = isLayoutOnly ? layoutTemplate : gridTemplate;
    const {
        activeModalSettings
    } = state.gui;
    const isLocaleWithEcommerceItems = getters['ecommerce/isLocaleWithEcommerceItems'];
    const {
        addBlock
    } = useAddBlock();

    const router = useRouter();
    const route = useRoute();

    // Overriding website styles with templates styles for font-size, font-weight and line-height
    // otherwise global styles breaks design of elements inside andBlockModal
    const computedStyles = computed(() => getTemplateStylesCssVariables({
        templateStyles: template.styles,
        websiteStyles: state.website.styles,
    }));

    // Custom blog logic
    const showBlogListChoice = ref(false);

    // Custom footer logic
    const showFooterGlobalChoice = ref(false);
    const doesFooterExist = computed(() => getters.doesFooterExist);

    const selectedBlockId = ref(null);

    const categories = {
        [BLOCK_CATEGORY_BLOG]: {
            name: t('common.blog'),
        },
        ...((getters['subscription/isOnlyEcwidStoreAvailable'] && !getters['ecommerce/isSiteWithEcommerceItems']) && {
            [BLOCK_CATEGORY_ECWID]: {
                name: t('common.onlineStoreTitle'),
            },
        }),
        ...((!getters['subscription/isOnlyEcwidStoreAvailable'] || getters['ecommerce/isSiteWithEcommerceItems']) && {
            [BLOCK_CATEGORY_LITE_STORE]: {
                name: t('common.onlineStoreTitle'),
                hasBadge: true,
                badgeText: t('common.sell'),
            },
        }),
        separator: {
            type: 'separator',
        },
        [BLOCK_CATEGORY_ABOUT]: {
            name: t('common.about'),
        },
        'gallery-page': {
            name: t('common.gallery'),
        },
        'contact-form': {
            name: t('common.contactForm'),
        },
        [BLOCK_CATEGORY_FOOTER]: {
            name: t('common.footer'),
            icon: 'link',
        },
        'headlines-page': {
            name: t('common.headlines'),
        },
        'images-page': {
            name: t('common.images'),
        },
        'instagram-feed': {
            name: t('common.instagramFeed'),
        },
        'map-page': {
            name: t('common.map'),
        },
        ...(isLayoutOnly ? {
            'image-slideshow-page': {
                name: t('common.slideshow'),
            },
        } : {
            'slideshow-page': {
                name: t('common.slideshow'),
            },
        }),
        'social-icons': {
            name: t('common.socialIcons'),
        },
        'subscribe-form': {
            name: t('common.subscribeForm'),
        },
        'testimonials-page': {
            name: t('common.testimonials'),
        },
        'video-page': {
            name: t('common.video'),
        },
        separator2: {
            type: 'separator',
        },
        'privacy-policy': {
            name: t('common.privacyPolicy'),
        },
        'refund-policy': {
            name: t('common.refundPolicy'),
        },
        'terms-and-conditions': {
            name: t('common.termsAndConditions'),
        },
    };

    // Current sidebar category
    const currentCategory = ref('');
    const currentCategoryId = computed({
        get: () => {
            if (currentCategory.value) {
                return currentCategory.value;
            }

            return BLOCK_CATEGORY_ABOUT;
        },
        set: (value) => {
            currentCategory.value = value;
        },
    });

    // Current selected category blocks
    const selectedCategoryBlocks = computed(() => {
        const nonAddableBlocks = [
            'BlockNavigation',
            'BlockBlogHeader',
        ];

        if (!template) {
            return null;
        }

        if (currentCategoryId.value === BLOCK_CATEGORY_ECWID) {
            return {
                ecwid: getEcwidBlock(),
            };
        }

        if (currentCategoryId.value === BLOCK_CATEGORY_BLOG) {
            return {
                blog: getBlogListBlock({
                    mockCategories: true,
                }),
            };
        }

        if (currentCategoryId.value === BLOCK_CATEGORY_LITE_STORE) {
            if (getters.currentPage ? .type === PAGE_TYPE_ECOMMERCE_PRODUCT) {
                return {
                    ecommerceProductList: getEcommerceProductListBlock(DEMO_PRODUCTS),
                };
            }

            return {
                ecommerceProductList: getEcommerceProductListBlock(DEMO_PRODUCTS),
                ecommerceProduct: getEcommerceProductBlock(),
            };
        }

        const pageBlocks = template.languages.system.pages[currentCategoryId.value] ? .blocks || [];

        const filteredBlocks = filterObject(
            template.languages.system.blocks,
            ({
                key,
                value,
            }) => pageBlocks.includes(key) && !nonAddableBlocks.includes(value.type),
        );

        return filteredBlocks;
    });

    const blockDescriptions = computed(() => ({
        ecommerceProductList: {
            title: t('builder.productList'),
            text: t('builder.productListDescription'),
        },
        ecommerceProduct: {
            title: t('builder.singleProduct'),
            text: t('builder.singleProductDescription'),
        },
    }));

    // Current selected category components
    const templateElements = computed(() => {
        if (currentCategoryId.value === BLOCK_CATEGORY_ECWID || currentCategoryId.value === BLOCK_CATEGORY_BLOG) {
            return {};
        }

        return template.languages.system.elements;
    });

    // Add stuff
    function addPage(type) {
        if (type === BLOCK_CATEGORY_ECWID) {
            EventLogApi.logEvent({
                eventName: 'template.eshop-block-added',
            });
            dispatch('addStorePage');
            dispatch(`gui/${CLOSE_MODAL}`);
            if (route.name !== BUILDER_ROUTE) {
                router.push({
                    name: BUILDER_ROUTE,
                });
            }
        }
    }

    async function addNewBlock({
        blockId,
        blockData,
        addToPage,
        slot,
    }) {
        const {
            previousBlockId
        } = activeModalSettings;
        const isBlockEcommerce = BLOCKS_ECOMMERCE.includes(blockData ? .type);
        const isLegalContentBlock = LEGAL_CONTENT_BLOCKS.includes(currentCategoryId.value);

        // If no blockId given, add a default empty block
        if (!blockId && !addToPage) {
            dispatch('addBlock', {
                pageId: state.currentPageId,
                blockData: isLayoutOnly ? getLayoutBlock() : getGridBlock(),
                previousBlockId,
            });

            dispatch(`gui/${CLOSE_MODAL}`);

            return;
        }

        // Show popup before adding blog
        if (currentCategoryId.value === BLOCK_CATEGORY_BLOG && !addToPage) {
            if (!getters['blog/isLocaleWithBlogList']) {
                showBlogListChoice.value = true;

                return;
            }

            dispatch('addBlog', {
                pageTitle: t('common.blog'),
                postTitle: t('builder.blog.blogPost.title'),
                postDescription: t('builder.blog.blogPost.description'),
                postContent: t('builder.blog.blogPageElements.content'),
                existingPageId: state.currentPageId,
                existingPagePreviousBlockId: previousBlockId,
            });

            dispatch(`gui/${CLOSE_MODAL}`);

            return;
        }

        // Show popup before adding footer
        if ([BLOCK_CATEGORY_FOOTER].includes(currentCategoryId.value) &&
            !doesFooterExist.value &&
            !showFooterGlobalChoice.value) {
            showFooterGlobalChoice.value = true;

            return;
        }

        // If the current element is bloglist, handle it specifically.
        if (blockData.type === 'BlockBlogList') {
            dispatch('addBlog', {
                pageTitle: t('common.blog'),
                postTitle: t('builder.blog.blogPost.title'),
                postDescription: t('builder.blog.blogPost.description'),
                postContent: t('builder.blog.blogPageElements.content'),
                existingPageId: state.currentPageId,
                existingPagePreviousBlockId: previousBlockId,
            });
            dispatch(`gui/${CLOSE_MODAL}`);

            return;
        }

        if (blockData.type === 'BlockEcwidStore') {
            dispatch('addBlock', {
                pageId: state.currentPageId,
                blockData,
                previousBlockId,
            });
            dispatch(`gui/${CLOSE_MODAL}`);

            EventLogApi.logEvent({
                eventName: 'builder.add_section',
                eventProperties: {
                    from: 'library',
                    action: 'click',
                    type: 'ecwid_product_list',
                },
            });

            return;
        }

        if (isBlockEcommerce) {
            dispatch('addBlock', {
                pageId: state.currentPageId,
                blockData,
                previousBlockId,
            });
            dispatch(`gui/${CLOSE_MODAL}`);

            if (!isLocaleWithEcommerceItems) {
                EventLogApi.logEvent({
                    eventName: 'website_builder.ecomm.store_added',
                    eventProperties: {
                        location: 'section',
                    },
                    isHostingerEvent: isHostingerBrand,
                });
            }

            EventLogApi.logEvent({
                eventName: 'builder.add_section',
                eventProperties: {
                    from: 'library',
                    action: 'click',
                    type: blockData.type === 'BlockEcommerceProductList' ? 'ecommerce_product_list' : 'ecommerce_product',
                },
            });

            return;
        }

        if (isLegalContentBlock) {
            dispatch(`gui/${CLOSE_MODAL}`);
            dispatch(`gui/${OPEN_MODAL}`, {
                name: MODAL_LEGAL_CONTENT_GENERATOR,
                settings: {
                    legalContentType: currentCategoryId.value,
                    blockId,
                    previousBlockId,
                },
            });

            return;
        }

        addBlock({
            blockId,
            slot,
            template,
        });

        dispatch(`gui/${CLOSE_MODAL}`);

        EventLogApi.logEvent({
            eventName: 'user.addBlockFromLibrary',
        });
    }

    function addBlogList() {
        addNewBlock({
            blockId: 'blockBlogList',
            blockData: getBlogListBlock({
                mockCategories: false,
            }),
            addToPage: true,
        });
    }

    function presetDefaultCategoryId() {
        if (activeModalSettings.categoryId) {
            currentCategoryId.value = activeModalSettings.categoryId;
        }
    }

    presetDefaultCategoryId();

    return {
        template,
        categories,
        templateElements,
        doesFooterExist,
        selectedBlockId,
        currentCategoryId,
        addNewBlock,
        selectedCategoryBlocks,
        blockDescriptions,
        showBlogListChoice,
        showFooterGlobalChoice,
        addPage,
        addBlogList,
        computedStyles,
    };
};