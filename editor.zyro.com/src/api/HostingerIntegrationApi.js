import axios from 'axios';

export const GET_UNUSED_HOSTINGER_DOMAIN = `${import.meta.env.VITE_BACKEND_API_URL}/v3/hostinger-integration/unused-domain`;

export const getUnusedHostingerDomain = async () => {
    const {
        data
    } = await axios.get(GET_UNUSED_HOSTINGER_DOMAIN);

    return data.websiteDomain;
};