import axios from 'axios';

const ASSETS_API_V3 = `${import.meta.env.VITE_BACKEND_API_URL}/v3/sites/assets`;

export const getAssets = async (siteId) => (await axios(`${ASSETS_API_V3}/${siteId}`)).data;

export const deleteAssets = async (assetNamesArray, siteId) => axios.delete(ASSETS_API_V3, {
    data: {
        assets: assetNamesArray,
        siteId,
    },
});

export const uploadFontAsset = (file, siteId) => {
    const formData = new FormData();

    formData.append('font', file);
    formData.append('siteId', siteId);

    return axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/v3/sites/assets/fonts`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const addAssetsPathData = ({
    siteId,
    assetsData = {},
}) => axios.post(`${ASSETS_API_V3}/${siteId}/assets-data`, {
    assetsData,
});