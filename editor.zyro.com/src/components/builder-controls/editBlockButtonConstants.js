export const ALLOWED_EDITABLE_BLOCK_TYPES = {
    default: true,
};

export const ALLOWED_REMOVABLE_BLOCK_TYPES = {
    BlockNavigation: false,
    BlockBlogHeader: false,
    default: true,
};

export const ALLOWED_DUPLICATION_BLOCK_TYPES = {
    BlockNavigation: false,
    BlockBlogHeader: false,
    BlockEcwidStore: false,
    default: true,
};

export const ALLOWED_MOVE_UP_DOWN_BLOCK_TYPES = {
    BlockBlogHeader: false,
    BlockNavigation: false,
    default: true,
};

export const ALLOWED_MOVE_UP_DOWN_BLOCK_SLOTS = {
    footer: false,
    default: true,
};

export const ALLOWED_EDIT_BACKGROUND_BLOCK_TYPES = {
    BlockBlogHeader: false,
    BlockNavigation: false,
    BlockEcommerceProduct: false,
    BlockEcommerceProductList: false,
    BlockImageSlideshow: false,
    default: true,
};

export const ALLOWED_DUPLICATION_IDS = {
    navigation: false,
    default: true,
};

export const ALLOWED_DUPLICATION_SLOTS = {
    footer: false,
    default: true,
};

export const ALLOWED_LINKED_ACTIONS_SLOTS = {
    footer: true,
    default: false,
};

export const SLOTS_WITH_REMOVE_WARNING = {
    footer: true,
    default: false,
};