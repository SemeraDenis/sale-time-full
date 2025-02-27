import axios from 'axios';
import Cookies from 'js-cookie';
import i18n from "i18next";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('st_auth_token');

    if (token && config.headers) {
        config.headers['st_auth_token'] = `${token}`;
    }

    config.headers["Accept-Language"] = i18n.language;

    return config;
});

export default api;
