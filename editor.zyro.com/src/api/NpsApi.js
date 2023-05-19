import axios from 'axios';

export const NPS_API = `${import.meta.env.VITE_BACKEND_API_URL}/v3/nps`;

export const getLastEvaluation = async (formType) => (await axios.get(`${NPS_API}/last-evaluation/${formType}`)).data;

export const sendNpsScore = async ({
    score,
    comment,
    formType,
    importedWebsiteUrl,
    siteId,
}) => axios.post(`${NPS_API}`, {
    score,
    comment,
    formType,
    importedWebsiteUrl,
    siteId,
});