import axios from 'axios';

const ECWID_API = `${import.meta.env.VITE_BACKEND_API_URL}/e1/stores`;
const ECWID_STOREFRONT_API = 'https://storefront.ecwid.com';

export const getStore = (siteId) => axios.get(`${ECWID_API}/${siteId}`);
export const deleteStore = (storeId) => axios.delete(`${ECWID_API}/${storeId}`);

export const getStoreSnapshot = (storeId) => axios.get(`${ECWID_STOREFRONT_API}/home-page/${storeId}/static-code`, {
    params: {
        'tplvar_ec.storefront.show_footer_menu': true,
    },
    withCredentials: false,
});