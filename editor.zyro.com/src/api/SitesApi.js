/* eslint-disable no-use-before-define */
import axios from 'axios';

const SITES_API = `${import.meta.env.VITE_BACKEND_API_URL}/v3/sites`;

export const saveSite = (websiteId, websiteData, clientTimestamp, siteMetaFlags) => {
    const body = {
        siteId: websiteId,
        data: websiteData,
        clientTimestamp,
        flags: siteMetaFlags,
    };

    return axios.post(`${SITES_API}/site`, body);
};

export const getSite = async (siteId) => {
    const sitesApiUrl =
        import.meta.env.VITE_MAPPER_PREVIEW ?
        `${SITES_API}/${siteId}?mapperPreview=${encodeURIComponent(import.meta.env.VITE_MAPPER_PREVIEW)}` :
        `${SITES_API}/${siteId}`;

    // ? Request caching breaks builder, explanation here:
    // ? https://hostinger.slack.com/archives/C01BHN9EF8F/p1632993388133800
    const {
        data
    } = await axios(sitesApiUrl, {
        headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
            Expires: '0',
        },
    });

    return data;
};

export const createSite = async ({
    data,
    siteName,
    templateId,
}) => (await axios.post(`${SITES_API}/`, {
    data,
    siteName,
    templateId,
})).data;

export const deleteSite = async (siteId) => axios.delete(`${SITES_API}/${siteId}`);