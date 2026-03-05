import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Eye, X, Plus } from 'lucide-react';
import { DEMO_PRODUCTOS, DEMO_CATEGORIAS } from '../data/demo';
import { apiGet } from '../api/client';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function Catalogo() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState('');
    const [catFiltro, setCatFiltro] = useState('todos');
    const [selected, setSelected] = useState(null);
    const [carrito, setCarrito] = useState([]);
    const [showCarrito, setShowCarrito] = useState(false);

    useEffect(() => {
        const load = async () => {
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
        };
        load();
    }, []);

    const filtrados = productos.filter(p => {
        const matchCat = catFiltro === 'todos' || p.categoria_id === +catFiltro || p.categoria === catFiltro;
        const matchQ = !busqueda ||
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
            (p.marca || '').toLowerCase().includes(busqueda.toLowerCase());
        return matchCat && matchQ && p.activo !== false;
    });

    const addToCart = (p) => {
        setCarrito(prev => {
            const ex = prev.find(i => i.id === p.id);
            if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...p, qty: 1 }];
        });
        toast.success(`${p.nombre} agregado al carrito`);
    };

    const totalCarrito = carrito.reduce((s, i) => s + i.precio * i.qty, 0);
    const stockColor = (s) => s > 10 ? 'badge-green' : s > 3 ? 'badge-yellow' : 'badge-red';

    return (
        <div>
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">🛒 Catálogo</h1>
                    <p className="page-subtitle">{filtrados.length} productos disponibles</p>
                </div>
                <div className="flex gap-3" style={{ alignItems: 'center' }}>
                    {/* Search */}
                    <div className="search-bar">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, código o marca..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            style={{ minWidth: '280px' }}
                        />
                    </div>
                    {/* Carrito */}
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCarrito(true)}
                        style={{ position: 'relative' }}
                    >
                        <ShoppingCart size={16} />
                        Carrito
                        {carrito.length > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-8px',
                                background: 'var(--red)', color: 'white', borderRadius: '50%',
                                width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>{carrito.reduce((s, i) => s + i.qty, 0)}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filtros categoría */}
            <div className="flex gap-2" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <button
                    className={`btn btn-sm ${catFiltro === 'todos' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setCatFiltro('todos')}
                >Todos</button>
                {categorias.map(c => (
                    <button
                        key={c.id}
                        className={`btn btn-sm ${catFiltro === c.nombre ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setCatFiltro(c.nombre)}
                    >{c.icono} {c.nombre}</button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="loading-center">
                    <div className="spinner" />
                    <span>Cargando productos...</span>
                </div>
            ) : filtrados.length === 0 ? (
                <div className="empty-state">
                    <Search size={48} />
                    <h3>Sin resultados</h3>
                    <p>Prueba con otros términos de búsqueda</p>
                </div>
            ) : (
                <div className="products-grid">
                    {filtrados.map(p => (
                        <div key={p.id} className="product-card">
                            <div className="product-card-img" onClick={() => setSelected(p)}>
                                <span>{p.icono || '🔩'}</span>
                                <span style={{
                                    position: 'absolute', top: '0.5rem', right: '0.5rem',
                                    fontSize: '0.65rem'
                                }} className={`badge ${stockColor(p.stock)}`}>
                                    Stock: {p.stock}
                                </span>
                            </div>
                            <div className="product-card-body">
                                <div className="product-card-code">{p.codigo}</div>
                                <div className="product-card-name">{p.nombre}</div>
                                <div className="text-xs text-muted" style={{ marginBottom: '0.5rem' }}>
                                    {p.marca} · {p.categoria}
                                </div>
                                <div className="flex-between" style={{ marginTop: '0.75rem' }}>
                                    <div className="product-card-price">${p.precio.toFixed(2)}</div>
                                    <div className="flex gap-2">
                                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelected(p)} title="Ver detalle">
                                            <Eye size={15} />
                                        </button>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => addToCart(p)}
                                            disabled={p.stock === 0}
                                        >
                                            <Plus size={14} /> Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Detalle */}
            <Modal
                open={!!selected}
                onClose={() => setSelected(null)}
                title={`🔩 ${selected?.nombre}`}
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cerrar</button>
                        <button className="btn btn-primary" onClick={() => { addToCart(selected); setSelected(null); }}>
                            <ShoppingCart size={16} /> Agregar al Carrito
                        </button>
                    </>
                }
            >
                {selected && (
                    <div>
                        <div style={{ textAlign: 'center', fontSize: '5rem', marginBottom: '1rem', padding: '1.5rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                            {selected.icono || '🔩'}
                        </div>
                        <div className="form-grid" style={{ gap: '0.75rem' }}>
                            {[
                                ['Código', selected.codigo],
                                ['Marca', selected.marca],
                                ['Categoría', selected.categoria],
                                ['Precio', `$${selected.precio?.toFixed(2)}`],
                                ['Stock disponible', selected.stock],
                                ['Proveedor', 'AutoParts MX'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                    <div className="text-xs text-muted">{k}</div>
                                    <div className="font-bold text-sm" style={{ marginTop: '0.2rem' }}>{v}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Carrito */}
            <Modal
                open={showCarrito}
                onClose={() => setShowCarrito(false)}
                title="🛒 Carrito de Compras"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setShowCarrito(false)}>Seguir comprando</button>
                        <button className="btn btn-primary btn-lg" onClick={() => { toast.success('Pedido registrado'); setCarrito([]); setShowCarrito(false); }}>
                            Confirmar pedido · ${totalCarrito.toFixed(2)}
                        </button>
                    </>
                }
            >
                {carrito.length === 0 ? (
                    <div className="empty-state">
                        <ShoppingCart size={48} />
                        <h3>Carrito vacío</h3>
                        <p>Agrega productos del catálogo</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {carrito.map(item => (
                            <div key={item.id} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.75rem', background: 'var(--bg-elevated)',
                                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
                            }}>
                                <span style={{ fontSize: '1.75rem' }}>{item.icono || '🔩'}</span>
                                <div style={{ flex: 1 }}>
                                    <div className="text-sm font-bold">{item.nombre}</div>
                                    <div className="text-xs text-muted">${item.precio.toFixed(2)} c/u</div>
                                </div>
                                <div className="flex gap-2" style={{ alignItems: 'center' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setCarrito(c => c.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}>-</button>
                                    <span className="text-sm font-bold">{item.qty}</span>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setCarrito(c => c.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}>+</button>
                                </div>
                                <div className="text-accent font-bold text-sm" style={{ minWidth: '70px', textAlign: 'right' }}>
                                    ${(item.precio * item.qty).toFixed(2)}
                                </div>
                                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setCarrito(c => c.filter(i => i.id !== item.id))}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                        <div className="divider" />
                        <div className="flex-between">
                            <span className="text-muted text-sm">Total</span>
                            <span className="font-bold text-accent" style={{ fontSize: '1.25rem' }}>${totalCarrito.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
