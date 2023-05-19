import axios from 'axios';
import {
    mapUnsplashImageToSiteImage
} from '@/utils/mappers';

const UNSPLASH_API = `${import.meta.env.VITE_BACKEND_API_URL}/unsplash`;

export const getRandomImage = async ({
    query
}) => {
    const {
        data
    } = await axios.post(`${UNSPLASH_API}/random`, {
        query,
        count: 1,
    });

    return mapUnsplashImageToSiteImage({
        image: data.results.response[0],
    });
};

export const searchImages = async ({
    query,
    page,
    count,
}) => {
    const {
        data
    } = await axios.post(`${UNSPLASH_API}/search`, {
        query,
        page,
        count,
    });

    return data.response;
};

// Unsplash TOS requires us to fire this everytime unsplash image is selected
// https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
export const logDownload = ({
    imageJson
}) => {
    try {
        axios.post(`${UNSPLASH_API}/download/`, {
            imageJson,
        }, {
            common: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error);
    }
};