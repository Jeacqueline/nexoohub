import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles = [] }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-center" style={{ minHeight: '100vh' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (roles.length > 0 && !roles.includes(user.rol)) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', background: 'var(--bg-base)' }}>
                <span style={{ fontSize: '4rem' }}>🔒</span>
                <h2 style={{ color: 'var(--text-primary)' }}>Acceso denegado</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Tu rol (<strong style={{ color: 'var(--accent)' }}>{user.rol}</strong>) no tiene permiso para ver esta sección.
                </p>
                <Navigate to="/catalogo" replace />
            </div>
        );
    }

    return children;
}
