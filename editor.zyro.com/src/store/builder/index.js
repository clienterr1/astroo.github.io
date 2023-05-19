import {
    captureMessage,
    addBreadcrumb,
    captureException,
} from '@sentry/browser';
import * as Sentry from '@sentry/browser';
import omit from 'lodash.omit';
import axios from 'axios';
import {
    initializeExperiments
} from '@/utils/experiments';
import {
    createStore
} from 'vuex';
import {
    setCookie,
    getCookie,
} from '@zyro-inc/site-modules/utils/cookies';
import {
    COOKIE_SITE_ID,
    WWW_REDIRECT_PATHS,
    REDIRECT_PARAM_KEYS,
    REDIRECT_PARAM_VALUES,
    BLOG_POST_EXAMPLE_PAGE_COUNT,
    MODAL_PUBLISH_ERROR,
    NAVIGATION_TYPE_PAGE,
    GAMIFICATION_VISIBILITY_TIMESTAMP,
} from '@/constants';
import {
    COOKIE_BANNER_TRANSLATIONS
} from '@/data';
import {
    SYSTEM_LOCALE,
    PAGE_TYPE_BLOG,
    PAGE_TYPE_ECOMMERCE_PRODUCT,
    META_ECOMMERCE_TYPE,
    ECOMMERCE_TYPE_ZYRO,
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_ECOMMERCE_BUTTON,
    ELEMENT_TYPE_IMAGE,
    ELEMENT_TYPE_TEXT_BOX,
    GENERATED_SITE_TEMPLATE_ID,
    IMPORTED_SITE_TEMPLATE_ID,
    BLANK_LAYOUT_TEMPLATE_ID,
    AI_GENERATED_TEMPLATE_ID,
    ANIMATION_TYPE_GLOBAL,
    ANIMATION_NOT_SUPPORTED_ELEMENTS,
    PREVIEW_SUBDOMAINS,
    ELEMENT_POSITION_KEY_MOBILE,
    ELEMENT_POSITION_KEY_DESKTOP,
} from '@zyro-inc/site-modules/constants';
import {
    BLOCKS_ECOMMERCE
} from '@zyro-inc/site-modules/constants/ecommerce';
import {
    getInternalLinkWithoutQueryOrHash
} from '@zyro-inc/site-modules/utils/modifyString';
import {
    filterObject,
    removeNullishEntries,
} from '@zyro-inc/site-modules/utils/object';
import {
    getEcwidPages
} from '@zyro-inc/site-modules/utils/getters/getEcwidPages';
import {
    addGoogleFontQueryLinks
} from '@/utils/injectableDomElements/addGoogleFontQueryLinks';
import assets from '@/store/builder/assets';
import blog from '@/store/builder/blog';
import colors from '@/store/builder/colors';
import ecommerce from '@/store/builder/ecommerce';
import fonts from '@/store/builder/fonts';
import flags from '@/store/builder/flags';
import {
    getFontsList
} from '@zyro-inc/site-modules/utils/font';
import forms from '@/store/builder/forms';
import gamification from '@/store/builder/gamification';
import gui, {
    OPEN_MODAL
} from '@/store/builder/gui';
import navigation from '@/store/builder/navigation';
import notifications, {
    NOTIFICATION_TYPE_MODAL,
    NOTIFICATIONS_NAMESPACE,
    NOTIFY,
} from '@/store/builder/notifications';
import nps from '@/store/builder/nps';
import ecwid from '@/store/builder/ecwid';
import saving from '@/store/builder/saving';
import subscription from '@/store/builder/subscription';
import undoRedo from '@/store/builder/undoRedo';
import user from '@/store/builder/user';
import {
    NPS_API
} from '@/api/NpsApi';
import EventLogApi from '@/api/EventLogApi';
import {
    publishSite,
    publishSiteHostinger,
    republishSite,
    republishSiteHostinger,
} from '@/api/PublishApi';
import {
    getSite
} from '@/api/SitesApi';
import {
    getTemplateById
} from '@/api/TemplateApi';
import {
    autoLoginWithDefault,
    getUser,
    logOut,
} from '@/api/UsersApi';
import {
    MOBILE_ELEMENT_TOP_OFFSET,
    DESKTOP_ELEMENT_TOP_OFFSET,
} from '@zyro-inc/site-modules/components/blocks/layout/constants';
import {
    getBlogListBlock,
    getEcwidBlock,
    getEcommerceProductListBlock,
    getPageTitleBlock,
} from '@/components/block/blocks';
import router from '@/router';
import {
    getRedirectUrlToWWW,
    getRedirectUrlToHostingerLogin,
    getRedirectUrlToDashboard,
} from '@/use/useRedirects';
import {
    generateRandomId
} from '@/utils/generateRandomId';
import {
    openIntercomMessage
} from '@/utils/intercomIntegration';
import {
    patcher
} from '@/utils/jsondiffpatch';
import {
    mergeObjects
} from '@/utils/mergeObjects';
import getCloudflareErrorCallback from '@/utils/getCloudflareErrorCallback';
import {
    addPage,
    removePage,
    addBlock,
    removeBlock,
    addBlogPostTemplate,
    addEcommerceProductPageTemplate,
    clonePage,
    localizeHrefs,
    removeElement,
} from '@/utils/siteDataUtils';
import {
    isHostingerBrand
} from '@/utils/isHostingerBrand';
import {
    updateElementHrefs
} from '@/utils/hrefToMultilanguage';
import {
    getBlocksAndElementsWithGlobalAnimations
} from '@/utils/siteEngineAnimations';
import {
    getLowestElementBottom
} from '@zyro-inc/site-modules/utils/getLowestElementBottom';

export const SET_SITE_DATA = 'SET_SITE_DATA';
export const SET_PAGE_DATA = 'SET_PAGE_DATA';
export const SET_ELEMENT_DATA = 'SET_ELEMENT_DATA';
export const SET_BLOCK_DATA = 'SET_BLOCK_DATA';
export const SET_SITE_ID = 'SET_SITE_ID';
export const SET_CURRENT_PAGE_ID = 'SET_CURRENT_PAGE_ID';
export const SET_CURRENT_BLOCK_ID = 'SET_CURRENT_BLOCK_ID';
export const SET_CURRENT_ELEMENT_ID = 'SET_CURRENT_ELEMENT_ID';
export const SET_ELEMENT_EDIT_MODE = 'SET_ELEMENT_EDIT_MODE';
export const SET_BLOCK_EDIT_MODE = 'SET_BLOCK_EDIT_MODE';
export const SET_DEFAULT_BLOCK_EDIT_TAB = 'SET_DEFAULT_BLOCK_EDIT_TAB';
export const SET_MOST_RECENT_BUILDER_PAGE_ID = 'SET_MOST_RECENT_BUILDER_PAGE_ID';
export const SET_CURRENT_LOCALE = 'SET_CURRENT_LOCALE';
export const SET_HOME_PAGE = 'SET_HOME_PAGE';
export const SET_WEBSITE_LANGUAGES = 'SET_WEBSITE_LANGUAGES';
export const SET_IS_DEMO_MODE = 'SET_IS_DEMO_MODE';
export const SET_FONTS = 'SET_FONTS';
export const SET_ADD_ELEMENT_DATA = 'SET_ADD_ELEMENT_DATA';

initializeExperiments();

const INITIAL_ZYRO_DOMAIN_PREFIX = 'mywebsite';

const DEMO_ALLOWED_API_URL_SUBSTRINGS = [NPS_API];

export const storeConfig = {
    modules: {
        assets,
        gui,
        undoRedo,
        user,
        subscription,
        navigation,
        notifications,
        nps,
        forms,
        blog,
        ecwid,
        colors,
        fonts,
        flags,
        saving,
        ecommerce,
        gamification,
    },
    state: {
        website: null,
        websiteId: null,
        websiteStatus: '',
        zyroDomain: '',
        previewDomain: '',
        customDomain: '',
        currentPageId: null,
        currentBlockId: null,
        currentElementId: null,
        mostRecentBuilderPageId: null,
        template: null,
        isAppLoading: false,
        hasBuilderInitialized: false,
        isElementEditMode: false,
        isBlockEditorOpen: false,
        defaultBlockEditTab: '',
        currentElementSnapshot: null,
        currentLocale: SYSTEM_LOCALE,
        generatedWebsite: null,
        isDemoMode: false,
        addElementData: {},
        isQATestUser: false,
        createdAt: '',
    },
    getters: {
        siteCustomDomainUrl: (state, getters) => `https://${getters.siteMeta.shouldAddWWWPrefixToDomain ? 'www.' : ''}${state.customDomain}`,
        siteZyroDomainUrl: (state) => `https://${state.zyroDomain || `${INITIAL_ZYRO_DOMAIN_PREFIX}${import.meta.env.VITE_PUBLISH_DOMAIN}`}`,
        sitePreviewDomainUrl: (state) => `https://${state.previewDomain}`,
        siteUrl: (state, getters) => (state.customDomain ? getters.siteCustomDomainUrl : getters.siteZyroDomainUrl),
        siteLanguages: (state) => state.website ? .languages ? ? {}, // need optional chaining here while builder loads
        siteLanguagesArray: (state, getters) => Object.entries(getters.siteLanguages)
            .filter(([locale]) => locale !== SYSTEM_LOCALE)
            .map(([locale, languageData]) => ({
                ...languageData,
                locale,
            })) ? ? [],
        isCurrentSystemLocale: (state) => state.currentLocale === SYSTEM_LOCALE,
        currentLanguageData: (state, getters) => getters.siteLanguages[state.currentLocale] ? ? {},
        siteBlocks: (state, getters) => getters.currentLanguageData ? .blocks ? ? {}, // languageBlocks
        siteElements: (state, getters) => getters.currentLanguageData ? .elements ? ? {}, // languageElements
        defaultLanguageSitePages: (state, getters) => getters.siteLanguages[getters.defaultLocale] ? .pages ? ? {}, // languagePages
        sitePages: (state, getters) => getters.currentLanguageData ? .pages ? ? {}, // languagePages
        siteHomePage: (state, getters) => getters.sitePages[getters.homePageId], // languageHomePage
        ecommerceShoppingCart: (state) => state.website ? .ecommerceShoppingCart,
        siteHomePageTitle: (state, getters) => getters.siteHomePage ? .meta ? .title || getters.siteHomePage.name,
        siteForms: (state) => state.website ? .forms ? ? {},
        siteMeta: (state) => state.website ? .meta ? ? {},
        siteStyles: (state) => state.website ? .styles ? ? {},
        siteFonts: (state, getters) => getters.siteStyles.font, // TODO: write a mapper to rename it to 'website.fonts'
        siteTemplate: (state, getters) => getters.siteMeta.template,
        siteNav: (state, getters) => getters.currentLanguageData ? .nav ? ? [], // languageNav
        isNavHidden: (state, getters) => !!getters.currentLanguageData.isNavHidden,
        currentPage: (state, getters) => getters.sitePages[state.currentPageId],
        currentBlock: (state, getters) => getters.siteBlocks[state.currentBlockId],
        currentBlockType: (state, getters) => getters.currentBlock ? .type,
        currentBlockSettings: (state, getters) => getters.currentBlock ? .settings,
        currentBlockStyles: (state, getters) => getters.currentBlockSettings ? .styles,
        currentBlockSlot: (state, getters) => getters.currentBlock ? .slot,
        currentElement: (state, getters) => getters.siteElements[state.currentElementId],
        currentElementId: (state) => state.currentElementId,
        currentElementContent: (state, getters) => getters.currentElement ? .content,
        currentElementSettings: (state, getters) => getters.currentElement ? .settings,
        currentElementStyles: (state, getters) => getters.currentElementSettings ? .styles,
        currentElementType: (state, getters) => getters.currentElement ? .type,
        currentElementBlockId: (state, getters) => Object.keys(getters.siteBlocks)
            .find((blockId) => getters.siteBlocks[blockId].components ? .includes(state.currentElementId)),
        currentElementBlock: (state, getters) => getters.siteBlocks[getters.currentElementBlockId],
        currentElementBlockType: (state, getters) => getters.currentElementBlock ? .type,
        isEditingTextBoxElement: (state, getters) => state.isElementEditMode && getters.currentElementType === ELEMENT_TYPE_TEXT_BOX,
        elementBlockId: (state, getters) => (elementId) => Object.keys(getters.siteBlocks)
            .find((blockId) => getters.siteBlocks[blockId].components ? .includes(elementId)),
        headerBlock: (state, getters) => getters.siteBlocks.header, // languageHeaderBlock
        footerBlock: (state, getters) => Object.values(getters.siteBlocks).find((block) => block.slot === 'footer'),
        doesFooterExist: (state, getters) => !!getters.footerBlock,
        hasGeneratedTemplate: (state, getters) => (getters.siteTemplate === GENERATED_SITE_TEMPLATE_ID),
        hasImportedTemplate: (state, getters) => (getters.siteTemplate === IMPORTED_SITE_TEMPLATE_ID),
        hasBlankTemplate: (state, getters) => (getters.siteTemplate === 'blank'),
        hasLanguages: (state, getters) => getters.siteLanguagesArray.length > 0,
        doesPageIdAlreadyExist: (state, getters) => ({
            pageId
        }) => Object.keys(getters.sitePages).includes(pageId),
        isCurrentPageTypeBlog: (state, getters) => getters.currentPage ? .type === PAGE_TYPE_BLOG,
        isCurrentPageEmpty: (state, getters) => getters.currentPage && getters.currentPage.blocks.length === 0,
        isPageSlugUnique: (state, getters) => ({
            slug,
            slugPageId,
        }) => !Object.entries(getters.sitePages).some(
            ([pageId, page]) => pageId !== slugPageId && page.slug === slug,
        ),
        templateType: (state, getters) => (getters.hasGeneratedTemplate || getters.hasImportedTemplate || getters.hasBlankTemplate ? getters.siteTemplate : 'template'),
        blogCategories: (state) => state.website ? .blogCategories ? ? {},
        homePage: (state, getters) => getters.sitePages[getters.homePageId],
        homePageId: (state, getters) => getters.currentLanguageData.homePageId,
        defaultLocale: (state, getters) => getters.siteMeta.defaultLocale ? ? SYSTEM_LOCALE,
        isLanguageSwitcherHidden: (state, getters) => getters.headerBlock ? .settings ? .isLanguageSwitcherHidden,
        defaultPages: (state, getters) => filterObject(
            getters.sitePages,
            ({
                value
            }) => value.type === 'default',
        ),
        blogPages: (state, getters) => filterObject(
            getters.sitePages,
            ({
                value
            }) => value.type === 'blog',
        ),
        ecommerceLocaleProductPages: (state, getters) => filterObject(
            getters.sitePages,
            ({
                value
            }) => value.type === PAGE_TYPE_ECOMMERCE_PRODUCT,
        ),
        // zyro ecommerce pages are not adapted for multi-language so we need to have a getter for default lang website pages
        ecommerceProductPages: (state, getters) => filterObject(
            getters.defaultLanguageSitePages,
            ({
                value
            }) => value.type === PAGE_TYPE_ECOMMERCE_PRODUCT,
        ),
        ecwidPages: (state, getters) => getEcwidPages({
            pages: getters.sitePages,
            blocks: getters.siteBlocks,
        }),
        draftBlogPages: (state, getters) => filterObject(
            getters.blogPages,
            ({
                value
            }) => value.isDraft && !value.isScheduled,
        ),
        scheduledBlogPages: (state, getters) => filterObject(
            getters.blogPages,
            ({
                value
            }) => value.isScheduled,
        ),
        publishedBlogPages: (state, getters) => filterObject(
            getters.blogPages,
            ({
                value
            }) => !value.isDraft && !value.isScheduled,
        ),
        websiteStatus: (state) => state.websiteStatus,
        addElementData: (state) => state.addElementData,
        isStoreAvailableForUser: (state, getters, rootState, rootGetters) => !isHostingerBrand || rootGetters['user/isZyroUser'],
        isSitePublished: (state) => !!state.zyroDomain,
        builderCompletedSteps: (state) => state.website ? .builderCompletedSteps,
        isQATestUser: (state) => state.isQATestUser,
        isCustomDomainPreview: (state) => state.customDomain && PREVIEW_SUBDOMAINS.some(
            (previewDomain) => state.customDomain ? .endsWith(previewDomain),
        ),
        isGamificationAvailableForSite: (state, getters) => isHostingerBrand &&
            new Date(state.createdAt).getTime() > GAMIFICATION_VISIBILITY_TIMESTAMP &&
            getters.siteMeta.template !== BLANK_LAYOUT_TEMPLATE_ID &&
            getters.siteMeta.template !== AI_GENERATED_TEMPLATE_ID &&
            !state.gui.isMobileScreen &&
            !state.isDemoMode,
    },
    mutations: {
        // App
        setIsAppLoading: (state, value) => {
            state.isAppLoading = value;
        },
        setHasBuilderInitialized: (state, value) => {
            state.hasBuilderInitialized = value;
        },
        // Website
        [SET_SITE_DATA]: (state, siteData) => {
            state.website = siteData;
        },
        [SET_PAGE_DATA]: (state, {
            locale = SYSTEM_LOCALE,
            pageId,
            pageValue,
        }) => {
            state.website.languages[locale].pages = {
                ...state.website.languages[locale].pages,
                [pageId]: pageValue,
            };
        },
        [SET_ELEMENT_DATA]: (state, {
            locale = SYSTEM_LOCALE,
            elementId,
            elementData,
        }) => {
            state.website.languages[locale].elements = {
                ...state.website.languages[locale].elements,
                [elementId]: elementData,
            };
        },
        [SET_BLOCK_DATA]: (state, {
            locale = SYSTEM_LOCALE,
            blockId,
            blockValue,
        }) => {
            state.website.languages[locale].blocks = {
                ...state.website.languages[locale].blocks,
                [blockId]: blockValue,
            };
        },
        [SET_SITE_ID]: (state, siteId) => {
            state.websiteId = siteId;
        },
        [SET_ELEMENT_EDIT_MODE]: (state, value) => {
            state.isElementEditMode = value;
        },
        [SET_BLOCK_EDIT_MODE]: (state, value) => {
            state.isBlockEditorOpen = value;
        },
        [SET_DEFAULT_BLOCK_EDIT_TAB]: (state, options) => {
            state.defaultBlockEditTab = options;
        },
        [SET_CURRENT_ELEMENT_ID]: (state, elementId) => {
            state.currentElementId = elementId;
        },
        [SET_MOST_RECENT_BUILDER_PAGE_ID]: (state, pageId) => {
            state.mostRecentBuilderPageId = pageId;
        },
        setWebsiteStatus: (state, status) => {
            state.websiteStatus = status;
        },
        setZyroDomain: (state, zyroDomain) => {
            state.zyroDomain = zyroDomain;
        },
        setPreviewDomain: (state, previewDomain) => {
            state.previewDomain = previewDomain;
        },
        setCustomDomain: (state, customDomain) => {
            state.customDomain = customDomain;
        },
        setBuilderCompletedSteps: (state, completedSteps) => {
            state.website.builderCompletedSteps = completedSteps;
        },
        setWebsiteMeta: (state, {
            key,
            value,
        }) => {
            state.website.meta[key] = value;
        },
        [SET_WEBSITE_LANGUAGES]: (state, languages) => {
            state.website.languages = languages;
        },
        [SET_HOME_PAGE]: (state, {
            locale = SYSTEM_LOCALE,
            pageId,
        }) => {
            state.website.languages[locale].homePageId = pageId;
        },
        setTemplate: (state, payload) => {
            state.template = payload;
        },
        [SET_FONTS]: (state, value) => {
            state.website.fonts = value;
        },
        // Styles
        setStyleProperty: (state, {
            element,
            property,
            value,
        }) => {
            state.website.styles[element][property] = value;
        },
        setStyleProperties: (state, {
            element,
            value,
        }) => {
            state.website.styles[element] = {
                ...state.website.styles[element],
                ...value,
            };
        },
        [SET_CURRENT_LOCALE]: (state, locale = SYSTEM_LOCALE) => {
            state.currentLocale = locale;
        },
        // Page
        [SET_CURRENT_PAGE_ID]: (state, pageId) => {
            state.currentPageId = pageId;
        },
        // Block
        [SET_CURRENT_BLOCK_ID]: (state, blockId) => {
            state.currentBlockId = blockId;
        },
        setGeneratedWebsite: (state, website) => {
            state.generatedWebsite = website;
        },
        [SET_IS_DEMO_MODE]: (state, value) => {
            state.isDemoMode = value;
        },
        [SET_ADD_ELEMENT_DATA]: (state, value) => {
            state.addElementData = {
                ...value,
            };
        },
        setIsQATestUser: (state, value) => {
            state.isQATestUser = value;
        },
        setCreatedAt: (state, value) => {
            state.createdAt = value;
        },
    },
    actions: {
        initDemoBuilder: async ({
            commit,
            dispatch,
        }) => {
            axios.interceptors.request.use((config) => {
                const isApiCallAllowedInDemoMode = DEMO_ALLOWED_API_URL_SUBSTRINGS.includes(config.url);

                if (isApiCallAllowedInDemoMode) {
                    return config;
                }

                throw new axios.Cancel('Operation not accessible in demo mode.');
            });
            const localTemplateData = (await
                import ('@/assets/templates/editor-plain-template.json')).default;

            commit(SET_SITE_DATA, localTemplateData);
            dispatch('updateCurrentLocale', localTemplateData.meta.currentLocale);
            commit(SET_SITE_ID, localTemplateData.siteId);
            commit(SET_IS_DEMO_MODE, true);
        },
        // #region General
        initBuilder: async ({
            commit,
            dispatch,
            getters,
        }, {
            siteId,
            isActualBuilderLoaded = true,
        }) => {
            commit('setIsAppLoading', true);
            if (!
                import.meta.env.VITE_DISABLE_CHALLENGE_PAGE) {
                axios.interceptors.response.use(
                    null,
                    getCloudflareErrorCallback(axios),
                );
            }

            const isDevelopmentWithPlaygroundSiteData =
                import.meta.env.DEV && siteId === 'playground';
            const isDevelopmentWithDefaultSiteData =
                import.meta.env.DEV && siteId === 'default';

            let website;

            try {
                if (isDevelopmentWithDefaultSiteData) {
                    // local development with default site data from DB
                    try {
                        website = await getSite(
                            import.meta.env.VITE_DEFAULT_SITE_ID);
                    } catch (error) {
                        if (error ? .response ? .status === 401) {
                            await autoLoginWithDefault();
                            window.location.reload();
                        }

                        // probably user is logged in to different account
                        if (error ? .response ? .status === 404) {
                            const {
                                id: userId
                            } = await getUser();

                            if (userId !==
                                import.meta.env.VITE_DEFAULT_USER_ID) {
                                await logOut();
                                await autoLoginWithDefault();
                                window.location.reload();
                            }
                        }
                    }
                } else if (isDevelopmentWithPlaygroundSiteData) {
                    // Local development setup
                    const playgroundModules =
                        import.meta.glob('@zyro-inc/site-modules/templates/playground.json', {
                            as: 'raw',
                            eager: true,
                        });

                    const [rawPlaygroundJson] = Object.values(playgroundModules);
                    const playgroundSiteData = JSON.parse(rawPlaygroundJson);

                    website = {
                        data: playgroundSiteData,
                        id: playgroundSiteData.siteId,
                    };
                } else if (siteId === 'legacy') {
                    // Temporary support legacy entrance: (cached www/crm, missed code places)
                    captureMessage('Legacy builder entrance occurred');
                    const currentSiteId = getCookie(COOKIE_SITE_ID);

                    if (!currentSiteId) {
                        window.location.assign(getRedirectUrlToDashboard({
                            path: WWW_REDIRECT_PATHS.SITES,
                        }));
                    } else {
                        website = await getSite(currentSiteId);
                    }
                } else {
                    // Prod setup
                    // Get site according to https://editor.zyro.com/{siteId}
                    website = await getSite(siteId);
                    setCookie(COOKIE_SITE_ID, siteId, 365);

                    Sentry.setContext('site', {
                        siteId,
                        domain: website.domain,
                    });
                }
            } catch (error) {
                if (error ? .response ? .status === 401) {
                    if (isHostingerBrand) {
                        window.location.assign(getRedirectUrlToHostingerLogin());
                    } else {
                        window.location.assign(getRedirectUrlToWWW({
                            path: WWW_REDIRECT_PATHS.SIGN_IN,
                            params: {
                                [REDIRECT_PARAM_KEYS.RETURN]: REDIRECT_PARAM_VALUES.RETURN_BUILDER,
                            },
                        }));
                    }
                } else {
                    router.push('/site-not-found');
                    captureMessage('Site not found');
                }

                commit('setIsAppLoading', false);

                captureException(error);

                return;
            }

            dispatch('overwriteWebsiteData', {
                websiteData: website.data,
                websiteId: website.id,
            });

            addBreadcrumb({
                category: 'CLIENT_TIMESTAMP',
                message: 'Initial website fetch',
                data: {
                    clientTimestamp: website.clientTimestamp,
                },
            });

            dispatch('saving/updateClientTimestamp', website.clientTimestamp);
            dispatch('saving/createSiteDataSnapshot', {
                siteData: website.data,
            });
            dispatch('updateCurrentLocale', getters.defaultLocale);
            dispatch('undoRedo/setInitialSiteData');
            dispatch('updateCurrentPageId');

            // If local template is loaded up (without user data), omit fetching subscriptions/user/etc, since fetches will fail
            if (!isDevelopmentWithPlaygroundSiteData) {
                await dispatch('subscription/getSitesSubscriptions');
                await dispatch('user/getUser');
                await dispatch('user/setHostingerDomain');
                await dispatch('subscription/getSubscription');

                dispatch('fonts/fetchGoogleFonts');
                dispatch('assets/fetchAssets');

                // Domain is treated as a string in most places, but from DB often returned as 'null'.
                commit('setZyroDomain', website.domain ? ? '');
                commit('setPreviewDomain', website.previewDomain ? ? '');
                commit('setCustomDomain', website.customDomain);
                commit('setWebsiteStatus', website.status);
                commit('assets/setAssetPaths', website.assetsData || {});
                commit('setCreatedAt', website.created);

                if (isActualBuilderLoaded) {
                    EventLogApi.logEvent({
                        eventName: 'template.load',
                        eventProperties: {
                            templateId: website.templateId,
                            hasShopBlock: getters['ecwid/isLocaleWithEcwid'],
                            activeSubscriptions: getters['subscription/activeSubscriptions'],
                            isSubscriptionAssigned: getters['subscription/hasActiveSubscription'],
                            templateType: getters.templateType,
                            isLayout: getters.siteMeta.isLayout,
                        },
                    });

                    EventLogApi.logEvent({
                        eventName: 'website_builder.builder.enter',
                        isHostingerEvent: true,
                        eventProperties: {
                            website_id: siteId,
                        },
                    });
                }

                const isAnyStoreCreated = getters['ecwid/isLocaleWithEcwid'] || getters['ecommerce/isStoreTypeZyro'];

                if (!isAnyStoreCreated) {
                    EventLogApi.logEvent({
                        eventName: 'site.eshopDoNotContainBlock',
                    });
                }

                if (getters['flags/isLayoutOnly']) {
                    window.hj('identify', getters['user/userId'], {
                        'builder.isLayoutOnly': true,
                    });
                }
            }

            if (getters['fonts/getMetaFont']) {
                addGoogleFontQueryLinks(getters['fonts/getMetaFont']);
            }

            commit('setHasBuilderInitialized', true);
            commit('setIsAppLoading', false);
            dispatch('forms/initForms');
        },
        getTemplate: async ({
            dispatch,
            commit,
        }, {
            templateId
        }) => {
            try {
                const template = await getTemplateById(templateId);

                commit('setTemplate', template);
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    messageI18nKeyPath: 'builder.errorWhileLoadingTemplateStructure',
                    origin: 'Vuex index store, getTemplate',
                });

                captureException(error);
            }
        },
        publishWebsite: async ({
            state,
            commit,
            getters,
            dispatch,
        }, {
            zyroDomain,
            previewDomain,
        }) => {
            const {
                websiteId
            } = state;

            try {
                await dispatch('saving/saveWebsite', {
                    saveWhenImpersonating: true,
                });

                if (getters['saving/canSave']) {
                    return;
                }

                if (isHostingerBrand) {
                    await publishSiteHostinger(zyroDomain, websiteId);

                    EventLogApi.logEvent({
                        eventName: 'website_builder.builder.website_published',
                        eventProperties: {
                            website_id: websiteId,
                        },
                        isHostingerEvent: true,
                    });
                } else {
                    await publishSite(zyroDomain, websiteId);
                }

                commit('setZyroDomain', zyroDomain);
                commit('setPreviewDomain', previewDomain);
                dispatch(`gui/${OPEN_MODAL}`, {
                    name: 'PublishedModal',
                });
            } catch (error) {
                /**
                 * TODO: Proper error handling, should consult with ux,
                 * maybe try again button that would try to republish again
                 * without the need to open publish modal
                 */
                commit('setZyroDomain', '');
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    type: NOTIFICATION_TYPE_MODAL,
                    origin: 'Vuex index store, publishWebsite',
                    props: {
                        modalName: MODAL_PUBLISH_ERROR,
                    },
                });

                captureException(error);
            }
        },
        setIsQATestUser: ({
            commit
        }, value) => {
            commit('setIsQATestUser', value);
        },
        updateWebsite: async ({
            state,
            getters,
            dispatch,
            rootGetters,
        }, payload = {
            showModal: true,
        }) => {
            const {
                websiteId
            } = state;

            const isSiteWithEcommerce = rootGetters['ecommerce/isSiteWithEcommerceItems'];

            try {
                await dispatch('saving/saveWebsite', {
                    saveWhenImpersonating: true,
                });

                if (getters['saving/canSave']) {
                    return;
                }

                if (isHostingerBrand) {
                    await republishSiteHostinger(websiteId, isSiteWithEcommerce);

                    EventLogApi.logEvent({
                        eventName: 'website_builder.builder.website_update',
                        eventProperties: {
                            website_id: websiteId,
                        },
                        isHostingerEvent: true,
                    });
                } else {
                    await republishSite(websiteId, isSiteWithEcommerce);
                }

                if (payload.showModal) {
                    dispatch(`gui/${OPEN_MODAL}`, {
                        name: 'PublishedModal',
                        settings: {
                            isUpdate: true,
                        },
                    });
                }
            } catch (error) {
                /**
                 * TODO: Proper error handling, should consult with ux,
                 * maybe try again button that would try to republish again
                 * without the need to open republish modal
                 */
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    type: NOTIFICATION_TYPE_MODAL,
                    origin: 'Vuex index store, updateWebsite',
                    props: {
                        modalName: MODAL_PUBLISH_ERROR,
                    },
                });

                captureException(error);
            }
        },
        overwriteWebsiteData: ({
            dispatch,
            commit,
        }, {
            websiteData,
            websiteId,
        }) => {
            if (websiteData) {
                commit(SET_SITE_DATA, websiteData);
                if (websiteId) {
                    commit(SET_SITE_ID, websiteId);
                }
            } else {
                // if incoming websiteData is malformed, show notification and open Intercom
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'overwriteWebsiteData',
                    messageI18nKeyPath: 'builder.overwriteWebsiteDataNotification',
                    // only show recovery and open chat when Intercom is present in window:
                    submitLabelI18nKeyPath: window.Intercom ? 'common.reportError' : null,
                    submitCallback: openIntercomMessage,
                });
                // ...and dispatch custom error to Sentry
                Sentry.captureException(new Error(`Trying to set website data as: ${websiteData}`), {
                    tags: {
                        errorType: 'Invalid data.json',
                    },
                });
            }
        },
        updateInternalLinks: ({
            getters,
            dispatch,
        }, {
            oldLink,
            newLink,
        }) => {
            // Update elements containing internal links
            Object.entries(getters.siteElements).forEach(([elementId, element]) => {
                if (!element) {
                    return;
                }

                // Images and buttons have the same structure, so we can replace them in the same way
                const elementsWithUpdatableHref = [
                    ELEMENT_TYPE_BUTTON,
                    ELEMENT_TYPE_IMAGE,
                ];

                if (elementsWithUpdatableHref.includes(element.type)) {
                    const hrefWithoutQueryOrHash = getInternalLinkWithoutQueryOrHash(element.settings.href);

                    if (hrefWithoutQueryOrHash === oldLink) {
                        dispatch('mergeElementData', {
                            elementId,
                            elementData: {
                                settings: {
                                    href: element.settings.href.replace(oldLink, newLink),
                                },
                            },
                        });
                    }
                } else if (element.type === ELEMENT_TYPE_TEXT_BOX) {
                    const temporaryElement = document.createElement('div');

                    temporaryElement.innerHTML = element.content;
                    [...temporaryElement.getElementsByTagName('a')].forEach((anchorElement) => {
                        const anchorHref = anchorElement.getAttribute('href');
                        const anchorHrefWithoutQueryOrHash = getInternalLinkWithoutQueryOrHash(anchorHref);

                        if (anchorHrefWithoutQueryOrHash === oldLink) {
                            anchorElement.setAttribute('href', anchorHref.replace(oldLink, newLink));
                        }
                    });

                    if (temporaryElement.innerHTML !== element.content) {
                        dispatch('mergeElementData', {
                            elementId,
                            elementData: {
                                content: temporaryElement.innerHTML,
                            },
                        });
                    }
                }
            });

            // Update navigation links containing internal links
            getters.siteNav.forEach((navItem) => {
                const linkHrefWithoutQueryOrHash = getInternalLinkWithoutQueryOrHash(navItem.href);

                if (oldLink === linkHrefWithoutQueryOrHash) {
                    dispatch('navigation/setItemData', {
                        data: {
                            ...navItem,
                            href: newLink,
                        },
                    });
                }
            });
        },
        updateMostRecentBuilderPageId: ({
            commit
        }, pageId) => {
            commit(SET_MOST_RECENT_BUILDER_PAGE_ID, pageId);
        },
        updateFonts: ({
            state,
            getters,
            commit,
        }) => {
            const {
                googleFonts
            } = state.fonts;
            const allSiteElements = Object.values(getters.siteLanguages).flatMap((language) => Object.values(language.elements));
            const allTextElementsHtml = allSiteElements
                .filter(({
                    type
                }) => type === ELEMENT_TYPE_TEXT_BOX)
                .map(({
                    content
                }) => content)
                .join();

            const fontsInUse = getFontsList({
                siteData: state.website,
                html: allTextElementsHtml,
                customFonts: getters['assets/customFonts'],
                googleFonts,
            });

            commit(SET_FONTS, fontsInUse);
        },
        updateAddElementData: ({
            commit
        }, data) => {
            commit(SET_ADD_ELEMENT_DATA, data);
        },
        addBuilderCompletedStep({
            commit,
            getters,
        }, completedStep) {
            commit('setBuilderCompletedSteps', {
                ...getters.builderCompletedSteps,
                ...completedStep,
            });
        },
        removeMetaProperty({
            state,
            commit,
        }, propKey) {
            const {
                [propKey]: _propValue,
                ...cleanMeta
            } = state.website.meta;

            commit(SET_SITE_DATA, {
                ...state.website,
                meta: cleanMeta,
            });
        },
        // #endregion
        // #region Element
        selectCurrentElement: ({
            commit
        }, {
            elementId
        }) => {
            commit(SET_CURRENT_ELEMENT_ID, elementId);
        },
        unselectCurrentElement: ({
            commit
        }) => {
            commit(SET_CURRENT_ELEMENT_ID, null);
        },
        enterElementEditMode: ({
            commit
        }) => {
            commit(SET_ELEMENT_EDIT_MODE, true);
        },
        leaveElementEditMode: ({
            dispatch,
            commit,
        }, {
            saveToHistory = true
        } = {}) => {
            dispatch('unselectCurrentElement');

            if (saveToHistory) {
                dispatch('undoRedo/createSnapshot');
            }

            commit(SET_ELEMENT_EDIT_MODE, false);
        },
        enterBlockEditMode: ({
            commit
        }) => {
            commit(SET_BLOCK_EDIT_MODE, true);
        },
        leaveBlockEditMode: ({
            commit
        }) => {
            commit(SET_BLOCK_EDIT_MODE, false);
        },
        setDefaultBlockEditTab: ({
            commit
        }, options) => {
            commit(SET_DEFAULT_BLOCK_EDIT_TAB, options);
        },
        addElement: ({
            state,
            dispatch,
        }, {
            blockId,
            elementId = generateRandomId(),
            elementData,
            mobilePosition = null,
        }) => {
            try {
                const elementDataCopy = {
                    ...elementData,
                };
                const locale = state.currentLocale;
                const isElementEcommerceButton = elementDataCopy.type === ELEMENT_TYPE_ECOMMERCE_BUTTON;

                // Generate action comes first to create a correct diff of website data
                if (isElementEcommerceButton) {
                    dispatch('generateEcommercePages');
                }

                const siteDataClone = patcher.clone(state.website);

                // Handle global animations
                const itemWithGlobalAnimation = getBlocksAndElementsWithGlobalAnimations({
                    blocks: siteDataClone.languages[locale].blocks,
                    elements: siteDataClone.languages[locale].elements,
                });

                if (itemWithGlobalAnimation && !ANIMATION_NOT_SUPPORTED_ELEMENTS.includes(elementData.type)) {
                    const elementDataWithAnimation = {
                        ...elementDataCopy,
                        animation: {
                            name: itemWithGlobalAnimation.animation.name,
                            type: ANIMATION_TYPE_GLOBAL,
                        },
                    };

                    siteDataClone.languages[locale].elements[elementId] = elementDataWithAnimation;
                } else {
                    siteDataClone.languages[locale].elements[elementId] = elementDataCopy;
                }

                // Handle website.blocks
                if (mobilePosition) {
                    siteDataClone.languages[locale].blocks[blockId].components.splice(mobilePosition, 0, elementId);
                } else {
                    siteDataClone.languages[locale].blocks[blockId].components.push(elementId);
                }

                siteDataClone.languages[locale].blocks[blockId].zindexes.push(elementId);

                // Handle website.meta
                if (!siteDataClone.meta[META_ECOMMERCE_TYPE] && isElementEcommerceButton) {
                    siteDataClone.meta[META_ECOMMERCE_TYPE] = ECOMMERCE_TYPE_ZYRO;
                }

                dispatch('overwriteWebsiteData', {
                    websiteData: siteDataClone,
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'addElement',
                    message: 'Error while adding element. Refresh page and try again.',
                });
                Sentry.captureException(new Error('Error while adding element'));
                throw error;
            }
        },
        duplicateCurrentElement: ({
            state,
            getters,
            commit,
            dispatch,
        }) => {
            if (!getters.currentBlock) {
                dispatch('updateCurrentBlockId', getters.currentElementBlockId);
            }

            // map current block elements data from all elements list
            const blockElements = getters.currentBlock.components.map((elementId) => getters.siteElements[elementId]);

            const newElement = patcher.clone(getters.currentElement);
            const elementIsInLayoutBlock = !!newElement.desktop;
            let newElementMobilePosition = null;

            if (elementIsInLayoutBlock) {
                if (getters['gui/isMobileMode']) {
                    newElement.mobile.top += newElement.mobile.height + MOBILE_ELEMENT_TOP_OFFSET;

                    const lowestElementBottom = getLowestElementBottom({
                        blockElements,
                        elementPositionKey: ELEMENT_POSITION_KEY_DESKTOP,
                    });

                    newElement.desktop.top = lowestElementBottom;
                } else {
                    newElement.desktop.top += DESKTOP_ELEMENT_TOP_OFFSET;

                    const lowestElementBottom = getLowestElementBottom({
                        blockElements,
                        elementPositionKey: ELEMENT_POSITION_KEY_MOBILE,
                    });

                    newElement.mobile.top = lowestElementBottom;
                }
            } else {
                const newElementPositions = newElement.settings.styles.position.split('/');
                const BUILDER_HORIZONTAL_LIMIT = 15;

                newElementMobilePosition = getters.siteBlocks[getters.currentElementBlockId]
                    .components.findIndex((el) => el === state.currentElementId) + 1;

                newElement.settings.styles.position = newElementPositions
                    .map((positionPoint, index) => {
                        const positionPointNumber = Number.parseInt(positionPoint, 10);
                        const isOutsideGrid = (index === 1 || index === 3) &&
                            Number.parseInt(newElementPositions[3], 10) === BUILDER_HORIZONTAL_LIMIT;

                        if (isOutsideGrid) {
                            return positionPointNumber;
                        }

                        return positionPointNumber + 1;
                    })
                    .join('/');
            }

            dispatch('addElement', {
                blockId: getters.currentElementBlockId,
                elementData: newElement,
                mobilePosition: newElementMobilePosition,
            });
            commit(SET_ELEMENT_EDIT_MODE, false);
        },
        removeElement: ({
            state,
            dispatch,
            getters,
        }, {
            elementId
        }) => {
            try {
                const siteDataWithElementRemoved = removeElement({
                    locale: state.currentLocale,
                    siteData: state.website,
                    elementId,
                });

                const isTextBox = getters.siteElements[elementId].type === 'GridTextBox';

                dispatch('overwriteWebsiteData', {
                    websiteData: siteDataWithElementRemoved,
                });

                if (getters.currentPage.type === PAGE_TYPE_BLOG && isTextBox) {
                    dispatch('blog/calculateReadTime', {
                        pageId: state.currentPageId,
                    });
                }

                dispatch('unselectCurrentElement');
                dispatch('undoRedo/createSnapshot');
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'removeElement',
                    message: 'Error while removing element. Refresh page and try again.',
                });
                Sentry.captureException(new Error('Error while removing element'));
                throw error;
            }
        },
        removeCurrentElement: ({
            state,
            dispatch,
        }) => {
            dispatch('removeElement', {
                elementId: state.currentElementId,
            });
        },
        mergeElementData: ({
            state,
            commit,
            getters,
            dispatch,
        }, {
            elementId,
            elementData,
            locale = null,
        }) => {
            try {
                const language = locale || state.currentLocale;
                const mergedElementData = mergeObjects(getters.siteLanguages[language].elements[elementId], elementData);
                const cleanedElementData = removeNullishEntries(mergedElementData);

                commit(SET_ELEMENT_DATA, {
                    locale: language,
                    elementId,
                    elementData: cleanedElementData,
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'updateElement',
                    message: 'Error while updating element. Refresh page and try again.',
                });
                Sentry.captureException(new Error('Error while updating element'));
                throw error;
            }
        },
        mergeCurrentElementData: ({
            state,
            dispatch,
            getters,
        }, {
            elementData
        }) => {
            if (!state.currentElementId || !getters.currentLanguageData.elements[state.currentElementId]) return;

            dispatch('mergeElementData', {
                elementId: state.currentElementId,
                elementData,
            });
        },
        moveElementBetweenBlocks: async ({
            getters,
            dispatch,
        }, {
            elementId,
            oldBlockId,
            newBlockId,
        }) => {
            const {
                siteBlocks,
                siteElements,
                'gui/isMobileMode': isMobileMode,
            } = getters;
            const newBlockData = siteBlocks[newBlockId];
            const oldBlockData = siteBlocks[oldBlockId];

            // Remove element from old block
            dispatch('updateBlockData', {
                blockId: oldBlockId,
                blockData: {
                    components: oldBlockData.components.filter((id) => id !== elementId),
                    zindexes: oldBlockData.zindexes.filter((id) => id !== elementId),
                },
                pushToHistory: false,
                merge: true,
            });

            // While editing desktop, before moving element to different block
            // first we need to find lowest element and
            // only then add new element right after it
            if (!isMobileMode.value) {
                const blockElements = Object.entries(siteElements)
                    .filter(([siteElementId]) => newBlockData.components.includes(siteElementId))
                    // eslint-disable-next-line no-unused-vars
                    .map(([_siteElementId, siteElementData]) => siteElementData);

                const lowestElementBottom = getLowestElementBottom({
                    blockElements,
                    elementPositionKey: 'mobile',
                });

                dispatch('mergeElementData', {
                    elementId,
                    elementData: {
                        mobile: {
                            top: lowestElementBottom,
                        },
                    },

                });
            }

            // Add element to new block
            await dispatch('updateBlockData', {
                blockId: newBlockId,
                blockData: {
                    components: [
                        ...newBlockData.components,
                        elementId,
                    ],
                    zindexes: [
                        ...newBlockData.zindexes,
                        elementId,
                    ],
                },
                pushToHistory: false,
                merge: true,
            });

            dispatch('updateCurrentBlockId', newBlockId);
        },
        // #endregion
        // #region Block
        updateCurrentBlockId: ({
            commit
        }, blockId) => {
            commit(SET_CURRENT_BLOCK_ID, blockId);
        },
        addBlock: ({
            state,
            dispatch,
        }, {
            pageId,
            blockId = generateRandomId(),
            blockData,
            previousBlockId,
            elements = {},
            blocks = {},
            slideshowBlockId,
            slideMetadata = {},
        }) => {
            try {
                const locale = state.currentLocale;

                // generate action comes first to create a correct diff of website data
                if (BLOCKS_ECOMMERCE.includes(blockData ? .type)) {
                    dispatch('generateEcommercePages');
                }

                const siteDataWithAddedBlock = addBlock({
                    siteData: state.website,
                    pageId,
                    blockId,
                    blockData,
                    previousBlockId,
                    elements,
                    blocks,
                    slideshowBlockId,
                    slideMetadata,
                    locale,
                });

                dispatch('overwriteWebsiteData', {
                    websiteData: siteDataWithAddedBlock,
                });

                dispatch('undoRedo/createSnapshot');
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'addBlock',
                    message: 'Error while adding block. Refresh page and try again.',
                });
                Sentry.captureException(new Error('Error while adding block'));
                throw error;
            }
        },
        removeBlock: ({
            state,
            dispatch,
        }, {
            blockId,
            rootBlock = true,
        }) => {
            try {
                if (rootBlock) {
                    dispatch('updateCurrentBlockId', null);
                }

                const siteDataWithBlockRemoved = removeBlock({
                    siteData: state.website,
                    blockId,
                    locale: state.currentLocale,
                });

                dispatch('overwriteWebsiteData', {
                    websiteData: siteDataWithBlockRemoved,
                });

                dispatch('undoRedo/createSnapshot');
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'removeBlock',
                    message: 'Error while removing block. Refresh page and try again.',
                });
                Sentry.captureException(new Error('Error while removing block'));
                throw error;
            }
        },
        updateBlockData: ({
            state,
            commit,
            getters,
            dispatch,
        }, {
            blockId,
            blockData,
            merge = false,
            locale = null,
        }) => {
            try {
                const mergedBlockData = mergeObjects(getters.currentLanguageData.blocks[blockId], blockData);
                const cleanedBlockData = removeNullishEntries(merge ? mergedBlockData : blockData);

                commit(SET_BLOCK_DATA, {
                    blockId,
                    locale: locale || state.currentLocale,
                    blockValue: cleanedBlockData,
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'updateBlock',
                    message: 'Error while updating block. Refresh page and try again.',
                });
                Sentry.captureException(new Error('Error while updating block'));
                throw error;
            }
        },
        // #endregion
        // #region Page
        updateCurrentPageId: ({
            dispatch,
            getters,
            commit,
        }, pageId = getters.homePageId) => {
            dispatch('unselectCurrentElement');
            dispatch('updateCurrentBlockId', null);

            commit(SET_CURRENT_PAGE_ID, pageId);
            window.scrollTo(0, 0);
            dispatch('undoRedo/resetUndoRedo');
        },
        addPage: ({
            state,
            dispatch,
        }, {
            pageId = generateRandomId(),
            pageData,
            blocks,
            elements,
            navigationItem,
        }) => {
            const locale = state.currentLocale;
            const isPageTypeEcwid = blocks && Object.values(blocks).some(({
                type
            }) => type === 'BlockEcwidStore');
            const isPageTypeEcommerce = blocks && Object.values(blocks).some(({
                type
            }) => type === 'BlockEcommerceProductList');

            const siteDataWithPage = addPage({
                locale,
                siteData: state.website,
                pageId,
                pageData: {
                    ...pageData,
                    slug: `page-${pageId}`,
                },
                blocks,
                elements,
                navigationItem,
                isPageTypeEcwid,
                isPageTypeEcommerce,
            });

            dispatch('overwriteWebsiteData', {
                websiteData: siteDataWithPage,
            });
            dispatch('updateCurrentPageId', pageId);
            // Temporary reset undo/redo after page add/remove, to assure reliable data flow.
            dispatch('undoRedo/resetUndoRedo');
            if (isPageTypeEcommerce) {
                dispatch('generateEcommercePages');
            }

            dispatch('navigation/updateNavigationVisibility');
        },
        updateHomePage: ({
            commit,
            state,
        }, {
            pageId
        }) => {
            const locale = state.currentLocale;

            commit(SET_HOME_PAGE, {
                locale,
                pageId,
            });
        },
        duplicatePage: ({
            dispatch,
            state,
        }, {
            siteData,
            pageId,
            clonedPageId = generateRandomId(),
        }) => {
            const locale = state.currentLocale;

            const {
                clonedPageData,
                clonedBlocks,
                clonedElements,
                clonedPageNavigationItem,
            } = clonePage({
                siteData,
                pageId,
                fromLocale: locale,
                toLocale: locale,
            });

            dispatch('addPage', {
                pageId: clonedPageId,
                pageData: clonedPageData,
                blocks: clonedBlocks,
                elements: clonedElements,
                navigationItem: clonedPageNavigationItem,
                navigateToAddedPage: true,
            });
        },
        setLocaleMeta: ({
            dispatch,
            state,
        }, {
            metaTitle
        }) => {
            const locale = state.currentLocale;
            const siteDataClone = patcher.clone(state.website);

            siteDataClone.languages[locale].metaTitle = metaTitle;

            dispatch('overwriteWebsiteData', {
                websiteData: siteDataClone,
            });
        },
        addLanguage: ({
            state,
            getters,
            dispatch,
        }, language) => {
            const {
                locale
            } = language;
            const {
                defaultLocale,
                siteUrl,
                isCurrentSystemLocale,
            } = getters;
            const siteData = patcher.clone(state.website);
            const {
                disclaimer: defaultCookieDisclaimer,
                accept: defaultCookieAcceptText,
                decline: defaultCookieDeclineText,
            } = COOKIE_BANNER_TRANSLATIONS.en;

            const languageData = {
                ...patcher.clone(siteData.languages[defaultLocale]),
                ...language,
            };

            const isDisclaimerUndefined = languageData.cookieBannerDisclaimer === undefined;
            const isDisclaimerDefault = languageData.cookieBannerDisclaimer === defaultCookieDisclaimer;

            // if default locale is system, change it to incoming locale
            if (defaultLocale === SYSTEM_LOCALE) {
                siteData.meta.defaultLocale = locale;
                languageData.metaTitle = siteData.meta.metaTitle;

                // else, filter out ecommerce page related content and suffix all remaining pages names with locale
            } else {
                const ecommercePages = Object.fromEntries(Object.entries(languageData.pages).filter(([, value]) => value.type === 'ecommerce-product'));
                const ecommercePageBlockIds = Object.keys(ecommercePages).flatMap((pageId) => ecommercePages[pageId].blocks);
                const ecommercePageElementIds = ecommercePageBlockIds.flatMap(
                    (blockId) => languageData.blocks[blockId].components,
                ).filter((value) => value);

                languageData.pages = Object.fromEntries(Object.entries(languageData.pages).filter(([, value]) => value.type !== 'ecommerce-product'));
                languageData.blocks = Object.fromEntries(Object.entries(languageData.blocks).filter(
                    ([blockId]) => !ecommercePageBlockIds.includes(blockId),
                ));
                languageData.elements = Object.fromEntries(Object.entries(languageData.elements).filter(
                    ([elementId]) => !ecommercePageElementIds.includes(elementId),
                ));

                Object.keys(languageData.pages).forEach((pageId) => {
                    languageData.pages[pageId].name += ` (${locale.toUpperCase()})`;
                });
            }

            if (locale !== defaultLocale && defaultLocale !== SYSTEM_LOCALE) {
                languageData.elements = updateElementHrefs({
                    elements: languageData.elements,
                    locale,
                    siteUrl,
                });
            }

            languageData.cookieBannerDisclaimer = isDisclaimerUndefined || isDisclaimerDefault || !isCurrentSystemLocale ?
                (COOKIE_BANNER_TRANSLATIONS[locale] ? .disclaimer ? ? defaultCookieDisclaimer) :
                languageData.cookieBannerDisclaimer;

            languageData.cookieBannerAcceptText = COOKIE_BANNER_TRANSLATIONS[locale] ? .accept ? ? defaultCookieAcceptText;
            languageData.cookieBannerDeclineText = COOKIE_BANNER_TRANSLATIONS[locale] ? .decline ? ? defaultCookieDeclineText;

            siteData.languages[locale] = languageData;

            dispatch('overwriteWebsiteData', {
                websiteData: localizeHrefs(siteData, locale),
            });
            dispatch('updateCurrentLocale', locale);
            dispatch('updateCurrentPageId');
            dispatch('navigation/updateNavigationVisibility');
        },
        removeLanguage: async ({
            state,
            dispatch,
        }, locale) => {
            let {
                defaultLocale
            } = state.website.meta;
            const siteData = patcher.clone(state.website);
            const remainingLanguages = filterObject(siteData.languages, ({
                key
            }) => key !== locale);
            const {
                disclaimer: defaultCookieDisclaimer,
                accept: defaultCookieAcceptText,
                decline: defaultCookieDeclineText,
            } = COOKIE_BANNER_TRANSLATIONS.en;

            // if only 'system' locale is left, transfer deleted locale data to system and delete it
            if (Object.keys(remainingLanguages).length === 1) {
                const {
                    alt,
                    country,
                    flagPath,
                    locale: _oldLocale,
                    name,
                    src,
                    ...restData
                } = patcher.clone(siteData.languages[locale]);

                siteData.languages.system = {
                    ...restData,
                    cookieBannerDisclaimer: defaultCookieDisclaimer,
                    cookieBannerAcceptText: defaultCookieAcceptText,
                    cookieBannerDeclineText: defaultCookieDeclineText,
                };
                delete siteData.languages[locale];
            } else {
                siteData.languages = remainingLanguages;
            }

            // if passed locale is the same as current default, override it with first leftover locale (can be undefined)
            if (locale === defaultLocale) {
                defaultLocale = Object.keys(remainingLanguages).find((key) => key !== SYSTEM_LOCALE) ? ? SYSTEM_LOCALE;
                siteData.meta.defaultLocale = defaultLocale;
            }

            if (locale === state.currentLocale) {
                // force await to wait for actual locale and page change before overwriting siteData
                await dispatch('updateCurrentLocale', defaultLocale);
                await dispatch('updateCurrentPageId', siteData.languages[defaultLocale].homePageId);
            }

            dispatch('overwriteWebsiteData', {
                websiteData: siteData,
            });
            dispatch('navigation/updateNavigationVisibility');
        },
        updateLanguageVisibility: ({
            dispatch,
            getters,
        }, {
            locale,
            isHidden,
        }) => {
            const languages = {
                ...getters.siteLanguages,
                [locale]: {
                    ...getters.siteLanguages[locale],
                    isHidden,
                },
            };

            dispatch('updateLanguages', languages);
        },
        addEmptyPage: ({
            dispatch
        }, {
            pageId = generateRandomId()
        }) => {
            dispatch('addPage', {
                pageId,
                pageData: {
                    name: 'New empty page',
                    blocks: [],
                    type: 'default',
                },
                blocks: {},
                navigationItem: {
                    linkType: NAVIGATION_TYPE_PAGE,
                    subItems: [],
                },
                navigateToAddedPage: true,
            });
        },
        addStorePage: ({
            dispatch
        }, {
            isEcommerce = false,
            isFromSidebar = false,
        } = {}) => {
            const blockId = generateRandomId();
            const blockData = isEcommerce ? getEcommerceProductListBlock() : getEcwidBlock();

            dispatch('addPage', {
                pageData: {
                    name: 'Store',
                    blocks: [blockId],
                    type: 'default',
                },
                blocks: {
                    [blockId]: {
                        ...blockData,
                    },
                },
                navigationItem: {
                    linkType: NAVIGATION_TYPE_PAGE,
                    subItems: [],
                },
            });

            EventLogApi.logEvent({
                eventName: 'builder.add_section',
                eventProperties: {
                    from: isFromSidebar ? 'ecommerce_drawer' : 'library',
                    action: 'click',
                    type: isEcommerce ? 'ecommerce_product_list' : 'ecwid_product_list',
                },
            });
        },
        addBlogPostPage: ({
            state,
            dispatch,
            getters,
        }, {
            postTitle,
            postDescription,
            postContent,
        }) => {
            const locale = state.currentLocale;
            const isLayoutOnly = getters['flags/isLayoutOnly'];

            const {
                siteDataWithBlogPostPage,
                pageId,
            } = addBlogPostTemplate({
                locale,
                siteData: state.website,
                postTitle,
                postDescription,
                postContent,
                isDraft: true,
                isLayoutOnly,
            });

            dispatch('overwriteWebsiteData', {
                websiteData: siteDataWithBlogPostPage,
            });
            dispatch('updateCurrentPageId', pageId);
            // Temporary reset undo/redo after page add/remove, to assure reliable data flow.
            dispatch('undoRedo/resetUndoRedo');

            EventLogApi.logEvent({
                eventName: 'builder.blog.create_new_post',
            });
        },
        addBlog: ({
            state,
            dispatch,
            getters,
        }, {
            existingPageId = false,
            existingPagePreviousBlockId,
            pageTitle,
            postTitle,
            postDescription,
            postContent,
            pageId = generateRandomId(),
            shouldAddExampleBlogPosts = !getters['blog/hasBlog'],
        } = {}) => {
            const locale = state.currentLocale;
            const isLayoutOnly = getters['flags/isLayoutOnly'];

            let siteData = state.website;
            let siteDataWithBlogListAdded = null;

            const blogListBlock = {
                id: generateRandomId(),
                data: getBlogListBlock({
                    mockCategories: false,
                }),
            };

            // Add example blog posts if page doesn't have any blog posts or blog sections.
            if (shouldAddExampleBlogPosts) {
                const siteDataWithBlogPost = [...Array(BLOG_POST_EXAMPLE_PAGE_COUNT)]
                    .reduce((siteDataWithBlogPostPages) => {
                        const {
                            siteDataWithBlogPostPage
                        } = addBlogPostTemplate({
                            locale,
                            siteData: siteDataWithBlogPostPages,
                            postTitle,
                            postDescription,
                            postContent,
                            isDraft: false,
                            isLayoutOnly,
                        });

                        return siteDataWithBlogPostPage;
                    }, siteData);

                siteData = siteDataWithBlogPost;
            }

            // Add blog list page to a current page OR as a new page
            if (existingPageId) {
                siteDataWithBlogListAdded = addBlock({
                    locale,
                    siteData,
                    pageId: state.currentPageId,
                    blockId: blogListBlock.id,
                    blockData: blogListBlock.data,
                    previousBlockId: existingPagePreviousBlockId,
                });
            } else {
                const blogTitleBlockId = generateRandomId();
                const blogTitleBlock = getPageTitleBlock({
                    title: pageTitle,
                });

                siteDataWithBlogListAdded = addPage({
                    locale,
                    siteData,
                    pageId,
                    pageData: {
                        name: pageTitle,
                        slug: `page-${pageId}`,
                        blocks: [
                            blogTitleBlockId,
                            blogListBlock.id,
                        ],
                        type: 'default',
                    },
                    blocks: {
                        [blogListBlock.id]: blogListBlock.data,
                        [blogTitleBlockId]: blogTitleBlock.blockData,
                    },
                    elements: {
                        ...blogTitleBlock.elements,
                    },
                    navigationItem: {
                        linkType: NAVIGATION_TYPE_PAGE,
                        subItems: [],
                    },
                });
            }

            dispatch('overwriteWebsiteData', {
                websiteData: siteDataWithBlogListAdded,
            });
            dispatch('updateCurrentPageId', existingPageId ? state.currentPageId : pageId);
            // Temporary reset undo/redo after page add/remove, to assure reliable data flow.
            dispatch('undoRedo/resetUndoRedo');

            if (existingPageId) {
                EventLogApi.logEvent({
                    eventName: 'builder.blog.insert_blog_list',
                });
                window.hj('identify', state.user.user.id, {
                    'builder.blog.insert_blog_list': true,
                });
            } else {
                EventLogApi.logEvent({
                    eventName: 'builder.blog.add_blog_page',
                });
            }
        },
        addEcommerceProductPages: ({
            state,
            dispatch,
            getters,
        }, {
            resetUndo = true
        } = {}) => {
            const locale = getters.defaultLocale;
            const {
                products
            } = state.ecommerce;
            const productPages = getters.ecommerceProductPages;
            let productAndPageIds = Object.keys(productPages).reduce((accumulator, key) => ({
                ...accumulator,
                [key]: productPages[key].productId,
            }), {});
            let siteData = patcher.clone(state.website);

            // loop through each product and check whether it has a page created already
            // if not, create site data with a new product page
            products.forEach((productData) => {
                if (Object.values(productAndPageIds).includes(productData.id)) {
                    const existingPageId = Object.keys(productAndPageIds).find((key) => productAndPageIds[key] === productData.id);

                    // if such page is already created, renew it's meta data
                    siteData.languages[locale].pages[existingPageId] = {
                        ...siteData.languages[locale].pages[existingPageId],
                        name: productData.title,
                        meta: {
                            ...siteData.languages[locale].pages[existingPageId].meta,
                            ogImageOrigin: 'other',
                            ogImagePath: productData.thumbnail,
                            ogImageAlt: productData.thumbnail ? productData.title : null,
                        },
                    };

                    productAndPageIds = omit(productAndPageIds, existingPageId);

                    return;
                }

                const {
                    siteDataWithProductPage
                } = addEcommerceProductPageTemplate({
                    siteData,
                    productData,
                    locale,
                });

                siteData = siteDataWithProductPage;
            });

            // remove pages of the products that do not exist anymore
            Object.keys(productAndPageIds).forEach((pageId) => {
                siteData = removePage({
                    siteData,
                    pageId,
                    locale,
                });
            });

            dispatch('overwriteWebsiteData', {
                websiteData: siteData,
            });

            if (resetUndo) {
                dispatch('undoRedo/resetUndoRedo');
            }
        },
        generateEcommercePages: ({
            state,
            getters,
            dispatch,
        }) => {
            const {
                products
            } = state.ecommerce;

            if (!getters.ecommerceShoppingCart) {
                dispatch('ecommerce/getSettings');
            }

            if (products.length) {
                dispatch('addEcommerceProductPages', {
                    resetUndo: false,
                });
            } else {
                Promise.allSettled([
                    dispatch('ecommerce/getVariantsQuantity'),
                    dispatch('ecommerce/getProducts', {
                        resetUndoForPageCreation: false,
                    }),
                ]);
            }
        },
        addEcommerceShoppingCart: ({
            state,
            dispatch,
        }, ecommerceShoppingCart) => {
            const websiteData = {
                ...state.website,
                ecommerceShoppingCart,
            };

            dispatch('overwriteWebsiteData', {
                websiteData,
            });
        },
        updateEcommerceProductPagesBlocks: ({
            state,
            commit,
            getters,
        }, blockData) => {
            const locale = state.currentLocale;
            const productPageBlockIds = Object.values(getters.ecommerceLocaleProductPages).flatMap((page) => page.blocks);
            const productBlocks = Object.keys(getters.siteBlocks).filter((key) => getters.siteBlocks[key].type === 'BlockEcommerceProduct' && productPageBlockIds.includes(key));

            productBlocks.forEach((blockId) => {
                const blockDataClone = patcher.clone(blockData);

                blockDataClone.product = {
                    ...state.website.languages[locale].blocks[blockId].product,
                };

                commit(SET_BLOCK_DATA, {
                    blockId,
                    locale,
                    blockValue: blockDataClone,
                });
            });
        },
        updateCurrentLocale: ({
            commit,
            dispatch,
        }, locale) => {
            commit(SET_CURRENT_LOCALE, locale);
            dispatch('updateCurrentPageId');
        },
        updateLanguages: ({
            commit
        }, languages) => commit(SET_WEBSITE_LANGUAGES, languages),
        updateDefaultLocale: ({
            commit,
            dispatch,
            getters,
            state,
        }, locale) => {
            const earlierDefaultLocale = getters.defaultLocale;

            commit('setWebsiteMeta', {
                key: 'defaultLocale',
                value: locale,
            });

            const {
                [locale]: defaultLocale,
                ...restLanguages
            } = getters.siteLanguages;

            // When you change default language in DrawerList, it is moved to top of the list
            const reorderedLanguages = {
                [locale]: {
                    ...defaultLocale,
                    isHidden: false, // Force the default language to be visible
                },
                ...restLanguages,
            };

            dispatch('updateLanguages', reorderedLanguages);

            if (getters['ecommerce/isStoreTypeZyro']) {
                // move all ecommerce pages and components in it to new default language
                let siteDataClone = patcher.clone(state.website);
                const earlierDefaultLocaleData = getters.siteLanguages[earlierDefaultLocale];
                const ecommercePages = Object.fromEntries(Object.entries(earlierDefaultLocaleData.pages).filter(([, value]) => value.type === 'ecommerce-product'));
                const ecommercePageBlockIds = Object.keys(ecommercePages).flatMap((pageId) => ecommercePages[pageId].blocks);
                const ecommercePageBlocks = Object.fromEntries(Object.entries(earlierDefaultLocaleData.blocks).filter(
                    ([key]) => ecommercePageBlockIds.includes(key),
                ));
                const ecommercePageElementIds = ecommercePageBlockIds.flatMap(
                    (blockId) => earlierDefaultLocaleData.blocks[blockId].components,
                ).filter((value) => value);
                const ecommercePageElements = Object.fromEntries(Object.entries(earlierDefaultLocaleData.elements).filter(
                    ([key]) => ecommercePageElementIds.includes(key),
                ));

                // remove ecommerce pages from earlier default locale
                Object.keys(ecommercePages).forEach((pageId) => {
                    siteDataClone = removePage({
                        siteData: siteDataClone,
                        pageId,
                        locale: earlierDefaultLocale,
                    });
                });

                // add ecommerce pages and their content to new default locale
                siteDataClone.languages[locale] = {
                    ...siteDataClone.languages[locale],
                    pages: {
                        ...siteDataClone.languages[locale].pages,
                        ...ecommercePages,
                    },
                    blocks: {
                        ...siteDataClone.languages[locale].blocks,
                        ...ecommercePageBlocks,
                    },
                    elements: {
                        ...siteDataClone.languages[locale].elements,
                        ...ecommercePageElements,
                    },
                };

                dispatch('overwriteWebsiteData', {
                    websiteData: {
                        ...siteDataClone,
                    },
                });
            }
        },
        removePage: ({
            state,
            dispatch,
        }, {
            pageId
        }) => {
            const locale = state.currentLocale;

            dispatch('unselectCurrentElement');
            dispatch('updateCurrentBlockId', null);

            const siteDataWithRemovedPage = removePage({
                siteData: state.website,
                pageId,
                locale,
            });

            dispatch('overwriteWebsiteData', {
                websiteData: siteDataWithRemovedPage,
            });
            dispatch('updateCurrentPageId');
            // Temporary reset undo/redo after page add/remove, to assure reliable data flow.
            dispatch('undoRedo/resetUndoRedo');
            dispatch('navigation/updateNavigationVisibility');
        },
        mergePageData: ({
            state,
            getters,
            commit,
            dispatch,
        }, {
            locale = state.currentLocale,
            pageId,
            pageData,
        }) => {
            try {
                commit(SET_PAGE_DATA, {
                    pageId,
                    locale,
                    pageValue: mergeObjects(getters.sitePages[pageId], pageData),
                });
            } catch (error) {
                dispatch(`${NOTIFICATIONS_NAMESPACE}/${NOTIFY}`, {
                    origin: 'mergePageData',
                    message: 'Error while updating page. Refresh editor and try again.',
                });
                Sentry.captureException(new Error('Error while updating page'));
                throw error;
            }
        },
        // #endregion
    },
};

export const store = createStore(storeConfig);