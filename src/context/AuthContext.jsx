import { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/demo';
import { apiPost } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recuperar sesión al montar
    useEffect(() => {
        const saved = localStorage.getItem('nexoo_user');
        const token = localStorage.getItem('nexoo_token');
        if (saved && token) {
            try { setUser(JSON.parse(saved)); } catch { }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // 1. Intentar con API real
        try {
            const res = await apiPost('/auth/login', { email, password });
            const { token, user: u } = res.data;
            localStorage.setItem('nexoo_token', token);
            localStorage.setItem('nexoo_user', JSON.stringify(u));
            setUser(u);
            return { ok: true };
        } catch (err) {
            // Si la API no está disponible, usar datos demo
            if (!err.response || err.code === 'ERR_NETWORK') {
                const demo = DEMO_USERS.find(
                    u => u.email === email && u.password === password
                );
                if (demo) {
                    const { password: _pw, ...u } = demo;
                    localStorage.setItem('nexoo_token', 'demo-token-' + u.id);
                    localStorage.setItem('nexoo_user', JSON.stringify(u));
                    setUser(u);
                    return { ok: true };
                }
                return { ok: false, msg: 'Credenciales incorrectas' };
            }
            return { ok: false, msg: err.response?.data?.message || 'Error al iniciar sesión' };
        }
    };

    const logout = () => {
        localStorage.removeItem('nexoo_token');
        localStorage.removeItem('nexoo_user');
        setUser(null);
    };

    const isAdmin = user?.rol === 'admin';
    const isVentas = user?.rol === 'ventas' || isAdmin;
    const isUsuario = user?.rol === 'usuario' || isVentas;
    const isSupervisor = user?.rol === 'supervisor' || isAdmin;

    const can = (rol) => {
        const hierarchy = { guest: 0, cliente: 1, usuario: 2, ventas: 3, supervisor: 3, admin: 5 };
        return (hierarchy[user?.rol] || 0) >= (hierarchy[rol] || 0);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isVentas, isUsuario, isSupervisor, can }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return ctx;
};
