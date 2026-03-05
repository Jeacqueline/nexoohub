import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data, params) => {
        setLoading(true);
        setError(null);
        try {
            let res;
            if (method === 'GET') res = await apiGet(url, params);
            if (method === 'POST') res = await apiPost(url, data);
            if (method === 'PUT') res = await apiPut(url, data);
            if (method === 'DELETE') res = await apiDelete(url);
            return { ok: true, data: res.data };
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Error de red';
            setError(msg);
            return { ok: false, msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        get: (url, params) => request('GET', url, null, params),
        post: (url, data) => request('POST', url, data),
        put: (url, data) => request('PUT', url, data),
        remove: (url) => request('DELETE', url),
    };
};
