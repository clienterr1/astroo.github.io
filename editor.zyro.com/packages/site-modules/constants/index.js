export const MEDIA_MOBILE_BREAKPOINT = 920; // Grid/flex change point. Corresponds to global-styles/abstracts/_variables.scss

export const SEO_MAX_STRING_LENGTH_DESCRIPTION_COUNTER = 160;
export const SEO_MAX_STRING_LENGTH_DESCRIPTION = 200;
export const SEO_MAX_STRING_LENGTH_TITLE = 60;

export const SYSTEM_LOCALE = 'system';

export const GENERATED_SITE_TEMPLATE_ID = 'generated';
// Is needed for old legacy website types
export const IMPORTED_SITE_TEMPLATE_ID = 'website-importer';
export const BLANK_LAYOUT_TEMPLATE_ID = 'blanklayout';
export const AI_GENERATED_TEMPLATE_ID = 'aigenerated';

export const NAVIGATION_LINK_TYPE = 'Link';
export const NAVIGATION_PAGE_TYPE = 'Page';
export const NAVIGATION_FOLDER_TYPE = 'Folder';
export const NAVIGATION_HOMEPAGE_TYPE = 'Homepage';

export const NAVIGATION_GROUP_ROOT = 'ROOT';
export const NAVIGATION_GROUP_HIDDEN = 'HIDDEN';

export const LINK_TYPE_INTERNAL = 'internal';
export const LINK_TYPE_EXTERNAL = 'external';
export const LINK_TYPE_DOWNLOAD = 'download';
export const LINK_TYPE_ANCHORED_SECTION = 'anchored-section';

export const STATIC_ASSETS_BASE_PATH = 'https://static.zyro.com';
export const FLAG_CDN_PREFIX = 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.5/flags/4x3';

export const BLOCK_HEADER_CLASS = 'block-header';
export const BLOCK_HEADER_STICKY_CLASS = 'block-header--is-sticky';

export const TAB_SEO = 'seo';
export const TAB_GENERAL = 'general';
export const TAB_SOCIAL_IMAGE = 'socialImage';
export const TAB_PASSWORD_PROTECTION = 'passwordProtection';

// Page password page design types
export const PAGE_PASSWORD_DESIGN_TYPE_DEFAULT = 'default';
export const PAGE_PASSWORD_DESIGN_TYPE_CALM = 'calm';
export const PAGE_PASSWORD_DESIGN_TYPE_POPULAR = 'popular';

// Page types
export const PAGE_TYPE_DEFAULT = 'default';
export const PAGE_TYPE_BLOG_LIST = 'blogList';
export const PAGE_TYPE_BLOG = 'blog';
export const PAGE_TYPE_ECOMMERCE = 'ecommerce';
export const PAGE_TYPE_ECOMMERCE_PRODUCT = 'ecommerce-product';

// Store types
export const META_ECOMMERCE_TYPE = 'ecommerceType';
export const ECOMMERCE_TYPE_ECWID = 'ecwid';
export const ECOMMERCE_TYPE_ZYRO = 'zyro';

// Block slots
export const BLOCK_SLOT_FOOTER = 'footer';

// Block types
export const BLOCK_TYPE_HEADER = 'BlockNavigation';
export const BLOCK_TYPE_GRID = 'BlockGrid';
export const BLOCK_TYPE_NAVIGATION = 'BlockNavigation';
export const BLOCK_TYPE_LAYOUT = 'BlockLayout';
export const BLOCK_TYPE_BLOG_HEADER = 'BlockBlogHeader';
export const BLOCK_TYPE_BLOG_LIST = 'BlockBlogList';
export const BLOCK_TYPE_SLIDESHOW = 'BlockSlideshow';
export const BLOCK_TYPE_IMAGE_SLIDESHOW = 'BlockImageSlideshow';
export const BLOCK_TYPE_ECWID = 'BlockEcwidStore';
export const BLOCK_TYPE_ECOMMERCE_PRODUCT = 'BlockEcommerceProduct';
export const BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST = 'BlockEcommerceProductList';

// Element types
export const ELEMENT_TYPE_BUTTON = 'GridButton';
export const ELEMENT_TYPE_STRIPE_BUTTON = 'GridStripeButton';
export const ELEMENT_TYPE_ECOMMERCE_BUTTON = 'GridEcommerceButton';
export const ELEMENT_TYPE_MAP = 'GridMap';
export const ELEMENT_TYPE_VIDEO = 'GridVideo';
export const ELEMENT_TYPE_IMAGE = 'GridImage';
export const ELEMENT_TYPE_TEXT_BOX = 'GridTextBox';
export const ELEMENT_TYPE_FORM = 'GridForm';
export const ELEMENT_TYPE_INSTAGRAM_FEED = 'GridInstagramFeed';
export const ELEMENT_TYPE_SOCIAL_ICONS = 'GridSocialIcons';
export const ELEMENT_TYPE_GALLERY = 'GridGallery';
export const ELEMENT_TYPE_EMBED = 'GridEmbed';
export const ELEMENT_TYPE_SHAPE = 'GridShape';

export const NAVIGATION_LOGO_SPACING_MAP = {
    center: '0 var(--space-between-menu)',
    left: '0 var(--space-between-menu) 0 0',
    right: '0 0 0 var(--space-between-menu)',
    'center-center': '0 0 var(--space-between-menu) 0',
};

export const NAVIGATION_LOGO_MENU_POSITION_MAP = {
    // LogoPosition-NavigationPosition
    'left-left': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '1/2',
        menuColumn: '2/3',
        cartColumn: '3/3',
        templateColumns: 'minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
        mTemplateColumns: 'minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
    },
    'left-right': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '1/2',
        menuColumn: '2/3',
        cartColumn: '3/3',
        templateColumns: 'minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
        mTemplateColumns: 'minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
    },
    'left-center': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '1/2',
        menuColumn: '2/3',
        cartColumn: '3/3',
        templateColumns: 'minmax(calc(var(--logo-width) + var(--space-between-menu)), 1fr) auto 1fr',
        mTemplateColumns: 'minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), 1fr) auto 1fr',
    },
    'center-left': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '2/3',
        menuColumn: '1/2',
        cartColumn: '3/4',
        templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
        mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
    },
    'center-right': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '2/3',
        menuColumn: '3/4',
        cartColumn: '4/4',
        templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto) 1fr',
        mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto) 1fr',
    },
    'center-center': {
        logoRow: 0,
        menuRow: 2,
        cartRow: 1,
        logoColumn: '2/3',
        menuColumn: '1/4',
        cartColumn: '3/3',
        templateColumns: '1fr minmax(var(--logo-width), auto) 1fr',
        mTemplateColumns: '1fr minmax(var(--m-logo-width, var(--logo-width)), auto) 1fr',
    },
    'right-left': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '2/3',
        menuColumn: '1/2',
        cartColumn: '3/3',
        templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto)',
        mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto)',
    },
    'right-right': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '2/3',
        menuColumn: '1/2',
        cartColumn: '3/3',
        templateColumns: '1fr minmax(calc(var(--logo-width) + var(--space-between-menu)), auto)',
        mTemplateColumns: '1fr minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), auto)',
    },
    'right-center': {
        logoRow: 1,
        menuRow: 1,
        cartRow: 1,
        logoColumn: '3/4',
        menuColumn: '2/3',
        cartColumn: '4/4',
        templateColumns: '1fr auto minmax(calc(var(--logo-width) + var(--space-between-menu)), 1fr)',
        mTemplateColumns: '1fr auto minmax(calc(var(--m-logo-width, var(--logo-width)) + var(--space-between-menu)), 1fr)',
    },
};

export const NAVIGATION_JUSTIFY_CONTENT_MAP = {
    left: 'flex-start',
    right: 'flex-end',
    center: 'center',
    default: 'center',
};

export const NAVIGATION_LOGO_IMAGE_OBJECT_POSITION_MAP = {
    left: 'left center',
    right: 'right center',
    center: 'center center',
    default: 'left center',
};

export const TARGET_SELF = '_self';
export const TARGET_BLANK = '_blank';
export const REL_NOFOLLOW = 'nofollow';
export const ANCHOR_TAG = 'a';
export const DIV_TAG = 'div';

export const IMAGE_CLICK_ACTION_LIGHTBOX = 'lightbox';
export const IMAGE_CLICK_ACTION_LINK = 'link';
export const IMAGE_CLICK_ACTION_NONE = 'none';
export const BLOCK_MODIFIERS_MAP = {
    BlockEcwidStore: 'ecwid-store',
    BlockBlogHeader: 'blog-header',
    BlockBlogList: 'blog-list',
    BlockSlideshow: 'slideshow',
    default: 'grid',
};

export const DEFAULT_HTML_LANG_VALUE = {
    title: 'English',
    value: 'en',
};

export const ELEMENT_POSITION_KEY_MOBILE = 'mobile';
export const ELEMENT_POSITION_KEY_DESKTOP = 'desktop';

export const RESIZABLE_WIDTH_ELEMENT_TYPES = [
    ELEMENT_TYPE_IMAGE,
    ELEMENT_TYPE_MAP,
    ELEMENT_TYPE_VIDEO,
    ELEMENT_TYPE_TEXT_BOX,
    ELEMENT_TYPE_GALLERY,
    ELEMENT_TYPE_INSTAGRAM_FEED,
    ELEMENT_TYPE_EMBED,
    ELEMENT_TYPE_FORM,
    ELEMENT_TYPE_SOCIAL_ICONS,
    ELEMENT_TYPE_SHAPE,
];

export const RESIZABLE_HEIGHT_ELEMENT_TYPES = [
    ELEMENT_TYPE_IMAGE,
    ELEMENT_TYPE_MAP,
    ELEMENT_TYPE_VIDEO,
    ELEMENT_TYPE_EMBED,
    ELEMENT_TYPE_SHAPE,
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_BUTTON,
    ELEMENT_TYPE_ECOMMERCE_BUTTON,
];

export const DESKTOP_BLOCK_WIDTH = 1224;

export const DEFAULT_SECTION_ROW_HEIGHT = 24;
export const DEFAULT_SECTION_ROW_GAP = 16;
export const DEFAULT_SNAP_TO_ELEMENTS = true;
export const DEFAULT_SNAP_TO_GUIDES = true;

export const DEFAULT_SNAPPING_PROPERTIES_MAP = {
    snapRowHeight: DEFAULT_SECTION_ROW_HEIGHT,
    snapRowGap: DEFAULT_SECTION_ROW_GAP,
    shouldSnapToElements: DEFAULT_SNAP_TO_ELEMENTS,
    shouldSnapToGuides: DEFAULT_SNAP_TO_GUIDES,
};

// animations
export const ANIMATION_TYPE_GLOBAL = 'global';
export const ANIMATION_TYPE_ELEMENT = 'element';

export const ANIMATION_APPLICABLE_BLOCK_TYPES = [
    BLOCK_TYPE_BLOG_LIST,
    BLOCK_TYPE_BLOG_HEADER,
    BLOCK_TYPE_ECOMMERCE_PRODUCT_LIST,
    BLOCK_TYPE_ECOMMERCE_PRODUCT,
];
export const ANIMATION_ROLE_ITEMS = [
    ELEMENT_TYPE_IMAGE,
    ELEMENT_TYPE_GALLERY,
    ELEMENT_TYPE_INSTAGRAM_FEED,
    ...ANIMATION_APPLICABLE_BLOCK_TYPES,
];
export const ANIMATION_NOT_SUPPORTED_ELEMENTS = [ELEMENT_TYPE_EMBED];

export const DATA_ATTRIBUTE_ANIMATION_ROLE = 'data-animation-role';
export const DATA_ATTRIBUTE_ANIMATION_ROLE_IMAGE = 'image';
export const DATA_ATTRIBUTE_ANIMATION_ROLE_BLOCK_ELEMENT = 'block-element';
export const DATA_ATTRIBUTE_ANIMATION_STATE = 'data-animation-state';
export const DATA_ATTRIBUTE_ANIMATION_STATE_ACTIVE = 'active';
export const DATA_ATTRIBUTE_ELEMENT_ID = 'data-element-id';

export const ELEMENT_DATA_ATTRIBUTE = 'data-el-id';

export const BODY_ELEMENTS_BY_ELEMENT_ID = [
    'noscript-gtm',
    'fb-messenger',
];

export const DATA_ATTRIBUTE_SELECTOR = 'data-selector';
export const DATA_ATTRIBUTE_SELECTOR_GRID_RESIZER = 'data-grid-resizer';
export const DATA_ATTRIBUTE_SELECTOR_MODAL_BACKDROP = 'data-modal-backdrop';
export const DATA_ATTRIBUTE_SELECTOR_DRAWER_TRIGGER = 'data-drawer-trigger';
export const DATA_ATTRIBUTE_SELECTOR_TOAST = 'data-toast';
export const DATA_ATTRIBUTE_SELECTOR_SUBMISSIONS_EXPORT = 'data-submission-export';
export const DATA_ATTRIBUTE_SELECTOR_POPUP_CONTENT = 'data-popup-content';
export const DATA_ATTRIBUTE_SELECTOR_TOOLTIP_CONTENT = 'data-tooltip-content';
export const DATA_ATTRIBUTE_SELECTOR_CONTEXT_MENU = 'data-context-menu';
export const DATA_ATTRIBUTE_SELECTOR_ASSET_MANAGER = 'data-asset-manager';
export const DATA_ATTRIBUTE_SELECTOR_QUICK_START_GUIDE = 'data-quick-start-guide';
export const DATA_ATTRIBUTE_SELECTOR_HEATMAP = 'data-heatmap-header';
export const DATA_ATTRIBUTE_SELECTOR_RESIZE_DOTS = 'data-resize-dots';
export const DATA_ATTRIBUTE_SELECTOR_IMAGE = 'data-image';
export const DATA_ATTRIBUTE_SELECTOR_MODAL_OVERLAY = 'data-overlay-modal';
export const DATA_ATTRIBUTE_SELECTOR_FONT_SELECT = 'data-font-select';
export const DATA_ATTRIBUTE_SELECTOR_ELEMENT_TYPE = 'data-element-type';

export const PREVIEW_SUBDOMAINS = [
    '.builder-preview.space',
    '.builder-preview.com',
];

export const BROWSER_NAME_SAFARI = 'Safari';