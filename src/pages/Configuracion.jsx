import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Configuracion() {
    const [apiUrl, setApiUrl] = useState(localStorage.getItem('nexoo_api_url') || import.meta.env.VITE_API_URL || 'http://localhost:3000/api');
    const [token, setToken] = useState(localStorage.getItem('nexoo_token') || '');
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const handleSave = () => {
        localStorage.setItem('nexoo_api_url', apiUrl);
        toast.success('Configuración guardada');
    };

    const handleTest = async () => {
        setTesting(true); setTestResult(null);
        try {
            const res = await fetch(`${apiUrl}/health`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (res.ok) setTestResult({ ok: true, msg: `✅ Conexión exitosa (${res.status})` });
            else setTestResult({ ok: false, msg: `⚠️ Servidor respondió con ${res.status}` });
        } catch (e) {
            setTestResult({ ok: false, msg: `❌ No se pudo conectar: ${e.message}` });
        }
        setTesting(false);
    };

    return (
        <div style={{ maxWidth: 640 }}>
            <div className="page-header">
                <h1 className="page-title">⚙️ Configuración</h1>
            </div>

            {/* API */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <div className="card-header"><span className="card-title">🔌 Conexión a la API</span></div>
                <div className="card-body">
                    <div className="form-group">
                        <label className="form-label">URL base de la API</label>
                        <input className="form-input" value={apiUrl} onChange={e => setApiUrl(e.target.value)} placeholder="http://localhost:3000/api" />
                        <p className="text-xs text-muted" style={{ marginTop: '0.375rem' }}>
                            Ejemplo: <code>http://localhost:3000/api</code> o <code>https://mi-api.com/api</code>
                        </p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Bearer Token / API Key (opcional)</label>
                        <input className="form-input" type="password" value={token} onChange={e => setToken(e.target.value)} placeholder="eyJhbGciOi..." />
                    </div>
                    {testResult && (
                        <div className={`alert ${testResult.ok ? 'alert-success' : 'alert-danger'}`} style={{ marginBottom: '1rem' }}>
                            {testResult.msg}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button className="btn btn-secondary" onClick={handleTest} disabled={testing}>
                            {testing ? 'Probando...' : '🔌 Probar conexión'}
                        </button>
                        <button className="btn btn-primary" onClick={handleSave}>💾 Guardar</button>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="card">
                <div className="card-header"><span className="card-title">ℹ️ Información del Sistema</span></div>
                <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                        {[
                            ['Aplicación', 'Nexoo Hub v1.0.0'],
                            ['Framework', 'React 19 + Vite'],
                            ['Estado BD', testResult?.ok ? '🟢 Conectada' : '⚪ No verificada'],
                            ['Modo', import.meta.env.DEV ? '🧪 Desarrollo (demo activo)' : '🚀 Producción'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                                <span className="text-muted text-sm">{k}</span>
                                <span className="text-sm font-bold">{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
