import {
    ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH
} from '@zyro-inc/cdn-builder-placeholders/constants';

export const DEFAULT_EMPTY_PRODUCT_VALUE = {
    // this product object structure is aligned with the one returned from backend
    id: -1,
    title: 'Product name',
    description: `This is a sample product description. You can use it to describe your product,\
		from its size, weight, and color to other characteristics like material, and so on.
		\nMake sure you highlight the best qualities and the most important functions\
		that the product has. Make your customers want it and tell them how the product\
		could help make their life easier or simply more beautiful. After you have added\
		your product description in the store settings, it will appear here automatically`,
    images: [],
    options: [],
    type: {
        value: null,
    },
    thumbnail: null,
    variants: [{
        sku: null,
        prices: [{
            amount: 0,
        }, ],
        options: [],
    }, ],
};

export const DEMO_PRODUCTS = [{
        ...DEFAULT_EMPTY_PRODUCT_VALUE,
        title: 'Handmade Bowl "Ganbaru"',
        images: [{
            url: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/bowl-ganbaru.png`,
        }, ],
        thumbnail: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/bowl-ganbaru.png`,
    },
    {
        ...DEFAULT_EMPTY_PRODUCT_VALUE,
        title: 'Handmade Vase "Ikigai"',
        images: [{
            url: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-ikigai.png`,
        }, ],
        thumbnail: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-ikigai.png`,
    },
    {
        ...DEFAULT_EMPTY_PRODUCT_VALUE,
        title: 'Handmade Vase "Kaiyo"',
        images: [{
            url: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-kaiyo.png`,
        }, ],
        thumbnail: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-kaiyo.png`,
    },
    {
        ...DEFAULT_EMPTY_PRODUCT_VALUE,
        title: 'Handmade Vase "Shimai"',
        images: [{
            url: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-shimai.png`,
        }, ],
        thumbnail: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-shimai.png`,
    },
    {
        ...DEFAULT_EMPTY_PRODUCT_VALUE,
        title: 'Handmade Vase "Sora"',
        images: [{
            url: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-sora.png`,
        }, ],
        thumbnail: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-sora.png`,
    },
    {
        ...DEFAULT_EMPTY_PRODUCT_VALUE,
        title: 'Handmade Vase "Yuugen"',
        images: [{
            url: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-yuugen.png`,
        }, ],
        thumbnail: `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/vase-yuugen.png`,
    },
];

export const BLANK_IMAGE_URL = `${ECOMMERCE_PRODUCT_PLACEHOLDERS_BASE_PATH}/blank.png`;

export const PRODUCT_TYPE_DONATION = 'donation';
export const PRODUCT_TYPE_BOOKING = 'booking';

export const BOOKING_DURATION_UNIT_HOURS = 'hours';

export const BLOCKS_ECOMMERCE = [
    'BlockEcommerceProduct',
    'BlockEcommerceProductList',
];

export const CHECKOUT_ERROR_CODES = {
    INSUFFICIENT_INVENTORY: 'insufficient_inventory',
    BOOKING_UNAVAILABLE: 'booking_slot_not_available',
};

export const DEMO_ECOMMERCE_STORE_ID = 'demo_01G0E9P2R0CFTNBWEEFCEV8EG5';

export const SHOPPING_CART_STORAGE_KEY = 'shopping-cart-items';
export const SHOPPING_CART_TTL = 86400000; // 1 day
export const SITE_PRODUCT_SELECTION = 'site_product_selection';
export const SITE_PRODUCT_SELECTION_TYPE_LOWEST = 'lowest_price_first';
export const MAX_PRODUCTS_IN_CART = 160;