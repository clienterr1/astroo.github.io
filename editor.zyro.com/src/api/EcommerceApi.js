import axios from 'axios';

const ECOMMERCE_API = `${import.meta.env.VITE_ECOMMERCE_API_URL}/store`;

const http = axios.create({
    baseURL: ECOMMERCE_API,
    timeout: 5000,
    withCredentials: false,
});

export const getSettings = async (storeId) => {
    const {
        data
    } = await http.get(`/${storeId}/settings`);

    return data;
};

export const getStoreProducts = async (storeId) => {
    const {
        data
    } = await http.get(`/${storeId}/products`);

    return data.products;
};

export const getVariantsQuantity = async (storeId) => {
    const {
        data
    } = await http.get(`/${storeId}/variants`, {
        params: {
            fields: 'inventory_quantity',
        },
    });

    return data ? .variants;
};

export const getCategories = async (storeId) => {
    const {
        data
    } = await http.get(`/${storeId}/collections`);

    return data.collections;
};