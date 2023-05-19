import {
    captureException
} from '@sentry/browser';
import axios from 'axios';

const MAIL_API = `${import.meta.env.VITE_BACKEND_API_URL}/v3/user-mail`;

export const sendPublishModalOpenMailEvent = (siteId) => {
    try {
        axios.post(`${MAIL_API}/modal/publish-open/${siteId}`);
    } catch (error) {
        captureException(error);
    }
};