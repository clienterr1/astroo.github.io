import {
    computed,
    nextTick,
} from 'vue';
import router from '@/router';
import {
    useI18n
} from 'vue-i18n';
import {
    useStore
} from 'vuex';
import {
    showDefaultPageList,
    showBlogPostPageList,
} from '@/components/spotlight/useSpotlight';
import {
    PREVIEW_ROUTE,
    BUILDER_ROUTE,
    GENERAL_SETTINGS_ROUTE,
    INTEGRATIONS_SETTINGS_ROUTE,
    SEO_SETTINGS_ROUTE,
    FORMS_SETTINGS_ROUTE,
    EXPORT_SETTINGS_ROUTE,
} from '@/constants/routes';
import {
    DRAWER_BLOG,
    DRAWER_MULTI_PAGE,
    DRAWER_MULTILINGUAL,
    DRAWER_MANAGE_STORE,
    DRAWER_ADD_ONLINE_STORE,
    DRAWER_AI_WRITER,
    DRAWER_HELP_AND_RESOURCES,
    ECOMMERCE_REDIRECT_PATHS,
} from '@/constants';
import {
    DATA_ATTRIBUTE_ELEMENT_ID
} from '@zyro-inc/site-modules/constants';
import {
    useAddElement
} from '@/use/useAddElement';
import {
    getZyrositePreviewDomain
} from '@/api/PublishApi';
import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';
import {
    getLogoMakerUrl
} from '@zyro-inc/site-modules/utils/getLogoMakerUrl';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    getRedirectUrlToEcommerce
} from '@/use/useRedirects';
import {
    useBlockLayout
} from '@zyro-inc/site-modules/components/blocks/layout/useBlockLayout';

// Action categories
// -----------------
// Elements
// Pages
// Blog
// Store management
// AI tools
// Website settings
// Other - save, edit mobile, publish, preview, etc.

export const categoryNames = {
    elements: 'Elements:',
    pages: 'Pages:',
    blog: 'Blog:',
    store: 'Store management:',
    ai: 'AI tools:',
    websiteSettings: 'Website settings:',
    other: 'Other:',
};

export const useBaseActionList = () => {
    const {
        state,
        getters,
        commit,
        dispatch,
    } = useStore();

    const {
        t
    } = useI18n();

    const {
        defaultElements,
        addLayoutElement,
    } = useAddElement();

    const websiteId = computed(() => state.websiteId);
    const currentBlockId = computed(() => state.currentBlockId);
    const currentBlockType = computed(() => getters.currentBlockType);
    const currentBlock = computed(() => getters.currentBlock);
    const siteElements = computed(() => getters.siteElements);
    const isBlockLayout = computed(() => currentBlockType.value === 'BlockLayout');

    const {
        layoutElements
    } = useBlockLayout({
        blockData: currentBlock,
        siteElements,
        shouldBuildResponsive: false,
    });

    const handleElementAdd = async (element) => {
        if (!isBlockLayout.value) return;

        const currentBlockSelected = document.querySelector(`[data-block-ref='${currentBlockId.value}'`);

        if (!currentBlockSelected) return;

        const {
            left: blockLayoutLeft,
            top: blockLayoutTop,
            width: blockLayoutWidth,
            height: blockLayoutHeight,
        } = currentBlockSelected.getBoundingClientRect();

        const elementToAdd = {
            ...element.content,
            settings: {
                ...element.content.settings,
                styles: {
                    ...(element.content.settings ? .styles || {}),
                },
            },
        };

        const newElementId = generateRandomId();

        addLayoutElement({
            layoutElements,
            blockId: currentBlockId.value,
            blockToAddRef: currentBlockSelected,
            elementId: newElementId,
            newElementData: elementToAdd,
            newElementRawLeft: blockLayoutLeft + (blockLayoutWidth / 2 - element.widthPixels / 2), // Center element horizontally
            newElementRawTop: blockLayoutTop + (blockLayoutHeight / 2 - element.heightPixels / 2), // Center element vertically
            newElementRawWidth: element.widthPixels,
            newElementRawHeight: element.heightPixels,
        });

        await nextTick();

        dispatch('selectCurrentElement', {
            elementId: newElementId,
        });

        document.querySelector(`[${DATA_ATTRIBUTE_ELEMENT_ID}="${newElementId}"]`).scrollIntoView({
            block: 'nearest',
        });
    };

    const baseActionList = computed(() => [
        // elements
        {
            id: 'add-button',
            title: 'Add Button',
            icon: 'spotlight_smart_button',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.button);
            },
            searchKeywords: 'add button element',
            category: 'elements',
        },
        {
            id: 'add-image',
            title: 'Add Image',
            icon: 'spotlight_photo',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.image);
            },
            searchKeywords: 'add image element',
            category: 'elements',
        },
        {
            id: 'add-text',
            title: 'Add Text',
            icon: 'spotlight_text',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.text);
            },
            searchKeywords: 'add text element',
            category: 'elements',
        },
        {
            id: 'add-store-button',
            title: 'Add Store Button',
            icon: 'spotlight_smart_button',
            isHidden: !getters['ecommerce/isStoreTypeZyro'],
            action: () => {
                handleElementAdd(defaultElements.value.ecommerceButton);
            },
            searchKeywords: 'add store button element',
            category: 'elements',
        },
        {
            id: 'add-gallery',
            title: 'Add Gallery',
            icon: 'spotlight_gallery_thumbnail',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.gallery);
            },
            searchKeywords: 'add gallery element',
            category: 'elements',
        },
        {
            id: 'add-video',
            title: 'Add Video',
            icon: 'spotlight_smart_display',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.video);
            },
            searchKeywords: 'add video element',
            category: 'elements',
        },
        {
            id: 'add-shape',
            title: 'Add Shape',
            icon: 'spotlight_star_rate',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.shape);
            },
            searchKeywords: 'add a shape element, add shape',
            category: 'elements',
        },
        {
            id: 'add-map',
            title: 'Add Map',
            icon: 'spotlight_map',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.map);
            },
            searchKeywords: 'add map element',
            category: 'elements',
        },
        {
            id: 'add-instagram',
            title: 'Add Instagram Feed',
            icon: 'spotlight_instagram',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.instagramFeed);
            },
            searchKeywords: 'add instagram feed element',
            category: 'elements',
        },
        {
            id: 'add-contact-form',
            title: 'Add Contact Form',
            icon: 'spotlight_add_notes',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.form);
            },
            searchKeywords: 'add contact form element',
            category: 'elements',
        },
        {
            id: 'add-subscribe-form',
            title: 'Add Subscribe Form',
            icon: 'spotlight_mail',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.subscribeForm);
            },
            searchKeywords: 'add subscribe form element',
            category: 'elements',
        },
        {
            id: 'add-social-icons',
            title: 'Add Social Icons',
            icon: 'spotlight_facebook',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.socialIcons);
            },
            searchKeywords: 'add social icons element',
            category: 'elements',
        },
        {
            id: 'add-embed-code',
            title: 'Add Embed Code',
            icon: 'spotlight_code',
            isHidden: false,
            action: () => {
                handleElementAdd(defaultElements.value.embed);
            },
            searchKeywords: 'add embed code element',
            category: 'elements',
        },
        // pages
        {
            id: 'add-page',
            title: 'Add New Page',
            icon: 'spotlight_note_add',
            isHidden: false,
            action: () => {
                const newPageId = generateRandomId();

                dispatch('addEmptyPage', {
                    pageId: newPageId,
                });

                dispatch('gui/TOGGLE_DRAWER', DRAWER_MULTI_PAGE);
            },
            searchKeywords: 'add page, new page',
            category: 'pages',
        },
        {
            id: 'open-page',
            title: 'Open Page',
            icon: 'spotlight_find_in_page',
            shouldKeepSpotlightOpen: true,
            isHidden: false,
            action: () => {
                showDefaultPageList();
            },
            searchKeywords: 'open page',
            category: 'pages',
        },
        {
            id: 'manage-pages',
            title: 'Manage Pages',
            icon: 'spotlight_layers',
            isHidden: false,
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_MULTI_PAGE);
            },
            searchKeywords: 'add page, manage pages',
            category: 'pages',
        },
        {
            id: 'manage-navigation',
            title: 'Manage Navigation',
            icon: 'spotlight_layers',
            isHidden: false,
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_MULTI_PAGE);
            },
            searchKeywords: 'manage navigation settings',
            category: 'pages',
        },
        // blog
        {
            id: 'add-blog',
            title: 'Add Blog',
            icon: 'spotlight_edit_square',
            isHidden: getters['blog/hasBlog'],
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_BLOG);

                dispatch('addBlog', {
                    pageTitle: t('common.blog'),
                    postTitle: t('builder.blog.blogPost.title'),
                    postDescription: t('builder.blog.blogPost.description'),
                    postContent: t('builder.blog.blogPageElements.content'),
                });
            },
            searchKeywords: 'add blog, create blog',
            category: 'blog',
        },
        {
            id: 'add-blog-post',
            title: 'Add New Blog Post',
            icon: 'spotlight_add',
            isHidden: !getters['blog/hasBlog'],
            action: () => {
                dispatch('addBlogPostPage', {
                    postTitle: t('builder.blog.blogPost.title'),
                    postDescription: t('builder.blog.blogPost.description'),
                    postContent: t('builder.blog.blogPageElements.content'),
                });
            },
            searchKeywords: 'add new blog post, add blog post, new post',
            category: 'blog',
        },
        {
            id: 'open-blog-post',
            title: 'Open Existing Blog Post',
            icon: 'spotlight_find_in_page',
            shouldKeepSpotlightOpen: true,
            isHidden: !getters['blog/hasBlog'],
            action: () => {
                showBlogPostPageList();
            },
            searchKeywords: 'open blog post, open post, open post settings',
            category: 'blog',
        },
        {
            id: 'manage-blog',
            title: 'Manage Blog',
            icon: 'spotlight_settings',
            isHidden: !getters['blog/hasBlog'],
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_BLOG);
            },
            searchKeywords: 'manage blog',
            category: 'blog',
        },
        // website settings
        {
            id: 'seo-settings',
            title: 'SEO Settings',
            icon: 'spotlight_settings',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: SEO_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'manage seo settings',
            category: 'websiteSettings',
        },
        {
            id: 'change-favicon',
            title: 'Change Favicon',
            icon: 'spotlight_add_photo_alternate',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: GENERAL_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'change favicon settings',
            category: 'websiteSettings',
        },
        {
            id: 'change-preview',
            title: 'Change Link Preview Image',
            icon: 'spotlight_link',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: GENERAL_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'change link preview image',
            category: 'websiteSettings',
        },
        {
            id: 'cookie-banner',
            title: 'Cookie Banner Settings',
            icon: 'spotlight_cookie',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: GENERAL_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'cookie banner settings',
            category: 'websiteSettings',
        },
        {
            id: 'www-prefix',
            title: 'Change www Prefix',
            icon: 'spotlight_language',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: GENERAL_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'change www prefix',
            category: 'websiteSettings',
        },
        {
            id: 'manage-integrations',
            title: 'Manage Integrations',
            icon: 'spotlight_settings',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: INTEGRATIONS_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'manage integrations',
            category: 'websiteSettings',
        },
        {
            id: 'form-submissions',
            title: 'Open Form Submissions',
            icon: 'spotlight_list_alt',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: FORMS_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'open form submissions',
            category: 'websiteSettings',
        },
        {
            id: 'export-wordpress',
            title: 'Export To Wordpress',
            icon: 'spotlight_wordpress',
            isHidden: state.isDemoMode,
            action: () => {
                router.push({
                    name: EXPORT_SETTINGS_ROUTE,
                });
            },
            searchKeywords: 'export to wordpress',
            category: 'websiteSettings',
        },
        {
            id: 'manage-languages',
            title: 'Manage Site Languages',
            icon: 'spotlight_translate',
            isHidden: false,
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_MULTILINGUAL);
            },
            searchKeywords: 'manage site languages',
            category: 'websiteSettings',
        },
        {
            id: 'edit-mobile-view',
            title: 'Edit Mobile View',
            icon: 'spotlight_smartphone',
            isHidden: state.gui.isMobileView,
            action: () => {
                dispatch('gui/toggleMobileView');
            },
            searchKeywords: 'edit mobile view',
            category: 'websiteSettings',
        },
        {
            id: 'edit-desktop-view',
            title: 'Edit Desktop View',
            icon: 'spotlight_laptop_windows',
            isHidden: !state.gui.isMobileView,
            action: () => {
                dispatch('gui/toggleMobileView');
            },
            searchKeywords: 'edit desktop view',
            category: 'websiteSettings',
        },
        {
            id: 'preview-website',
            title: 'Preview Website',
            icon: 'spotlight_visibility',
            isHidden: false,
            action: () => {
                router.push({
                    name: PREVIEW_ROUTE,
                });
            },
            searchKeywords: 'preview website',
            category: 'websiteSettings',
        },
        {
            id: 'back-to-editor',
            title: 'Back To Editor',
            icon: 'spotlight_arrow_back_ios_new',
            isHidden: false,
            action: () => {
                router.push({
                    name: BUILDER_ROUTE,
                });
            },
            searchKeywords: 'back to editor builder go back',
            category: 'websiteSettings',
        },
        {
            id: 'save-changes',
            title: 'Save Changes',
            icon: 'spotlight_task_alt',
            isHidden: state.isDemoMode,
            action: () => {
                if (getters['saving/canSave']) {
                    dispatch('saving/saveWebsite', {
                        saveWhenImpersonating: true,
                    });
                }
            },
            searchKeywords: 'save changes',
            category: 'websiteSettings',
        },
        {
            id: 'publish-website',
            title: 'Publish Website',
            icon: 'spotlight_publish',
            isHidden: true, // Hidden until we refactor website publish header button
            action: async () => {
                if (isHostingerBrand) {
                    // Hostinger brand site publish
                    const {
                        zyrositePreviewDomain,
                        previewDomain,
                    } = await getZyrositePreviewDomain({
                        // Make sure this works when isCustomDomainPreview is true
                        domain: state.customDomain,
                    });

                    commit('setZyroDomain', zyrositePreviewDomain);
                    commit('setPreviewDomain', previewDomain);

                    commit('gui/toggleSiteBeingPublished');
                } else {
                    // Zyro brand site publish
                    dispatch('gui/openPublishModal');
                }
            },
            searchKeywords: 'publish website update website',
            category: 'websiteSettings',
        },
        {
            id: 'update-website',
            title: 'Update Website',
            icon: 'spotlight_publish',
            isHidden: true, // Hidden until we refactor website publish header button
            action: () => {
                commit('gui/toggleSiteBeingPublished');
            },
            searchKeywords: 'publish website update website',
            category: 'websiteSettings',
        },
        {
            id: 'view-live-site',
            title: 'View Live Site',
            icon: 'spotlight_language',
            isHidden: state.isDemoMode || state.zyroDomain,
            action: () => {
                window.open(getters.siteUrl, '_blank');
            },
            searchKeywords: 'view live site',
            category: 'websiteSettings',
        },
        // store manager
        {
            id: 'add-store',
            title: getters['ecommerce/isStoreTypeZyro'] ? 'Manage store' : 'Add Store',
            icon: 'spotlight_shopping_cart',
            isHidden: state.isDemoMode,
            action: () => {
                if (getters['ecommerce/isStoreTypeZyro']) {
                    dispatch('gui/TOGGLE_DRAWER', DRAWER_MANAGE_STORE);

                    return;
                }

                dispatch('gui/TOGGLE_DRAWER', DRAWER_ADD_ONLINE_STORE);
            },
            searchKeywords: 'add store add ecommerce, add ecommerce, manage store',
            category: 'store',
        },
        {
            id: 'open-store-manager',
            title: 'Open Store Manager',
            icon: 'spotlight_shopping_cart',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite', {
                    saveWhenImpersonating: true,
                });

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                }), '_self');
            },
            searchKeywords: 'open store manager open ecommerce manager',
            category: 'store',
        },
        {
            id: 'manage-products',
            title: 'Manage Products',
            icon: 'spotlight_sell',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.PRODUCTS,
                }), '_self');
            },
            searchKeywords: 'ecommerce store manage products',
            category: 'store',
        },
        {
            id: 'add-product',
            title: 'Add Product',
            icon: 'spotlight_sell',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.PRODUCTS_ADD,
                }), '_self');
            },
            searchKeywords: 'ecommerce store add product',
            category: 'store',
        },
        {
            id: 'manage-categories',
            title: 'Manage Categories',
            icon: 'spotlight_grid_view',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.CATEGORIES,
                }), '_self');
            },
            searchKeywords: 'ecommerce store manage categories',
            category: 'store',
        },
        {
            id: 'manage-orders',
            title: 'Manage Orders',
            icon: 'spotlight_download',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.ORDERS,
                }), '_self');
            },
            searchKeywords: 'ecommerce store manage orders',
            category: 'store',
        },
        {
            id: 'manage-bookings',
            title: 'Manage Bookings',
            icon: 'spotlight_calendar_month',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.BOOKINGS,
                }), '_self');
            },
            searchKeywords: 'ecommerce store manage bookings',
            category: 'store',
        },
        {
            id: 'manage-discounts',
            title: 'Manage Discounts',
            icon: 'spotlight_sale_outline',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.DISCOUNTS,
                }), '_self');
            },
            searchKeywords: 'ecommerce store manage discounts',
            category: 'store',
        },
        {
            id: 'open-store-settings',
            title: 'Open Store Settings',
            icon: 'spotlight_settings',
            isHidden: state.isDemoMode || !getters['ecommerce/isStoreTypeZyro'],
            action: async () => {
                await dispatch('saving/saveWebsite');

                window.open(getRedirectUrlToEcommerce({
                    siteId: websiteId.value,
                    path: ECOMMERCE_REDIRECT_PATHS.STORE_SETTINGS,
                }), '_self');
            },
            searchKeywords: 'open store settings open ecommerce settings',
            category: 'store',
        },
        // ai tools
        {
            id: 'open-logo-maker',
            title: 'Open Logo Maker',
            icon: 'spotlight_auto_fix',
            isHidden: false,
            action: () => {
                window.open(getLogoMakerUrl({
                    ref: 'spotlight-search',
                }), '_blank');
            },
            searchKeywords: 'open ai logo maker',
            category: 'ai',
        },
        {
            id: 'open-text-writer',
            title: 'Open Text Writer',
            icon: 'spotlight_auto_activity_zone',
            isHidden: state.isDemoMode,
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_AI_WRITER);
            },
            searchKeywords: 'open ai text writer',
            category: 'ai',
        },
        {
            id: 'open-heatmap',
            title: 'Open Heatmap',
            icon: 'spotlight_local_fire_department',
            isHidden: state.isDemoMode,
            action: () => {
                dispatch('gui/TOGGLE_HEATMAP');
            },
            searchKeywords: 'open ai heatmap',
            category: 'ai',
        },
        // other
        {
            id: 'give-feedback',
            title: 'Give feedback',
            icon: 'spotlight_campaign',
            isHidden: false,
            action: () => {
                dispatch('gui/CLOSE_DRAWER');

                dispatch('nps/setNpsData', {
                    isVisible: true,
                });
            },
            searchKeywords: 'give feedback',
            category: 'other',
        },
        {
            id: 'open-help',
            title: 'Open Help And Resources',
            icon: 'spotlight_help',
            isHidden: false,
            action: () => {
                dispatch('gui/TOGGLE_DRAWER', DRAWER_HELP_AND_RESOURCES);
            },
            searchKeywords: 'open help and resources',
            category: 'other',
        },
    ]);

    return {
        baseActionList,
    };
};