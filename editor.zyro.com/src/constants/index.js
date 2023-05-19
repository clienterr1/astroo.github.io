// STORE ENV-INDEPENDENT GLOBAL CONSTANTS HERE
import {
    PROPERTY_FONT_SIZE,
    PROPERTY_LINE_HEIGHT,
    PROPERTY_M_FONT_SIZE,
    PROPERTY_TEXT_DECORATION,
    PROPERTY_TEXT_TRANSFORM,
    TYPOGRAPHY_H1,
    TYPOGRAPHY_H2,
    TYPOGRAPHY_H3,
    TYPOGRAPHY_H4,
    TYPOGRAPHY_H5,
    TYPOGRAPHY_H6,
    TYPOGRAPHY_BODY_LARGE,
    TYPOGRAPHY_BODY,
    TYPOGRAPHY_BODY_SMALL,
    ELEMENT_GRID_BUTTON_PRIMARY,
    ELEMENT_GRID_BUTTON_SECONDARY,
    TYPOGRAPHY_NAV_LINK,
    PROPERTY_LETTER_SPACING,
    PROPERTY_FONT_FAMILY,
    PROPERTY_FONT_WEIGHT,
    PROPERTY_FONT_SECONDARY,
    PROPERTY_FONT_PRIMARY,
    FONT,
} from '@zyro-inc/site-modules/constants/globalStyles';

// eslint-disable-next-line no-underscore-dangle
export const _000_WEBHOST_REF = '000webhost';
export const HOSTINGER_REF = 'hostinger';

export const BUILDER_BRAND_HOSTINGER = 'hostinger';
export const BUILDER_BRAND_ZYRO = 'zyro';

export const GO_ROBOTS_EMAIL = 'gorobots01011+';
export const GO_ROBOTS_EMAIL_FREE_PUBLISH = 'gorobots01011+freepublish_';
export const ONBOARDING_INTRODUCTION_VIDEO_SRC = 'https://www.youtube.com/embed/lLk7ROW0B8k?start=0';
export const REFERRAL_PROGRAM_PRICE = '$20';
export const DEFAULT_BIGGEST_DISCOUNT_PERCENTAGE = '69';
export const SIDEBAR_WIDTH = 56;
export const EXPANDED_SIDEBAR_WIDTH = 240;
export const MULTISELECT_MINIMUM_SELECT_ITEMS_LENGTH = 1;
export const BLOG_POST_EXAMPLE_PAGE_COUNT = 4;

export const WWW_REDIRECT_PATHS = {
    HOME: 'home',
    SIGN_UP: 'signup',
    SIGN_IN: 'signin',
    DOMAINS: 'domains',
    SITES: 'sites',
    TEMPLATES: 'templates',
    NEW_TEMPLATE: 'new-template',
    PAYMENTS: 'payments',
    PRICING: 'pricing',
    SUBSCRIPTIONS: 'subscriptions',
    AI_HEATMAP: 'ai/heatmap',
    CLAIM_FREE_DOMAIN: 'my-domains/claim-free-domain',
    SINGLE_SITE_DASHBOARD: 'manage/home',
    SINGLE_SITE_DASHBOARD_DOMAIN: 'manage/domain',
    SINGLE_SITE_DASHBOARD_SUBSCRIPTION: 'manage/subscription',
    SINGLE_SITE_DASHBOARD_EMAIL: 'manage/email',
    CONSULTATION_PURCHASE: 'redirect-to-consultation-purchase',
};
export const HPANEL_REDIRECTS_PATHS = {
    DOMAINS: 'domains',
    ADD_DOMAIN: 'add-domain',
};
export const ECOMMERCE_REDIRECT_PATHS = {
    BOOKINGS: 'booking',
    CATEGORIES: 'categories',
    DISCOUNTS: 'discounts',
    ORDERS: 'orders',
    PRODUCTS: 'products',
    PRODUCTS_ADD: 'products/add',
    PRODUCTS_EDIT: 'products/edit',
    PAYMENT_MANAGEMENT: 'payment-management',
    STORE_SETTINGS: 'store-settings',
};
export const REDIRECT_PARAM_KEYS = {
    RETURN: 'return',
    PLAN: 'plan',
    LANG: 'lang',
    CODE: 'code',
    SITE_ID: 'siteId',
    DOMAIN_SEARCH: 'domainSearch',
    PLANS_TO_SHOW: 'plansToShow',
    SUBSCRIPTION_ID: 'subscriptionId',
    OPEN_INTERCOM: 'open-intercom',
    ACTIVATE_PLAN: 'activate-plan',
    PRODUCT: 'product',
    FLOW: 'flow',
    REDIRECT_URL: 'redirectUrl',
};
export const REDIRECT_PARAM_VALUES = {
    RETURN_BUILDER: 'builder',
    RETURN_PUBLISH: 'builder-publish',
    RETURN_STOREFRONT: 'builder-storefront',
    RETURN_DOMAIN_CONNECTION: 'builder-domain-connection',
    RETURN_DOMAIN_CONNECTED: 'builder-domain-connected',
    PLANS_TO_SHOW_BASIC_ECOMMERCE: 'basicEcommerce',
    PLANS_TO_SHOW_ECOMMERCE: 'ecommerce',
    PLANS_TO_SHOW_NON_ECOMMERCE: 'nonEcommerce',
    PLANS_TO_SHOW_ALL: 'all',
    PLANS_TO_SHOW_BUSINESS: 'business',
    FLOW_UPGRADE: 'FLOW_UPGRADE',
    FLOW_EXTEND: 'FLOW_EXTEND',
    RETURN_ECOMMERCE_ADMIN: 'ecommerce-admin',
    AI_BUILDER: 'ai-builder',
};
export const REDIRECT_TYPES = {
    ASSIGN: 'assign',
    REPLACE: 'replace',
};

export const QUICK_START_GUIDE_LOGO_STEP = 'logo';
export const QUICK_START_GUIDE_SEO_STEP = 'seo';
export const QUICK_START_GUIDE_INTEGRATIONS_STEP = 'integrations';
export const QUICK_START_GUIDE_PUBLISH_STEP = 'publish';
export const QUICK_START_GUIDE_DOMAIN_STEP = 'domain';
export const QUICK_START_GUIDE_EVENT_NAMES = {
    ENTER: 'website_builder.start_guide.enter',
    ENTER_CHANGE_LOGO: 'website_builder.start_guide.change_logo.enter',
    ENTER_GET_FOUND: 'website_builder.start_guide.get_found.enter',
    ENTER_PUBLISH_WEBSITE: 'website_builder.start_guide.publish_website.enter',
    STEP_COMPLETED: 'website_builder.start_guide.step_completed',
    GUIDE_COMPLETED: 'website_builder.start_guide.guide_completed',
};

export const ONBOARDING_STEP_INTRODUCTION = 'ONBOARDING_STEP_INTRODUCTION';
export const ONBOARDING_STEP_MULTI_PAGE_DRAWER = 'ONBOARDING_STEP_MULTI_PAGE_DRAWER';
export const ONBOARDING_STEP_ADD_ELEMENTS_DRAWER = 'ONBOARDING_STEP_ADD_ELEMENTS_DRAWER';
export const ONBOARDING_STEP_USER_STYLES_DRAWER = 'ONBOARDING_STEP_USER_STYLES_DRAWER';
export const ONBOARDING_STEP_MOBILE_VIEW = 'ONBOARDING_STEP_MOBILE_VIEW';
export const ONBOARDING_STEP_PUBLISH = 'ONBOARDING_STEP_PUBLISH';
export const ONBOARDING_STEP_RESTART_TOUR = 'ONBOARDING_STEP_RESTART_TOUR';
export const ONBOARDING_STEPS_STEP_COUNT_TO_SHOW = 5;
export const ONBOARDING_STEPS_SEO_INTRO = 'ONBOARDING_STEPS_SEO_INTRO';
export const ONBOARDING_STEPS_SEO_BRAND_NAME = 'ONBOARDING_STEPS_SEO_BRAND_NAME';
export const ONBOARDING_STEPS_SEO_LANGUAGE = 'ONBOARDING_STEPS_SEO_LANGUAGE';
export const ONBOARDING_STEPS_SEO_DESCRIPTION = 'ONBOARDING_STEPS_SEO_DESCRIPTION';
export const ONBOARDING_STEPS_SEO_BRAND_KEYWORDS = 'ONBOARDING_STEPS_SEO_BRAND_KEYWORDS';
export const ONBOARDING_STEPS_SEO_BRAND_REVIEW = 'ONBOARDING_STEPS_SEO_BRAND_REVIEW';
export const ONBOARDING_STEPS = [
    ONBOARDING_STEP_INTRODUCTION,
    ONBOARDING_STEP_MULTI_PAGE_DRAWER,
    ONBOARDING_STEP_ADD_ELEMENTS_DRAWER,
    ONBOARDING_STEP_USER_STYLES_DRAWER,
    ONBOARDING_STEP_MOBILE_VIEW,
    ONBOARDING_STEP_PUBLISH,
];
export const ONBOARDING_STEPS_SHORT_TOUR = [
    ONBOARDING_STEP_MULTI_PAGE_DRAWER,
    ONBOARDING_STEP_ADD_ELEMENTS_DRAWER,
    ONBOARDING_STEP_USER_STYLES_DRAWER,
    ONBOARDING_STEP_MOBILE_VIEW,
    ONBOARDING_STEP_PUBLISH,
];
export const ONBOARDING_STEPS_SEO = [
    ONBOARDING_STEPS_SEO_INTRO,
    ONBOARDING_STEPS_SEO_BRAND_NAME,
    ONBOARDING_STEPS_SEO_LANGUAGE,
    ONBOARDING_STEPS_SEO_DESCRIPTION,
    ONBOARDING_STEPS_SEO_BRAND_KEYWORDS,
    ONBOARDING_STEPS_SEO_BRAND_REVIEW,
];

// Cookies
export const COOKIE_ECOMM_PRODUCT_TO_EDIT = 'ecommProductToEdit';
export const COOKIE_PRODUCTS_PRICING_VALUES = 'pricingValues';
export const COOKIE_ZYRO_DEVICE_ID = 'zyroDeviceId';
export const COOKIE_ZYRO_SESSION_ID = 'zyroSessionId';
export const COOKIE_ZYRO_AUTH_ID = 'connect.sid';
export const COOKIE_QUICK_START_GUIDE_STARTED = 'quickStartGuideStarted';
export const COOKIE_KNOWLEDGE_BASE_NOTIFICATION_DISABLED = 'z-builder-knowledge-base-notification-disabled';
export const COOKIE_MANUAL_LOCALE = 'user_language';
export const COOKIE_HPANEL_REDIRECT = 'hpanel-redirect';
export const COOKIE_GEOIP_LOCALE = 'z-www-location-by-locale';
export const COOKIE_HOSTINGER_LANGUAGE = 'language';
export const COOKIE_SITE_ID = 'siteId';
export const COOKIE_IS_CLOUDFLARE_CAPTCHA_SOLVED = 'z-is-cf-captcha-solved';
export const COOKIE_EXPERIMENT_STATE = 'hostinger-experiment-state';
export const COOKIE_CHECK_MOBILE_BEFORE_PUBLISH = 'is-check-mobile-before-publish-popup-shown';
export const COOKIE_NPS_HIDDEN = 'z-cookie-nps-hidden';
export const COOKIE_NPS_HIDDEN_DURATION = 30;
export const COOKIE_IS_ASTRO_PUBLISH_ENABLED = 'is-astro-publish-enabled';
export const COOKIE_GOOGLE_ANALYTICS = '_ga';

// Local storage
export const LOCAL_STORAGE_KEY_ONBOARDING_COMPLETED = 'is-onboarding-completed';
export const LOCAL_STORAGE_KEY_AI_BUILDER_FREE_TRY_WEBSITES = 'ai-builder-free-try-websites';

export const SUBSCRIPTION_NAMES = {
    unleashed: 'siteSettings.websitePlanName',
    ecommerce: 'siteSettings.onlineStorePlanName',
    ecommerceplus: 'siteSettings.advancedStorePlanName',
    ecommercebasic: 'siteSettings.ecommerceBasicPlanName',
    basic: 'siteSettings.basicPlanName',
    business: 'siteSettings.businessPlanName',
};

export const SUBSCRIPTION_STATUS_CANCELLED = 'CANCELLED';
export const WEBSITE_PLAN_GROUP_BUSINESS = 'business';
export const WEBSITE_PLAN_GROUP_ECOMMERCE_PLUS = 'ecommerceplus';
export const SUBSCRIPTION_DURATION_ONE_MONTH = 1;
export const SUBSCRIPTION_DURATION_ONE_YEAR = 12;

// Experiments have to be synced together with hPanel.
// To do that, whatever new experiment is added here, it has to be added to hPanel as well:
// https://github.com/hostinger/hpanel-mf-shared/blob/4681a42b9d0279635b64bb6c5694bf1d45bb4ced/services/index/src/enums/ExperimentID.enum.ts
export const ENABLED_EXPERIMENT_IDS = {
    AI_BUILDER_SURVEY: 'AIBuilderSurvey',
};

export const AI_BUILDER_TEMPLATE_ID = 'aigenerated';
export const AI_BUILDER_DESCRIPTION_WORD_COUNT_BAD_QUALITY = 10;
export const AI_BUILDER_DESCRIPTION_WORD_COUNT_MEDIUM_QUALITY = 20;
export const AI_BUILDER_MAXIMUM_LOGO_CHARACTER_LENGTH = 20;
export const AI_BUILDER_LOGO_SIZE = 23;
export const AI_BUILDER_DEFAULT_LOGO_WIDTH = 55;
export const AI_BUILDER_DEFAULT_LOGO_HEIGHT = 24;
export const AI_BUILDER_TITLE_MAX_LENGTH = 100;
export const AI_BUILDER_DESCRIPTION_MAX_LENGTH = 700;
export const AI_BUILDER_EXAMPLE_BUSINESS_DESCRIPTION = `We serve our guests Italian wines and appetisers, served freshly on the terrace.
	The menu also includes freshly baked pasta, pasta recipes from our famous Italian suppliers.
	The food is served in a warm and friendly environment.`;
export const AI_BUILDER_FOOTER_BRAND_ELEMENT_ID = 'footer-brand-name';
export const AI_BUILDER_CATEGORY_ID_STORE = 'online-store';
export const AI_BUILDER_CATEGORY_ID_BLOG = 'blog';
export const AI_BUILDER_CATEGORY_ID_BUSINESS = 'business';
export const AI_BUILDER_CATEGORY_ID_PORTFOLIO = 'portfolio';
export const AI_BUILDER_CATEGORY_ID_OTHER = 'other';
export const AI_BUILDER_TEMPLATE_SECTION_TYPE_REGEXES = [
    'section\\d+$',
    'hero$',
    'about$',
    'slogan$',
    'portfolio$',
    'contact$',
    'delivery$',
    'refunds$',
    'gallery$',
    'reviews$',
];
export const AI_BUILDER_TEMPLATE_TYPE_DEFAULT = 'default';
export const AI_BUILDER_TEMPLATE_TYPE_PORTFOLIO = 'portfolio';
export const AI_BUILDER_TEMPLATE_TYPE_ONLINE_STORE = 'online-store';
export const AI_BUILDER_TEMPLATE_TYPE_BLOG = 'blog';

export const LEGAL_GENERATOR_COMPANY_NAME_KEY = '%{COMPANY_NAME}';
export const LEGAL_GENERATOR_WEBSITE_NAME_KEY = '%{WEBSITE_NAME}';
export const LEGAL_GENERATOR_COMPANY_ADDRESS_KEY = '%{COMPANY_ADDRESS}';
export const LEGAL_GENERATOR_WEBSITE_ADDRESS_KEY = '%{WEBSITE_ADDRESS}';
export const LEGAL_GENERATOR_EMAIL_ADDRESS_KEY = '%{EMAIL_ADDRESS}';

export const DATA_SELECTOR_ELEMENT_EDIT_TEXT = 'EDIT_TEXT';
export const DATA_SELECTOR_DRAWER = 'DRAWER';
export const DATA_SELECTOR_POPUP = 'POPUP';
export const DATA_SELECTOR_HEATMAP = 'HEATMAP';
export const DATA_SELECTOR_IMAGE_PROVIDER = 'IMAGE_PROVIDER';
export const DATA_SELECTOR_BUILDER_PREVIEW = 'BUILDER_PREVIEW';
export const DATA_SELECTOR_QUICK_START_GUIDE = 'QUICK_START_GUIDE';

export const GAMIFICATION_DISCOUNT_CODE = 'GOLIVE10';
export const GAMIFICATION_VISIBILITY_TIMESTAMP = '1682899200'; // 2023-05-01 00:00:00 UTC

export const GAMIFICATION_TASK_START = 'start_journey';
export const GAMIFICATION_TASK_CHANGE_HEADING = 'edit_heading';
export const GAMIFICATION_TASK_UPDATE_IMAGE = 'update_image';
export const GAMIFICATION_TASK_CHANGE_PARAGRAPH = 'edit_paragraph';
export const GAMIFICATION_TASK_CHANGE_LOGO = 'add_logo';
export const GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS = 'update_social_icons';
export const GAMIFICATION_TASK_CHECK_MOBILE_VIEW = 'check_mobile_view';
export const GAMIFICATION_TASK_CHANGE_SEO = 'found_google';
export const GAMIFICATION_TASK_GO_LIVE = 'go_live';
export const GAMIFICATION_EVENT_NAMES = {
    ENTER: 'website_builder.gamefication.enter',
    COMPLETED: 'website_builder.gamefication.completed',
    RATED: 'website_builder.gamefication.rated',
    TASK_ENTER: {
        [GAMIFICATION_TASK_START]: 'website_builder.game_start.enter',
        [GAMIFICATION_TASK_CHANGE_HEADING]: 'website_builder.game_edit_heading.enter',
        [GAMIFICATION_TASK_UPDATE_IMAGE]: 'website_builder.game_update_image.enter',
        [GAMIFICATION_TASK_CHANGE_PARAGRAPH]: 'website_builder.game_edit_paragraph_text.enter',
        [GAMIFICATION_TASK_CHANGE_LOGO]: 'website_builder.game_add_your_own_log.enter',
        [GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS]: 'website_builder.game_update_social_media.enter',
        [GAMIFICATION_TASK_CHECK_MOBILE_VIEW]: 'website_builder.game_check_your_mobile.enter',
        [GAMIFICATION_TASK_CHANGE_SEO]: 'website_builder.game_get_found_on_google.enter',
        [GAMIFICATION_TASK_GO_LIVE]: 'website_builder.game_go_live.enter',
    },
    TASK_COMPLETED: {
        [GAMIFICATION_TASK_START]: 'website_builder.game_start.completed',
        [GAMIFICATION_TASK_CHANGE_HEADING]: 'website_builder.game_edit_heading.completed',
        [GAMIFICATION_TASK_UPDATE_IMAGE]: 'website_builder.game_update_image.completed',
        [GAMIFICATION_TASK_CHANGE_PARAGRAPH]: 'website_builder.game_edit_paragraph_text.completed',
        [GAMIFICATION_TASK_CHANGE_LOGO]: 'website_builder.game_add_your_own_log.completed',
        [GAMIFICATION_TASK_CHANGE_SOCIAL_ICONS]: 'website_builder.game_update_social_media.completed',
        [GAMIFICATION_TASK_CHECK_MOBILE_VIEW]: 'website_builder.game_check_your_mobile.completed',
        [GAMIFICATION_TASK_CHANGE_SEO]: 'website_builder.game_get_found_on_google.completed',
        [GAMIFICATION_TASK_GO_LIVE]: 'website_builder.game_go_live.completed',
    },
};

export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_GENERAL = 'general';
export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_INTEGRATIONS = 'integrations';
export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_ANALYTICS = 'analytics';
export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_SEO = 'seo';
export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_FORMS = 'forms';
export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_ASSETS = 'assets';
export const SIDEBAR_SETTINGS_POPUP_ITEM_ID_EXPORT = 'export';

export const MODAL_USER_TYPOGRAPHY_STYLES_RESET = 'UserTypographyStylesResetModal';
export const MODAL_ADD_ECWID_BLOCK = 'AddEcwidBlockModal';
export const MODAL_USER_TYPOGRAPHY_RESET_ALL_CHANGES = 'UserTypographyResetAllChangesModal';
export const MODAL_DEFAULT_NOTIFICATION = 'DefaultNotificationModal';
export const MODAL_PUBLISH_ERROR = 'PublishErrorModal';
export const MODAL_DOMAIN_CONNECTION = 'DomainConnectionModal';
export const MODAL_ADD_BLOCK = 'AddBlockModal';
export const MODAL_ADD_PAGE = 'AddPageModal';
export const MODAL_BLOG_POST_SETTINGS = 'BlogPostSettingsModal';
export const MODAL_LINK_SETTINGS = 'LinkSettingsModal';
export const MODAL_PAGE_SETTINGS = 'PageSettingsModal';
export const MODAL_BLOG_SETTINGS = 'BlogSettingsModal';
export const MODAL_ADD_LINK = 'AddLinkModal';
export const MODAL_SUBSCRIPTION_EXPIRED = 'SubscriptionExpiredModal';
export const MODAL_PUBLISH = 'PublishModal';
export const MODAL_BEFORE_PUBLISH = 'BeforePublishModal';
export const MODAL_PUBLISHED = 'PublishedModal';
export const MODAL_CONNECT_SUBSCRIPTION = 'ConnectSubscriptionModal';
export const MODAL_ASSET_MANAGER = 'AssetManager';
export const MODAL_CHOOSE_BLOCK_PLACEMENT = 'ChooseBlockPlacementModal';
export const MODAL_PUBLISHED_ROOT = 'PublishedModalRoot';
export const MODAL_PUBLISHED_UPDATE_SECTION = 'PublishedModalUpdateSection';
export const MODAL_PUBLISH_OPTION = 'PublishModalOption';
export const MODAL_SYSTEM_DIALOG = 'SystemDialogModal';
export const MODAL_UNSAVED_CHANGES = 'UnsavedChangesModal';
export const MODAL_ECOMMERCE_UPGRADE_PLAN = 'UpgradePlanEcommerce';
export const MODAL_DEFAULT = 'DefaultModal';
export const MODAL_BUSINESS_SUBSCRIPTION = 'BusinessSubscriptionModal';
export const MODAL_ACTIVE_SUBSCRIPTION = 'ActiveSubscriptionModal';
export const MODAL_LEGAL_CONTENT_GENERATOR = 'LegalContentGeneratorModal';
export const MODAL_GAMIFICATION_WELCOME = 'GamificationWelcomeModal';
export const MODAL_EDIT_ONLINE_STORE = 'EditOnlineStoreModal';

export const BLOCK_CATEGORY_BLOG = 'blog-page';
export const BLOCK_CATEGORY_ECWID = 'online-store';
export const BLOCK_CATEGORY_LITE_STORE = 'lite-store';
export const BLOCK_CATEGORY_FOOTER = 'footer-page';
export const BLOCK_CATEGORY_ABOUT = 'about-page';
export const BLOCK_CATEGORY_PRIVACY_POLICY = 'privacy-policy';
export const BLOCK_CATEGORY_REFUND_POLICY = 'refund-policy';
export const BLOCK_CATEGORY_TERMS_AND_CONDITIONS = 'terms-and-conditions';

export const PAGE_TYPE_BLOG = 'blog';
export const PAGE_TYPE_ONLINE_STORE = 'online-store';
export const PAGE_TYPE_ABOUT = 'about';
export const PAGE_TYPE_CONTACT = 'contact';
export const PAGE_TYPE_PROJECTS = 'projects';
export const PAGE_TYPE_SERVICES = 'services';
export const PAGE_TYPE_PRIVACY_POLICY = 'privacy-policy';
export const PAGE_TYPE_REFUND_POLICY = 'refund-policy';
export const PAGE_TYPE_TERMS_AND_CONDITIONS = 'terms-and-conditions';
export const PAGE_TYPE_PORTFOLIO = 'portfolio';
export const PAGE_TYPE_APPOINTMENTS = 'appointments';

export const LEGAL_CONTENT_BLOCKS = [
    BLOCK_CATEGORY_PRIVACY_POLICY,
    BLOCK_CATEGORY_REFUND_POLICY,
    BLOCK_CATEGORY_TERMS_AND_CONDITIONS,
];
export const LEGAL_CONTENT_PAGES = [
    PAGE_TYPE_PRIVACY_POLICY,
    PAGE_TYPE_REFUND_POLICY,
    PAGE_TYPE_TERMS_AND_CONDITIONS,
];

export const ADD_CONTENT_MODAL_MASONRY_GUTTER_DESKTOP = 20;
export const ADD_CONTENT_MODAL_MASONRY_GUTTER_MOBILE = 0;
export const ADD_CONTENT_MODAL_MASONRY_COLUMN_COUNT_DESKTOP = 2;
export const ADD_CONTENT_MODAL_MASONRY_COLUMN_COUNT_MOBILE = 1;

export const TIME_DENOMINATOR_MINUTE = 60 * 1000;
export const TIME_DENOMINATOR_HOUR = 60 * 60 * 1000;
export const TIME_DENOMINATOR_DAY = 24 * 60 * 60 * 1000;

const TYPOGRAPHY_DEFAULT_STYLES_HEADING = {
    [PROPERTY_LINE_HEIGHT]: '1.3em',
    [PROPERTY_LETTER_SPACING]: 0,
    [PROPERTY_TEXT_TRANSFORM]: 'none',
    [PROPERTY_TEXT_DECORATION]: 'none',
};
const TYPOGRAPHY_DEFAULT_STYLES_PARAGRAPH = {
    ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    [PROPERTY_LINE_HEIGHT]: '1.5em',
};
const TYPOGRAPHY_LINK_BUTTON_DEFAULT_STYLE = {
    [PROPERTY_FONT_SIZE]: '16px',
    [PROPERTY_M_FONT_SIZE]: '16px',
    ...TYPOGRAPHY_DEFAULT_STYLES_PARAGRAPH,
};

export const TYPOGRAPHY_DEFAULT_STYLES_TEXT = {
    [TYPOGRAPHY_H1]: {
        [PROPERTY_FONT_SIZE]: '64px',
        [PROPERTY_M_FONT_SIZE]: '40px',
        ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    },
    [TYPOGRAPHY_H2]: {
        [PROPERTY_FONT_SIZE]: '56px',
        [PROPERTY_M_FONT_SIZE]: '36px',
        ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    },
    [TYPOGRAPHY_H3]: {
        [PROPERTY_FONT_SIZE]: '48px',
        [PROPERTY_M_FONT_SIZE]: '32px',
        ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    },
    [TYPOGRAPHY_H4]: {
        [PROPERTY_FONT_SIZE]: '40px',
        [PROPERTY_M_FONT_SIZE]: '24px',
        ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    },
    [TYPOGRAPHY_H5]: {
        [PROPERTY_FONT_SIZE]: '32px',
        [PROPERTY_M_FONT_SIZE]: '24px',
        ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    },
    [TYPOGRAPHY_H6]: {
        [PROPERTY_FONT_SIZE]: '24px',
        [PROPERTY_M_FONT_SIZE]: '20px',
        ...TYPOGRAPHY_DEFAULT_STYLES_HEADING,
    },
    [TYPOGRAPHY_BODY_LARGE]: {
        [PROPERTY_FONT_SIZE]: '18px',
        [PROPERTY_M_FONT_SIZE]: '18px',
        ...TYPOGRAPHY_DEFAULT_STYLES_PARAGRAPH,
    },
    [TYPOGRAPHY_BODY]: {
        [PROPERTY_FONT_SIZE]: '16px',
        [PROPERTY_M_FONT_SIZE]: '16px',
        ...TYPOGRAPHY_DEFAULT_STYLES_PARAGRAPH,
    },
    [TYPOGRAPHY_BODY_SMALL]: {
        [PROPERTY_FONT_SIZE]: '14px',
        [PROPERTY_M_FONT_SIZE]: '14px',
        ...TYPOGRAPHY_DEFAULT_STYLES_PARAGRAPH,
    },
    [TYPOGRAPHY_NAV_LINK]: {
        ...TYPOGRAPHY_LINK_BUTTON_DEFAULT_STYLE,
    },
    [ELEMENT_GRID_BUTTON_PRIMARY]: {
        ...TYPOGRAPHY_LINK_BUTTON_DEFAULT_STYLE,
    },
    [ELEMENT_GRID_BUTTON_SECONDARY]: {
        ...TYPOGRAPHY_LINK_BUTTON_DEFAULT_STYLE,
    },
};
export const TYPOGRAPHY_STYLE_ELEMENTS = [
    TYPOGRAPHY_H1,
    TYPOGRAPHY_H2,
    TYPOGRAPHY_H3,
    TYPOGRAPHY_H4,
    TYPOGRAPHY_H5,
    TYPOGRAPHY_H6,
    TYPOGRAPHY_BODY_SMALL,
    TYPOGRAPHY_BODY,
    TYPOGRAPHY_BODY_LARGE,
    TYPOGRAPHY_NAV_LINK,
    FONT,
    ELEMENT_GRID_BUTTON_PRIMARY,
    ELEMENT_GRID_BUTTON_SECONDARY,
];
export const TYPOGRAPHY_STYLE_REQUIRED_PROPERTIES = [
    PROPERTY_FONT_FAMILY,
    PROPERTY_LETTER_SPACING,
    PROPERTY_LINE_HEIGHT,
    PROPERTY_FONT_SIZE,
    PROPERTY_M_FONT_SIZE,
    PROPERTY_TEXT_TRANSFORM,
    PROPERTY_FONT_WEIGHT,
    PROPERTY_TEXT_DECORATION,
    PROPERTY_FONT_PRIMARY,
    PROPERTY_FONT_SECONDARY,
];

export const NAVIGATION_TYPE_LINK = 'Link';
export const NAVIGATION_TYPE_PAGE = 'Page';
export const NAVIGATION_TYPE_FOLDER = 'Folder';
export const NAVIGATION_TYPE_HOMEPAGE = 'Homepage';
export const NAVIGATION_GROUP_ROOT = 'ROOT';
export const NAVIGATION_GROUP_HIDDEN = 'HIDDEN';
export const NAVIGATION_ICONS = {
    [NAVIGATION_TYPE_LINK]: {
        icon: 'link',
    },
    [NAVIGATION_TYPE_PAGE]: {
        icon: 'page',
    },
    [NAVIGATION_TYPE_FOLDER]: {
        icon: 'dropdown',
    },
    [NAVIGATION_TYPE_HOMEPAGE]: {
        icon: 'home',
    },
};

export const TEXT_EDITOR_NODE_NAME_PARAGRAPH = 'paragraph';
export const TEXT_EDITOR_NODE_NAME_HEADING = 'heading';
export const TEXT_EDITOR_PROPERTY_TEXT_STYLE = 'textStyle';
export const TEXT_EDITOR_PROPERTY_LIST_ITEM = 'listItem';
export const TEXT_EDITOR_PROPERTY_COLOR_MARK = 'color';
export const TEXT_EDITOR_PROPERTY_LETTERCASE_MARK = 'letterCase';
export const TEXT_EDITOR_PROPERTY_LINK_MARK = 'link';
export const TEXT_EDITOR_LEVELS_HEADING = [
    1,
    2,
    3,
    4,
    5,
    6,
];
export const TEXT_EDITOR_CLASS_BODY_LARGE = 'body-large';
export const TEXT_EDITOR_CLASS_BODY = 'body';
export const TEXT_EDITOR_CLASS_SMALL = 'body-small';
export const TEXT_EDITOR_TEXT_TYPES_PARAGRAPH = [{
        type: TEXT_EDITOR_CLASS_BODY_LARGE,
        level: '1',
    },
    {
        type: TEXT_EDITOR_CLASS_BODY,
        level: '2',
    },
    {
        type: TEXT_EDITOR_CLASS_SMALL,
        level: '3',
    },
];
export const TEXT_EDITOR_SUPPORTED_PARAGRAPH_CLASSES = [
    TEXT_EDITOR_CLASS_BODY_LARGE,
    TEXT_EDITOR_CLASS_BODY,
    TEXT_EDITOR_CLASS_SMALL,
];
export const TEXT_EDITOR_TAG_PARAGRAPH = 'p';
export const TEXT_EDITOR_DATA_ATTRIBUTE_LINKED_PAGE_ID = 'data-page-id';
export const TEXT_EDITOR_FONT_WEIGHT_BOLD = 700;
export const TEXT_EDITOR_FONT_WEIGHT_REGULAR = 400;

export const LAYOUT_SNAP_THRESHOLD_X = 8;
export const LAYOUT_SNAP_THRESHOLD_Y = 8;
export const LAYOUT_SNAP_TYPES = {
    ELEMENT_EDGE: 'elementEdge',
    ELEMENT_CENTER: 'elementCenter',
    COLUMN: 'column',
    ROW: 'row',
    BLOCK_CENTER: 'blockCenter',
};
// Used to leave additional space until last element
// Without it, while resizing block overlaps elements outline
export const LAYOUT_MIN_HEIGHT_THRESHOLD = 1;
export const LAYOUT_MIN_SECTION_HEIGHT = 10;

// Randomly high number, Not really needed, but used to simplify resizing
export const LAYOUT_ELEMENT_MAX_HEIGHT = 50000;
export const LAYOUT_ELEMENT_RESIZE_DIRECTIONS = [
    'top',
    'right',
    'bottom',
    'left',
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
];
export const LAYOUT_ELEMENT_MINIMUM_WIDTHS = {
    GridGallery: 80,
    GridInstagramFeed: 80,
    GridForm: 80,
};
export const LAYOUT_ELEMENT_DEFAULT_MIN_WIDTH = 10;
export const LAYOUT_ELEMENT_DEFAULT_MIN_HEIGHT = 10;
export const LAYOUT_ELEMENT_DEFAULT_MOBILE_HEIGHT = 200;
export const LAYOUT_BLOCK_WIDTH_DESKTOP = 1224;
export const LAYOUT_ELEMENT_SELECTOR_CURRENT_ELEMENT = 'current-element';

// Grid
export const GRID_ELEMENT_TYPE_TRANSLATION = {
    GridTextBox: 'common.text',
    GridImage: 'common.image',
    GridGallery: 'common.gallery',
    GridVideo: 'common.video',
    GridSocialIcons: 'common.socialIcons',
    GridMap: 'common.map',
    GridForm: 'common.form',
    GridButton: 'common.button',
    GridStripeButton: 'common.stripeCheckout',
    GridEcommerceButton: 'builder.ecommerceAddToBagButton',
    GridInstagramFeed: 'common.instagramFeed',
    GridEmbed: 'common.embedCode',
    GridShape: 'common.shape',
};

export const STRIPE_PUBLIC_KEY_REGEX = /^pk_(?:live|test)_\w{99}$/;
export const STRIPE_PRICE_ID_REGEX = /^price_\w{24}$/;

export const CONTROL_LINE_SCROLL_START_THRESHOLD = 100;
export const CONTROL_LINE_SCROLL_AMOUNT = 5;
export const CONTROL_LINE_SCROLL_INTERVAL_DELAY = 10;

export const INTEGRATION_KEY_CUSTOM_META = 'customMeta';
export const INTEGRATION_KEY_CUSTOM_HEAD_ELEMENTS = 'customHeadElements';
export const INTEGRATION_KEY_CUSTOM_BODY_ELEMENTS = 'customBodyElements';
export const INTEGRATION_KEY_FACEBOOK_MESSENGER = 'facebookMessenger';
export const INTEGRATION_KEY_FACEBOOK_PIXEL = 'facebookPixel';
export const INTEGRATION_KEY_GOOGLE_AD_SENSE = 'googleAdSense';
export const INTEGRATION_KEY_GOOGLE_AD_MOB = 'googleAdMob';
export const INTEGRATION_KEY_GOOGLE_ANALYTICS = 'googleAnalytics';
export const INTEGRATION_KEY_GOOGLE_TAG_MANAGER = 'googleTagManager';
export const INTEGRATION_KEY_HOTJAR = 'hotjar';
export const INTEGRATION_KEY_WHATS_APP = 'whatsAppNumber';

export const DOMAIN_STEP_DOMAIN_CONNECTION_OPTIONS = 'DomainConnectionOptions';
export const DOMAIN_STEP_SELECT_DOMAIN_PROVIDER = 'SelectDomainProviderStep';
export const DOMAIN_STEP_VERIFICATION_MODAL = 'VerificationModalStep';
export const DOMAIN_STEP_PROVIDER_INFORMATION = 'ProviderInformationStep';
export const DOMAIN_STEP_NAMESERVERS_SETTINGS = 'NameserversSettingsStep';

export const DNS_ZYRO_1 = 'dns1.zyro.com';
export const DNS_ZYRO_2 = 'dns2.zyro.com';
export const DNS_HOSTINGER_1 = 'ns1.dns-parking.com';
export const DNS_HOSTINGER_2 = 'ns2.dns-parking.com';

export const DOMAIN_OPTION_THIRD_PARTY = 'THIRD_PARTY_DOMAIN_OPTION';
export const DOMAIN_OPTION_FREE = 'FREE_DOMAIN_OPTION';
export const DOMAIN_OPTION_ZYRO = 'ZYRO_DOMAIN_OPTION';
export const DOMAIN_OPTION_BUY = 'BUY_DOMAIN_OPTION';

// https://docs.google.com/spreadsheets/d/1CBZ3kHGh1XGY_duIkQEaeGVnI5gE3_Fx47H2JE7GRfE/edit#gid=0
const DOMAIN_PROVIDER_HOSTINGER = {
    providerName: 'Hostinger',
    url: 'https://www.hostinger.com/',
    instructionsUrl: 'https://support.zyro.com/articles/6083734-use-your-hostinger-domain-at-zyro',
};

const DOMAIN_PROVIDER_NAMECHEAP = {
    providerName: 'Namecheap',
    url: 'https://www.namecheap.com/',
    instructionsUrl: 'https://support.zyro.com/articles/6083755-use-your-namecheap-domain-at-zyro',
};

const DOMAIN_PROVIDER_GODADDY = {
    providerName: 'GoDaddy',
    url: 'https://dcc.godaddy.com/',
    instructionsUrl: 'https://support.zyro.com/articles/5861264-use-your-godaddy-domain-at-zyro',
};

const DOMAIN_PROVIDER_CRAZYDOMAINS = {
    providerName: 'CrazyDomains',
    url: 'https://www.crazydomains.com.au/',
    instructionsUrl: 'https://support.zyro.com/articles/6083795-use-your-domain-from-crazy-domains',
};

const DOMAIN_PROVIDER_NAMECOM = {
    providerName: 'Name.com',
    url: 'https://www.name.com/',
    instructionsUrl: 'https://support.zyro.com/articles/6083839-use-your-name-com-domain-at-zyro',
};

const DOMAIN_PROVIDER_IV = {
    providerName: 'Interneto vizija',
    url: 'https://klientams.iv.lt/',
    instructionsUrl: 'https://support.zyro.com/lt/articles/6075498-prijunk-interneto-vizijos-domena',
};

const DOMAIN_PROVIDER_OPENPROVIDER = {
    providerName: 'Openprovider',
    url: 'https://cp.openprovider.eu/',
    instructionsUrl: 'https://support.zyro.com/articles/6083889-use-your-openprovider-domain-at-zyro',
};

const DOMAIN_PROVIDER_TUCOWS_DOMAINS = {
    providerName: 'Tucows Domains',
    url: 'https://tucowsdomains.com/',
    instructionsUrl: 'https://support.zyro.com/articles/6083669-use-your-tucows-domain-at-zyro',
};

const DOMAIN_PROVIDER_GOOGLE_DOMAINS = {
    providerName: 'Google Domains',
    url: 'https://domains.google/',
    instructionsUrl: 'https://support.zyro.com/articles/6056179-use-your-google-domain-at-zyro',
};

const DOMAIN_PROVIDER_SQUARESPACE = {
    providerName: 'Squarespace',
    url: 'https://www.squarespace.com/',
    instructionsUrl: 'https://support.zyro.com/articles/6084203-use-your-squarespace-domain-at-zyro',
};

const DOMAIN_PROVIDER_WIX = {
    providerName: 'Wix',
    url: 'https://www.wix.com/',
    instructionsUrl: 'https://support.zyro.com/articles/5676715-use-your-wix-domain-at-zyro',
};

export const DOMAIN_PROVIDER_OTHER = {
    providerName: 'Other',
    providerNameI18nKeyPath: 'siteSettings.domain.domainConnectionModal.otherProvider',
    instructionsUrl: 'https://support.zyro.com/articles/4237563-how-to-connect-a-domain-to-your-website#h_2f3fb2ae43',
};

export const ALL_PROVIDERS = [
    DOMAIN_PROVIDER_HOSTINGER,
    DOMAIN_PROVIDER_NAMECHEAP,
    DOMAIN_PROVIDER_GODADDY,
    DOMAIN_PROVIDER_CRAZYDOMAINS,
    DOMAIN_PROVIDER_NAMECOM,
    DOMAIN_PROVIDER_IV,
    DOMAIN_PROVIDER_OPENPROVIDER,
    DOMAIN_PROVIDER_TUCOWS_DOMAINS,
    DOMAIN_PROVIDER_GOOGLE_DOMAINS,
    DOMAIN_PROVIDER_SQUARESPACE,
    DOMAIN_PROVIDER_WIX,
    DOMAIN_PROVIDER_OTHER,
];

export const WHOIS_PROVIDER_INFORMATION = {
    'https://www.hostinger.com': DOMAIN_PROVIDER_HOSTINGER,
    'WWW.ENOM.COM': DOMAIN_PROVIDER_NAMECHEAP,
    'http://www.godaddy.com': DOMAIN_PROVIDER_GODADDY,
    'http://www.crazydomains.com': DOMAIN_PROVIDER_CRAZYDOMAINS,
    'http://www.name.com': DOMAIN_PROVIDER_NAMECOM,
    'https://www.iv.lt/': DOMAIN_PROVIDER_IV,
    'http://www.registrar.eu': DOMAIN_PROVIDER_OPENPROVIDER,
    'www.opensrs.com': DOMAIN_PROVIDER_TUCOWS_DOMAINS,
};

// https://www.iana.org/assignments/registrar-ids/registrar-ids.xhtml
export const RDAP_PROVIDER_INFORMATION = {
    1636: DOMAIN_PROVIDER_HOSTINGER,
    1068: DOMAIN_PROVIDER_NAMECHEAP,
    146: DOMAIN_PROVIDER_GODADDY,
    1291: DOMAIN_PROVIDER_CRAZYDOMAINS,
    625: DOMAIN_PROVIDER_NAMECOM,
    1647: DOMAIN_PROVIDER_OPENPROVIDER,
    69: DOMAIN_PROVIDER_TUCOWS_DOMAINS,
    895: DOMAIN_PROVIDER_GOOGLE_DOMAINS,
    3827: DOMAIN_PROVIDER_SQUARESPACE,
    3817: DOMAIN_PROVIDER_WIX,
};

export const BUTTON_PROPERTY_SIZE_SMALL = 'small';
export const BUTTON_PROPERTY_SIZE_MEDIUM = 'medium';
export const BUTTON_PROPERTY_SIZE_LARGE = 'large';

export const DRAWER_USER_STYLES = 'UserStylesDrawer';
export const DRAWER_GLOBAL_STYLES = 'GlobalStylesDrawer';
export const DRAWER_BLOG = 'BlogDrawer';
export const DRAWER_MULTI_PAGE = 'MultiPageDrawer';
export const DRAWER_MULTILINGUAL = 'MultilingualDrawer';
export const DRAWER_ADD_ELEMENT = 'AddElementDrawer';
export const DRAWER_ADD_ONLINE_STORE = 'ChooseStoreDrawer';
export const DRAWER_MANAGE_STORE = 'ManageStoreDrawer';
export const DRAWER_AI_WRITER = 'AiWriterDrawer';
export const DRAWER_HELP_AND_RESOURCES = 'HelpAndResourcesDrawer';
export const DRAWER_GAMIFICATION = 'GamificationDrawer';
export const DRAWER_PAGE_SEO = 'DrawerPageSeo';

export const DRAWER_GLOBAL_STYLES_TAB_ID_TYPOGRAPHY = 'Typography';
export const DRAWER_GLOBAL_STYLES_TAB_ID_ELEMENTS = 'Elements';
export const DRAWER_GLOBAL_STYLES_TABS = [{
        id: DRAWER_GLOBAL_STYLES_TAB_ID_TYPOGRAPHY,
        title: 'Typography',
    },
    {
        id: DRAWER_GLOBAL_STYLES_TAB_ID_ELEMENTS,
        title: 'Elements',
    },
];
export const DRAWER_STYLES_TAB_ID_COLORS = 'GlobalColorsLibrary';
export const DRAWER_STYLES_TAB_ID_TYPOGRAPHY = 'TypographyStyleList';
export const DRAWER_STYLES_TAB_ID_BUTTON_SETS = 'ButtonSetsLibrary';
export const DRAWER_STYLES_TAB_ID_ANIMATIONS = 'AnimationsLibrary';

export const USER_STYLES_MAIN_PAGE_KEY = 'main-page';
export const USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY = 'typography-category-select';
export const USER_STYLES_SELECT_KEY_HEADING = 'heading-select';
export const USER_STYLES_SELECT_KEY_PARAGRAPH = 'paragraph-select';

const USER_STYLES_DRAWER_PAGES = {
    [USER_STYLES_MAIN_PAGE_KEY]: {
        component: 'UserStyles',
        title18nPath: 'builder.userStyles.title',
    },
    [USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY]: {
        component: 'TypographyCategorySelect',
        title18nPath: 'builder.userStyles.typography.textStyles',
        subtext18nPath: 'builder.userStyles.typography.textStylesSub',
    },
    [USER_STYLES_SELECT_KEY_HEADING]: {
        component: 'TypographyTypeSelect',
        title18nPath: 'builder.userStyles.typography.headings',
        subtext18nPath: 'builder.userStyles.typography.headingsSubtext',
        fontType: 'primary',
        previousPage: USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY,
        options: {
            currentTypographyType: null,
        },
    },
    [USER_STYLES_SELECT_KEY_PARAGRAPH]: {
        component: 'TypographyTypeSelect',
        title18nPath: 'builder.userStyles.typography.paragraphsAndNavigation',
        subtext18nPath: 'builder.userStyles.typography.paragraphSubtext',
        fontType: 'secondary',
        previousPage: USER_STYLES_SELECT_KEY_TYPOGRAPHY_CATEGORY,
        options: {
            currentTypographyType: null,
        },
    },
};

export const DRAWER_PAGES = {
    [DRAWER_USER_STYLES]: USER_STYLES_DRAWER_PAGES,
};
export const DRAWER_PAGES_DEFAULT_STATE = {
    [DRAWER_USER_STYLES]: DRAWER_PAGES[DRAWER_USER_STYLES][USER_STYLES_MAIN_PAGE_KEY],
};

export const NPS_MAX_DAYS_AFTER_LAST_SCORE = 30;
export const NPS_TYPE_DEFAULT = 'default';
export const NPS_TYPE_DEFAULT_AI_BUILDER = 'ai-builder-default';
export const NPS_TYPE_AI_BUILDER = 'ai-builder';
export const NPS_TYPE_AI_ASSIST = 'ai-assist';
export const NPS_TYPE_FEATURE_BUTTON = 'element-button';
export const NPS_TYPE_FEATURE_FORM = 'element-form';
export const NPS_TYPE_FEATURE_EMBED_CODE = 'element-embed-code';
export const NPS_TYPE_FEATURE_GALLERY = 'element-gallery';
export const NPS_TYPE_FEATURE_IMAGE = 'element-image';
export const NPS_TYPE_FEATURE_INSTAGRAM_FEED = 'element-instagram-feed';
export const NPS_TYPE_FEATURE_MAP = 'element-map';
export const NPS_TYPE_FEATURE_SIMPLE_STORE = 'element-simple-store';
export const NPS_TYPE_FEATURE_SOCIAL_ICONS = 'element-social-icons';
export const NPS_TYPE_FEATURE_VIDEO = 'element-video';
export const NPS_TYPE_FEATURE_TEXT = 'element-text';
export const NPS_TYPE_FEATURE_GLOBAL_STYLES_ANIMATION = 'global-styles-animation';
export const NPS_TYPE_FEATURE_GLOBAL_STYLES_BUTTONS = 'global-styles-buttons';
export const NPS_TYPE_FEATURE_GLOBAL_STYLES_COLORS = 'global-styles-colors';
export const NPS_TYPE_FEATURE_GLOBAL_STYLES_TEXT = 'global-styles-text';
export const NPS_TYPE_FEATURE_MULTILINGUAL = 'multi-language';
export const NPS_TYPE_FEATURE_SEO = 'seo-drawer';
export const NPS_TYPE_FEATURE_LAYOUT = 'block-layout';
export const NPS_TYPE_FEATURE_MOBILE_LAYOUT = 'mobile-block-layout';
export const NPS_TYPE_FEATURE_SHAPE = 'element-shape';
export const NPS_TYPE_FEATURE_SEARCH = 'builder-search';
export const NPS_TYPE_FEATURE_GAMIFICATION = 'builder-gamification';

export const NPS_DATA_DEFAULT = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_DEFAULT,
};
export const NPS_DATA_FEATURE_BUTTON = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_BUTTON,
};
export const NPS_DATA_FEATURE_EMBED_CODE = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_EMBED_CODE,
};
export const NPS_DATA_FEATURE_GALLERY = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_GALLERY,
};
export const NPS_DATA_FEATURE_IMAGE = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_IMAGE,
};
export const NPS_DATA_FEATURE_INSTAGRAM_FEED = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_INSTAGRAM_FEED,
};
export const NPS_DATA_FEATURE_MAP = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_MAP,
};
export const NPS_DATA_FEATURE_SIMPLE_STORE = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_SIMPLE_STORE,
};
export const NPS_DATA_FEATURE_SOCIAL_ICONS = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_SOCIAL_ICONS,
};
export const NPS_DATA_FEATURE_VIDEO = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_VIDEO,
};
export const NPS_DATA_FEATURE_TEXT = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_TEXT,
};
export const NPS_DATA_FEATURE_FORM = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_FORM,
};
export const NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_ANIMATIONS_DATA = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_GLOBAL_STYLES_ANIMATION,
};
export const NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_BUTTONS_DATA = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_GLOBAL_STYLES_BUTTONS,
};
export const NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_COLORS_DATA = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_GLOBAL_STYLES_COLORS,
};
export const NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_TEXT_DATA = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_GLOBAL_STYLES_TEXT,
};
export const NPS_DATA_FEATURE_LAYOUT = {
    formType: NPS_TYPE_FEATURE_LAYOUT,
};
export const NPS_DATA_FEATURE_MOBILE_LAYOUT = {
    formType: NPS_TYPE_FEATURE_MOBILE_LAYOUT,
};
export const NPS_DATA_FEATURE_MULTILINGUAL = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_MULTILINGUAL,
};
export const NPS_DATA_FEATURE_SHAPE = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_SHAPE,
};
export const NPS_DATA_FEATURE_SEARCH = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_SEARCH,
};
export const NPS_DATA_FEATURE_SEO = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_SEO,
};
export const NPS_DATA_FEATURE_GAMIFICATION = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_FEATURE_GAMIFICATION,
};
export const NPS_DATA_AI_BUILDER = {
    titleI18Key: 'builder.nps.aiScoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_AI_BUILDER,
};
export const NPS_DATA_DEFAULT_AI_BUILDER = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_DEFAULT_AI_BUILDER,
};
export const NPS_DATA_TYPE_AI_ASSIST = {
    titleI18Key: 'builder.nps.scoreTitle',
    maxScoreI18Key: 'builder.nps.extremelyLikely',
    lowestScoreI18Key: 'builder.nps.notLikely',
    formType: NPS_TYPE_AI_ASSIST,
};
export const NPS_DATA_MAP = {
    [NPS_TYPE_DEFAULT]: NPS_DATA_DEFAULT,
    [NPS_TYPE_DEFAULT_AI_BUILDER]: NPS_DATA_DEFAULT_AI_BUILDER,
    [NPS_TYPE_AI_BUILDER]: NPS_DATA_AI_BUILDER,
    [NPS_TYPE_FEATURE_BUTTON]: NPS_DATA_FEATURE_BUTTON,
    [NPS_TYPE_FEATURE_FORM]: NPS_DATA_FEATURE_FORM,
    [NPS_TYPE_FEATURE_EMBED_CODE]: NPS_DATA_FEATURE_EMBED_CODE,
    [NPS_TYPE_FEATURE_GALLERY]: NPS_DATA_FEATURE_GALLERY,
    [NPS_TYPE_FEATURE_IMAGE]: NPS_DATA_FEATURE_IMAGE,
    [NPS_TYPE_FEATURE_INSTAGRAM_FEED]: NPS_DATA_FEATURE_INSTAGRAM_FEED,
    [NPS_TYPE_FEATURE_MAP]: NPS_DATA_FEATURE_MAP,
    [NPS_TYPE_FEATURE_SIMPLE_STORE]: NPS_DATA_FEATURE_SIMPLE_STORE,
    [NPS_TYPE_FEATURE_SOCIAL_ICONS]: NPS_DATA_FEATURE_SOCIAL_ICONS,
    [NPS_TYPE_FEATURE_VIDEO]: NPS_DATA_FEATURE_VIDEO,
    [NPS_TYPE_FEATURE_TEXT]: NPS_DATA_FEATURE_TEXT,
    [NPS_TYPE_FEATURE_GLOBAL_STYLES_ANIMATION]: NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_ANIMATIONS_DATA,
    [NPS_TYPE_FEATURE_GLOBAL_STYLES_BUTTONS]: NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_BUTTONS_DATA,
    [NPS_TYPE_FEATURE_GLOBAL_STYLES_COLORS]: NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_COLORS_DATA,
    [NPS_TYPE_FEATURE_GLOBAL_STYLES_TEXT]: NPS_DATA_FEATURE_GLOBAL_STYLES_NPS_TEXT_DATA,
    [NPS_TYPE_FEATURE_MULTILINGUAL]: NPS_DATA_FEATURE_MULTILINGUAL,
    [NPS_TYPE_FEATURE_LAYOUT]: NPS_DATA_FEATURE_LAYOUT,
    [NPS_TYPE_FEATURE_MOBILE_LAYOUT]: NPS_DATA_FEATURE_MOBILE_LAYOUT,
    [NPS_TYPE_FEATURE_SHAPE]: NPS_DATA_FEATURE_SHAPE,
    [NPS_TYPE_FEATURE_SEARCH]: NPS_DATA_FEATURE_SEARCH,
    [NPS_TYPE_FEATURE_SEO]: NPS_DATA_FEATURE_SEO,
    [NPS_TYPE_FEATURE_GAMIFICATION]: NPS_DATA_FEATURE_GAMIFICATION,
    [NPS_TYPE_AI_ASSIST]: NPS_DATA_TYPE_AI_ASSIST,
};

export const ASSETS_IMAGE_FILE_TYPES = [
    'jpeg',
    'jpg',
    'png',
    'ico',
    'gif',
    'webp',
    'svg',
];
export const ASSETS_FONT_FILE_TYPES = [
    'woff',
    'woff2',
];
export const ASSETS_TAB_ID_MY_LIBRARY = 'myLibrary';
export const ASSETS_TAB_ID_IMAGES = 'images';
export const ASSETS_TAB_ID_DOCUMENTS = 'documents';
export const ASSETS_TAB_ID_UNSPLASH = 'unsplash';
export const ASSETS_CATEGORY_IMAGE = 'image';
export const ASSETS_CATEGORY_DOCUMENT = 'document';
export const ASSETS_CATEGORIES = [
    ASSETS_CATEGORY_IMAGE,
    ASSETS_CATEGORY_DOCUMENT,
];
export const ASSETS_DOCUMENT_SIZE_LIMIT_MB = 50;
export const ASSETS_IMAGE_SIZE_LIMIT_MB = 15;
export const ASSETS_THUMBNAIL_WIDTH = 210;

export const COLOR_LIGHT = 'light';
export const COLOR_DARK = 'dark';
export const UNSPLASH_QUALITY_SETTINGS = '?w=1366&q=70&auto=format';

export const SPACING_HANDLE_OUTSIDE_ELEMENT_BOX_WIDTH_THRESHOLD = 162;

export const EXPIRATION_DAYS_COOKIE_HPANEL_REDIRECT = 7;