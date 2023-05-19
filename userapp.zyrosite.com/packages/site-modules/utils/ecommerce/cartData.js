import {
    SHOPPING_CART_STORAGE_KEY
} from '@zyro-inc/site-modules/constants/ecommerce';

export const getCartData = () => {
    const storageValue = window.localStorage.getItem(SHOPPING_CART_STORAGE_KEY);

    if (!storageValue) {
        return [];
    }

    const data = JSON.parse(storageValue);

    if (!data.payload.length) {
        return [];
    }

    if (Date.now() > data.expiry) {
        window.localStorage.removeItem(SHOPPING_CART_STORAGE_KEY);

        return [];
    }

    return data.payload;
};