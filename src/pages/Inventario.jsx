import { useState, useEffect } from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { DEMO_PRODUCTOS, DEMO_CATEGORIAS } from '../data/demo';
import { apiGet } from '../api/client';
import DataTable from '../components/ui/DataTable';

export default function Inventario() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [catFiltro, setCatFiltro] = useState('todos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [pRes, cRes] = await Promise.all([apiGet('/productos'), apiGet('/categorias')]);
                setProductos(pRes.data?.data || pRes.data || DEMO_PRODUCTOS);
                setCategorias(cRes.data?.data || cRes.data || DEMO_CATEGORIAS);
            } catch {
                setProductos(DEMO_PRODUCTOS);
                setCategorias(DEMO_CATEGORIAS);
            }
            setLoading(false);
        })();
    }, []);

    const filtrados = catFiltro === 'todos'
        ? productos
        : productos.filter(p => p.categoria === catFiltro);

    const stockColor = (stock, min) => {
        if (stock === 0) return 'badge-red';
        if (stock <= min) return 'badge-yellow';
        return 'badge-green';
    };

    const stockLabel = (stock, min) => {
        if (stock === 0) return 'Sin stock';
        if (stock <= min) return 'Stock bajo';
        return 'Disponible';
    };

    const alertas = filtrados.filter(p => p.stock <= p.stock_min).length;

    const COLS = [
        { key: 'codigo', label: 'Código', render: v => <code style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{v}</code> },
        { key: 'icono', label: '', render: v => <span style={{ fontSize: '1.25rem' }}>{v || '🔩'}</span> },
        { key: 'nombre', label: 'Producto' },
        { key: 'marca', label: 'Marca', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'categoria', label: 'Categoría', render: v => <span className="badge badge-blue">{v}</span> },
        { key: 'precio', label: 'Precio', render: v => <span className="text-accent font-bold">${v?.toFixed(2)}</span> },
        { key: 'costo', label: 'Costo', render: v => <span className="text-muted">${v?.toFixed(2)}</span> },
        {
            key: 'stock', label: 'Stock', render: (v, row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${stockColor(v, row.stock_min)}`}>{v}</span>
                    {v <= row.stock_min && <AlertTriangle size={13} style={{ color: '#f59e0b' }} />}
                </div>
            )
        },
        { key: 'stock_min', label: 'Mín.', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'stock', label: 'Estado', render: (v, row) => <span className={`badge ${stockColor(v, row.stock_min)}`}>{stockLabel(v, row.stock_min)}</span> },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">📦 Inventario</h1>
                    <p className="page-subtitle">{filtrados.length} productos · {alertas > 0 && <span style={{ color: 'var(--accent)' }}>{alertas} alertas de stock</span>}</p>
                </div>
            </div>

            {/* Resumen cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {[
                    { label: 'Total productos', value: productos.length, color: '#3b82f6' },
                    { label: 'Stock suficiente', value: productos.filter(p => p.stock > p.stock_min).length, color: '#10b981' },
                    { label: 'Stock bajo', value: productos.filter(p => p.stock <= p.stock_min && p.stock > 0).length, color: '#f59e0b' },
                    { label: 'Sin stock', value: productos.filter(p => p.stock === 0).length, color: '#ef4444' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)', padding: '0.875rem 1rem',
                        borderTop: `2px solid ${s.color}`
                    }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div className="text-xs text-muted" style={{ marginTop: '0.2rem' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filtros categoría */}
            <div className="flex gap-2" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button className={`btn btn-sm ${catFiltro === 'todos' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCatFiltro('todos')}>Todos</button>
                {categorias.map(c => (
                    <button key={c.id} className={`btn btn-sm ${catFiltro === c.nombre ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setCatFiltro(c.nombre)}>
                        {c.icono} {c.nombre}
                    </button>
                ))}
            </div>

            {/* Tabla */}
            <div className="card">
                <div className="card-body" style={{ padding: '1.25rem' }}>
                    {loading ? (
                        <div className="loading-center"><div className="spinner" /></div>
                    ) : (
                        <DataTable
                            columns={COLS}
                            data={filtrados}
                            searchKeys={['nombre', 'codigo', 'marca', 'categoria']}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
