import axios from 'axios';

const GOOGLE_FONTS_API = `${import.meta.env.VITE_BACKEND_API_URL}/google-fonts`;

export const getGoogleFonts = async ({
    sort
} = {}) => {
    const {
        data
    } = await axios.get(GOOGLE_FONTS_API, {
        params: {
            sort,
        },
    });

    return data;
};