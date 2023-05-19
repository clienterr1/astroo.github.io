import axios from 'axios';

const TEMPLATES_API = `${import.meta.env.VITE_BACKEND_API_URL}/v3/templates`;

export const getTemplateById = async (templateId) => (await axios.get(`${TEMPLATES_API}/${templateId}`)).data;