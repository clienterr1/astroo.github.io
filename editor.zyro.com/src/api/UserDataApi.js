import axios from 'axios';

const USER_TOKENS_API = `${import.meta.env.VITE_BACKEND_API_URL}/u1/tokens`;
const USER_DATA_API = `${import.meta.env.VITE_BACKEND_API_URL}/u1/data`;

export const createToken = (formName, siteId) => axios.post(`${USER_TOKENS_API}`, {
    formName,
    siteId,
});

export const getDataList = (token) => axios.get(`${USER_DATA_API}/${token}`, {
    params: {
        token,
    },
});

export const removeDataEntry = (token, entryId) => axios.delete(`${USER_DATA_API}/${token}/${entryId}`);

export const removeDataEntries = (token, entryIds) => axios.delete(`${USER_DATA_API}/${token}`, {
    data: {
        dataIds: entryIds,
    },
});

export const getFormEmails = ({
    token
}) => axios.get(`${USER_DATA_API}/form-emails/${token}`);

export const updateFormEmail = ({
    token,
    newFormEmail,
}) => axios.post(`${USER_DATA_API}/send-form-email-change-email/${token}/${newFormEmail}`);

export const resetFormEmail = ({
    token
}) => axios.post(`${USER_DATA_API}/reset-form-email/${token}`);

export const verifyFormEmail = ({
    token
}) => axios.post(`${USER_DATA_API}/verify-form-email/${token}`);