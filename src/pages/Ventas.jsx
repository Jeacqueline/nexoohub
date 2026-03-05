import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Printer } from 'lucide-react';
import { DEMO_PRODUCTOS, DEMO_VENTAS } from '../data/demo';
import { apiGet, apiPost } from '../api/client';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/ui/DataTable';
import toast from 'react-hot-toast';

const IVA = 0.16;

export default function Ventas() {
    const { user } = useAuth();
    const [tab, setTab] = useState('nueva');
    const [productos, setProductos] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [cliente, setCliente] = useState({ nombre: '', telefono: '', vehiculo: '' });
    const [ticket, setTicket] = useState([]);
    const [loading, setLoading] = useState(false);
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        (async () => {
            try { setProductos((await apiGet('/productos')).data?.data || (await apiGet('/productos')).data || DEMO_PRODUCTOS); } catch { setProductos(DEMO_PRODUCTOS); }
            try { setVentas((await apiGet('/ventas')).data?.data || (await apiGet('/ventas')).data || DEMO_VENTAS); } catch { setVentas(DEMO_VENTAS); }
        })();
    }, []);

    const sugerencias = busqueda.length > 1
        ? productos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.codigo.toLowerCase().includes(busqueda.toLowerCase())
        ).slice(0, 6)
        : [];

    const addToTicket = (p) => {
        if (p.stock === 0) { toast.error('Sin stock disponible'); return; }
        setTicket(prev => {
            const ex = prev.find(i => i.id === p.id);
            if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...p, qty: 1 }];
        });
        setBusqueda('');
    };

    const removeItem = (id) => setTicket(t => t.filter(i => i.id !== id));
    const changeQty = (id, q) => setTicket(t => t.map(i => i.id === id ? { ...i, qty: Math.max(1, q) } : i));

    const subtotal = ticket.reduce((s, i) => s + i.precio * i.qty, 0);
    const iva = subtotal * IVA;
    const total = subtotal + iva;

    const handleVenta = async () => {
        if (!ticket.length) { toast.error('El ticket está vacío'); return; }
        if (!cliente.nombre) { toast.error('Ingresa el nombre del cliente'); return; }
        setLoading(true);
        const body = {
            cliente,
            items: ticket.map(i => ({ producto_id: i.id, cantidad: i.qty, precio: i.precio })),
            subtotal, iva, total,
            cajero: user?.nombre,
        };
        try {
            const res = await apiPost('/ventas', body);
            toast.success('✅ Venta registrada — Folio: ' + (res.data?.folio || 'V-' + Date.now()));
        } catch {
            toast.success('✅ Venta registrada (modo demo)');
        }
        setVentas(v => [{
            id: Date.now(), folio: 'V-' + Date.now(), fecha: new Date().toLocaleDateString(),
            cliente: cliente.nombre, total, iva, subtotal, estado: 'completada', cajero: user?.nombre, items: ticket.length
        }, ...v]);
        setTicket([]);
        setCliente({ nombre: '', telefono: '', vehiculo: '' });
        setLoading(false);
        setTab('historial');
    };

    const COLS_VENTAS = [
        { key: 'folio', label: 'Folio', render: v => <code style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>{v}</code> },
        { key: 'fecha', label: 'Fecha' },
        { key: 'cliente', label: 'Cliente' },
        { key: 'cajero', label: 'Cajero', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'items', label: 'Artículos', render: v => <span className="badge badge-blue">{v}</span> },
        { key: 'total', label: 'Total', render: v => <span className="text-accent font-bold">${v?.toFixed(2)}</span> },
        { key: 'estado', label: 'Estado', render: v => <span className={`badge ${v === 'completada' ? 'badge-green' : 'badge-yellow'}`}>{v}</span> },
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">💵 Ventas</h1>
            </div>

            <div className="tabs">
                {[['nueva', '➕ Nueva Venta'], ['historial', '📋 Historial']].map(([k, l]) => (
                    <button key={k} className={`tab-btn ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>
                ))}
            </div>

            {tab === 'nueva' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>
                    {/* Izquierda */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Datos cliente */}
                        <div className="card">
                            <div className="card-header"><span className="card-title">👤 Datos del Cliente</span></div>
                            <div className="card-body">
                                <div className="form-grid">
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Nombre *</label>
                                        <input className="form-input" value={cliente.nombre} onChange={e => setCliente(c => ({ ...c, nombre: e.target.value }))} placeholder="Nombre del cliente" />
                                    </div>
                                    <div className="form-group" style={{ margin: 0 }}>
                                        <label className="form-label">Teléfono</label>
                                        <input className="form-input" value={cliente.telefono} onChange={e => setCliente(c => ({ ...c, telefono: e.target.value }))} placeholder="555-0000" />
                                    </div>
                                    <div className="form-group" style={{ margin: 0, gridColumn: '1/-1' }}>
                                        <label className="form-label">Moto / Referencia</label>
                                        <input className="form-input" value={cliente.vehiculo} onChange={e => setCliente(c => ({ ...c, vehiculo: e.target.value }))} placeholder="Ej: Honda CB125 2020 / Yamaha YBR 125" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buscar producto */}
                        <div className="card">
                            <div className="card-header"><span className="card-title">🔍 Buscar Producto</span></div>
                            <div className="card-body">
                                <div style={{ position: 'relative' }}>
                                    <div className="search-bar">
                                        <Search size={16} />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o código..."
                                            value={busqueda}
                                            onChange={e => setBusqueda(e.target.value)}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    {sugerencias.length > 0 && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                                            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                            borderRadius: 'var(--radius-md)', marginTop: '0.25rem',
                                            boxShadow: 'var(--shadow-md)', overflow: 'hidden'
                                        }}>
                                            {sugerencias.map(p => (
                                                <button key={p.id} onClick={() => addToTicket(p)} style={{
                                                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem 1rem', background: 'none', border: 'none',
                                                    borderBottom: '1px solid var(--border)', cursor: 'pointer',
                                                    transition: 'background var(--transition)', textAlign: 'left'
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                >
                                                    <span style={{ fontSize: '1.5rem' }}>{p.icono || '🔩'}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <div className="text-sm font-bold">{p.nombre}</div>
                                                        <div className="text-xs text-muted">{p.codigo} · Stock: {p.stock}</div>
                                                    </div>
                                                    <div className="text-accent font-bold text-sm">${p.precio.toFixed(2)}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items del ticket */}
                        {ticket.length > 0 && (
                            <div className="card">
                                <div className="card-header"><span className="card-title">📋 Artículos en el Ticket</span></div>
                                <div className="card-body" style={{ padding: 0 }}>
                                    <table className="data-table">
                                        <thead>
                                            <tr><th>Producto</th><th>Precio</th><th>Cant.</th><th>Subtotal</th><th></th></tr>
                                        </thead>
                                        <tbody>
                                            {ticket.map(item => (
                                                <tr key={item.id}>
                                                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span>{item.icono || '🔩'}</span>
                                                        <div>
                                                            <div className="text-sm">{item.nombre}</div>
                                                            <div className="text-xs text-muted">{item.codigo}</div>
                                                        </div>
                                                    </td>
                                                    <td>${item.precio.toFixed(2)}</td>
                                                    <td>
                                                        <input type="number" min="1" max={item.stock} value={item.qty}
                                                            onChange={e => changeQty(item.id, +e.target.value)}
                                                            style={{ width: 60, textAlign: 'center', padding: '0.25rem 0.5rem' }}
                                                        />
                                                    </td>
                                                    <td className="text-accent font-bold">${(item.precio * item.qty).toFixed(2)}</td>
                                                    <td><button className="btn btn-danger btn-icon btn-sm" onClick={() => removeItem(item.id)}><Trash2 size={13} /></button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Ticket */}
                    <div style={{ position: 'sticky', top: 'calc(var(--navbar-h) + 1rem)' }}>
                        <div className="ticket">
                            <div className="ticket-header">
                                <div className="ticket-title">🏍️ Nexoo Hub</div>
                                <div className="ticket-subtitle">{new Date().toLocaleString('es-MX')}</div>
                                {cliente.nombre && <div className="ticket-subtitle" style={{ marginTop: '0.25rem' }}>Cliente: {cliente.nombre}</div>}
                            </div>
                            {ticket.length === 0 ? (
                                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem', fontSize: '0.8rem' }}>
                                    Busca y agrega productos →
                                </div>
                            ) : (
                                <>
                                    {ticket.map(i => (
                                        <div key={i.id} className="ticket-item">
                                            <span>{i.qty}x {i.nombre.substring(0, 20)}…</span>
                                            <span>${(i.precio * i.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="ticket-item" style={{ marginTop: '0.5rem', borderTop: '1px dashed var(--border)', paddingTop: '0.5rem' }}>
                                        <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="ticket-item iva">
                                        <span>IVA (16%)</span><span>${iva.toFixed(2)}</span>
                                    </div>
                                    <div className="ticket-item total">
                                        <span>TOTAL</span><span>${total.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <button
                            className="btn btn-primary btn-lg w-full"
                            style={{ marginTop: '1rem', justifyContent: 'center' }}
                            onClick={handleVenta}
                            disabled={loading || !ticket.length}
                        >
                            {loading ? 'Procesando...' : '✅ Registrar Venta'}
                        </button>
                    </div>
                </div>
            )}

            {tab === 'historial' && (
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📋 Historial de Ventas</span>
                        <span className="text-muted text-sm">{ventas.length} transacciones</span>
                    </div>
                    <div className="card-body">
                        <DataTable
                            columns={COLS_VENTAS}
                            data={ventas}
                            searchKeys={['folio', 'cliente', 'cajero']}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
