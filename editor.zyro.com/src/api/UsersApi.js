import axios from 'axios';

const USERS_API = `${import.meta.env.VITE_BACKEND_API_URL}/v1/users`;

export const getUser = () => axios.get(`${USERS_API}/me`).then((result) => result.data.user);
export const selectLocale = (locale) => axios.patch(`${USERS_API}/locale`, {
    locale,
});
export const autoLoginWithDefault = () => axios.post(`${import.meta.env.VITE_BACKEND_API_URL}/v1/users/login`, {
    email: import.meta.env.VITE_DEFAULT_ACCOUNT_EMAIL,
    passwd: import.meta.env.VITE_DEFAULT_ACCOUNT_PASSWORD,
});

export const logOut = () => axios.get(`${import.meta.env.VITE_BACKEND_API_URL}/v1/users/logout`);