import axios from 'axios';

const BILLING_API = `${import.meta.env.VITE_BACKEND_API_URL}/billing`;

export const getSiteSubscription = async (siteId) => {
    const {
        data
    } = await axios.get(`${BILLING_API}/subscriptions/site/${siteId}`);

    return data.subscription;
};

export const getSitesSubscriptions = async () => {
    const {
        data
    } = await axios.get(`${BILLING_API}/subscriptions`);

    return data;
};

export const connectSiteToSubscription = async ({
    siteId,
    subscriptionId,
}) => axios.patch(`${BILLING_API}/subscriptions/connect-site`, {
    siteId,
    subscriptionId,
});

export const activatePlan = (siteId) => axios.get(`${BILLING_API}/subscriptions/activate-plan`, {
    params: {
        'site-id': siteId,
    },
});

export const getSites = async () => (await axios.get(`${BILLING_API}/sites`)).data;