import axios from 'axios';

const INSTAGRAM_API = `${import.meta.env.VITE_BACKEND_API_URL}/v3/instagram`;
const REDIRECT_URL = `${import.meta.env.VITE_BUILDER_URL}/instagram/auth`;

// IMPORTANT: Set devServer.https in vite.config.js to true when working with this
export const openAuthorizationWindow = (state) => {
    const instagramUrl = new URL('https://api.instagram.com/oauth/authorize');

    instagramUrl.searchParams.set('client_id',
        import.meta.env.VITE_INSTAGRAM_APP_ID);
    instagramUrl.searchParams.set('redirect_uri', REDIRECT_URL);
    instagramUrl.searchParams.set('scope', 'user_profile,user_media');
    instagramUrl.searchParams.set('response_type', 'code');
    instagramUrl.searchParams.set('state', encodeURIComponent(state));

    return window.open(
        instagramUrl,
        '',
        'height=600,width=450',
    );
};

export const authorize = async ({
    elementId,
    siteId,
    code,
}) => {
    const {
        data
    } = await axios.post(`${INSTAGRAM_API}/auth`, {
        siteId,
        elementId,
        code,
        redirectUrl: REDIRECT_URL,
    });

    return data;
};

export const getToken = async ({
    siteId,
    elementId,
}) => {
    const {
        accessToken
    } = (await axios.get(`${INSTAGRAM_API}/token/${siteId}/${elementId}`)).data;

    return accessToken;
};

export const deleteToken = async ({
    siteId,
    elementId,
}) => {
    await axios.delete(`${INSTAGRAM_API}/token/${siteId}/${elementId}`);
};