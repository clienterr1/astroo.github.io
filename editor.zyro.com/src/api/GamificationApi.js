import axios from 'axios';

const GAMIFICATION_API = `${import.meta.env.VITE_BACKEND_API_URL}/gamification`;

export default {
    async getGamificationToken(siteId) {
        const {
            data
        } = await axios.get(`${GAMIFICATION_API}/auth/${siteId}`);

        return data.token;
    },
};