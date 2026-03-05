import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// request interceptor → adjunta token JWT
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('nexoo_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// response interceptor → maneja errores globales
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('nexoo_token');
            localStorage.removeItem('nexoo_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default client;

// ─── Helpers de API ────────────────────────────────────────────────────────────
export const apiGet = (url, params) => client.get(url, { params });
export const apiPost = (url, data) => client.post(url, data);
export const apiPut = (url, data) => client.put(url, data);
export const apiDelete = (url) => client.delete(url);
