import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { DEMO_PRODUCTOS, DEMO_CATEGORIAS, DEMO_PROVEEDORES } from '../../data/demo';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const EMPTY = { codigo: '', nombre: '', categoria_id: '', precio: '', costo: '', stock: '', stock_min: '', marca: '', proveedor_id: '', activo: true };

export default function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const [pRes, cRes, prvRes] = await Promise.all([
                apiGet('/productos'), apiGet('/categorias'), apiGet('/proveedores')
            ]);
            setProductos(pRes.data?.data || pRes.data || DEMO_PRODUCTOS);
            setCategorias(cRes.data?.data || cRes.data || DEMO_CATEGORIAS);
            setProveedores(prvRes.data?.data || prvRes.data || DEMO_PROVEEDORES);
        } catch {
            setProductos(DEMO_PRODUCTOS);
            setCategorias(DEMO_CATEGORIAS);
            setProveedores(DEMO_PROVEEDORES);
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true); };
    const openEdit = (p) => {
        setForm({ ...p, categoria_id: p.categoria_id || '', proveedor_id: p.proveedor_id || '' });
        setEditId(p.id);
        setModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) {
                await apiPut(`/productos/${editId}`, form);
                setProductos(prev => prev.map(p => p.id === editId ? { ...p, ...form, id: editId } : p));
                toast.success('Producto actualizado');
            } else {
                await apiPost('/productos', form);
                const newP = { ...form, id: Date.now(), icono: '🔩', categoria: categorias.find(c => c.id === +form.categoria_id)?.nombre || '' };
                setProductos(prev => [newP, ...prev]);
                toast.success('Producto creado');
            }
        } catch {
            if (editId) {
                setProductos(prev => prev.map(p => p.id === editId ? { ...p, ...form, id: editId } : p));
                toast.success('Producto actualizado (demo)');
            } else {
                const newP = { ...form, id: Date.now(), icono: '🔩', categoria: categorias.find(c => c.id === +form.categoria_id)?.nombre || '', precio: +form.precio, costo: +form.costo, stock: +form.stock, stock_min: +form.stock_min };
                setProductos(prev => [newP, ...prev]);
                toast.success('Producto creado (demo)');
            }
        }
        setSaving(false);
        setModal(false);
    };

    const handleDelete = async (p) => {
        try { await apiDelete(`/productos/${p.id}`); } catch { }
        setProductos(prev => prev.filter(x => x.id !== p.id));
        toast.success('Producto eliminado');
        setConfirmDel(null);
    };

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const COLS = [
        { key: 'icono', label: '', render: v => <span style={{ fontSize: '1.25rem' }}>{v || '🔩'}</span> },
        { key: 'codigo', label: 'Código', render: v => <code style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{v}</code> },
        { key: 'nombre', label: 'Producto' },
        { key: 'marca', label: 'Marca', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'categoria', label: 'Categoría', render: v => <span className="badge badge-blue">{v}</span> },
        { key: 'precio', label: 'Precio', render: v => <span className="text-accent font-bold">${(+v)?.toFixed(2)}</span> },
        { key: 'stock', label: 'Stock', render: (v, row) => <span className={`badge ${v > row.stock_min ? 'badge-green' : v === 0 ? 'badge-red' : 'badge-yellow'}`}>{v}</span> },
        { key: 'activo', label: 'Estado', render: v => <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Activo' : 'Inactivo'}</span> },
    ];

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">⚙️ Productos</h1><p className="page-subtitle">{productos.length} registros</p></div>
                <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo Producto</button>
            </div>

            <div className="card">
                <div className="card-body">
                    {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                        <DataTable
                            columns={COLS}
                            data={productos}
                            searchKeys={['nombre', 'codigo', 'marca', 'categoria']}
                            actions={(row) => (
                                <div className="flex gap-2">
                                    <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(row)} title="Editar"><Pencil size={13} /></button>
                                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDel(row)} title="Eliminar"><Trash2 size={13} /></button>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Form Modal */}
            <Modal
                open={modal}
                onClose={() => setModal(false)}
                title={editId ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                size="lg"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                    </>
                }
            >
                <form onSubmit={handleSave}>
                    <div className="form-grid">
                        <div className="form-group"><label className="form-label">Código *</label><input className="form-input" value={form.codigo} onChange={e => set('codigo', e.target.value)} required /></div>
                        <div className="form-group"><label className="form-label">Marca</label><input className="form-input" value={form.marca} onChange={e => set('marca', e.target.value)} /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></div>
                    <div className="form-grid">
                        <div className="form-group"><label className="form-label">Categoría</label>
                            <select className="form-select" value={form.categoria_id} onChange={e => set('categoria_id', +e.target.value)}>
                                <option value="">-- Selecciona --</option>
                                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label className="form-label">Proveedor</label>
                            <select className="form-select" value={form.proveedor_id} onChange={e => set('proveedor_id', +e.target.value)}>
                                <option value="">-- Selecciona --</option>
                                {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-grid-3">
                        <div className="form-group"><label className="form-label">Precio Venta *</label><input type="number" step="0.01" className="form-input" value={form.precio} onChange={e => set('precio', e.target.value)} required /></div>
                        <div className="form-group"><label className="form-label">Costo</label><input type="number" step="0.01" className="form-input" value={form.costo} onChange={e => set('costo', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Stock Inicial</label><input type="number" className="form-input" value={form.stock} onChange={e => set('stock', e.target.value)} /></div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group"><label className="form-label">Stock Mínimo</label><input type="number" className="form-input" value={form.stock_min} onChange={e => set('stock_min', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Estado</label>
                            <select className="form-select" value={form.activo} onChange={e => set('activo', e.target.value === 'true')}>
                                <option value="true">Activo</option><option value="false">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Modal>

            {/* Confirm Delete */}
            <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="⚠️ Confirmar eliminación"
                footer={
                    <>
                        <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(confirmDel)}>Eliminar</button>
                    </>
                }
            >
                <p>¿Estás seguro de eliminar <strong>{confirmDel?.nombre}</strong>? Esta acción no se puede deshacer.</p>
            </Modal>
        </div>
    );
}
