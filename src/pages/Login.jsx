import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO_HINT = [
    { email: 'admin@nexoohub.com', rol: 'Admin' },
    { email: 'ventas@nexoohub.com', rol: 'Ventas' },
    { email: 'usuario@nexoohub.com', rol: 'Usuario' },
    { email: 'cliente@nexoohub.com', rol: 'Cliente' },
    { email: 'super@nexoohub.com', rol: 'Supervisor' },
];

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(form.email, form.password);
        setLoading(false);
        if (res.ok) {
            toast.success('¡Bienvenido!');
            navigate('/catalogo');
        } else {
            toast.error(res.msg || 'Credenciales incorrectas');
        }
    };

    const quickLogin = (email) => {
        setForm({ email, password: '1234' });
    };

    return (
        <div className="login-page">
            <div className="login-card">
                {/* Logo */}
                <div className="login-logo">
                    <div className="icon">🏍️</div>
                    <h1>Nexoo Hub</h1>
                    <p>Sistema de Refacciones para Motocicletas</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Correo electrónico</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="usuario@ejemplo.com"
                            value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full btn-lg"
                        disabled={loading}
                        style={{ justifyContent: 'center', marginTop: '0.5rem' }}
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Demo Hint */}
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <p className="text-xs text-muted" style={{ marginBottom: '0.625rem', fontWeight: 500 }}>
                        🧪 Usuarios demo (contraseña: <code style={{ color: 'var(--accent)' }}>1234</code>)
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {DEMO_HINT.map(u => (
                            <button
                                key={u.email}
                                onClick={() => quickLogin(u.email)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-sm)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    transition: 'background var(--transition)', width: '100%'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</span>
                                <span className="badge badge-yellow text-xs">{u.rol}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
