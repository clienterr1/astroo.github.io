import {
    DEMO_ECOMMERCE_STORE_ID
} from '@zyro-inc/site-modules/constants/ecommerce';

export const getStoreId = (siteMeta) => siteMeta.ecommerceStoreId ?
    ? siteMeta.demoEcommerceStoreId ?
    ? DEMO_ECOMMERCE_STORE_ID;