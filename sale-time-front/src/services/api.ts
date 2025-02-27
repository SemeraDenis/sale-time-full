import axios from 'axios';
import Cookies from 'js-cookie';
import i18n from "i18next";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get(process.env.REACT_APP_COOKIE_TOKEN || 'st-auth-token');

    if (token && config.headers) {
        config.headers.authorization = `Bearer ${token}`;
    }

    config.headers["Accept-Language"] = i18n.language;

    return config;
});

export default api;
