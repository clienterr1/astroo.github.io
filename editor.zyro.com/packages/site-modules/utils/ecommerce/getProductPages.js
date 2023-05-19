import {
    PAGE_TYPE_ECOMMERCE_PRODUCT
} from '@zyro-inc/site-modules/constants';

export const getProductPages = (websiteData, currentLocale) => Object.values(websiteData.languages[currentLocale].pages)
    .filter((page) => page.type === PAGE_TYPE_ECOMMERCE_PRODUCT);