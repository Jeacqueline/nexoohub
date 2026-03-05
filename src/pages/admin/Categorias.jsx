import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DEMO_CATEGORIAS } from '../../data/demo';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const ICONOS = ['⚙️', '🔴', '🔧', '⚡', '🌀', '🚗', '🛢️', '🔩', '💧', '🔑', '🔋', '🪛'];
const EMPTY = { nombre: '', icono: '🔩', descripcion: '' };

export default function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try { setCategorias((await apiGet('/categorias')).data?.data || (await apiGet('/categorias')).data || DEMO_CATEGORIAS); }
        catch { setCategorias(DEMO_CATEGORIAS); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true); };
    const openEdit = (c) => { setForm(c); setEditId(c.id); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editId) { await apiPut(`/categorias/${editId}`, form); toast.success('Categoría actualizada'); }
            else { await apiPost('/categorias', form); toast.success('Categoría creada'); }
        } catch { toast.success(editId ? 'Categoría actualizada (demo)' : 'Categoría creada (demo)'); }
        if (editId) setCategorias(p => p.map(c => c.id === editId ? { ...c, ...form } : c));
        else setCategorias(p => [{ ...form, id: Date.now() }, ...p]);
        setSaving(false); setModal(false);
    };

    const handleDelete = async (c) => {
        try { await apiDelete(`/categorias/${c.id}`); } catch { }
        setCategorias(p => p.filter(x => x.id !== c.id));
        toast.success('Categoría eliminada'); setConfirmDel(null);
    };

    const COLS = [
        { key: 'icono', label: 'Icono', render: v => <span style={{ fontSize: '1.5rem' }}>{v}</span> },
        { key: 'nombre', label: 'Nombre', render: v => <strong>{v}</strong> },
        { key: 'descripcion', label: 'Descripción', render: v => <span className="text-muted text-sm">{v || '—'}</span> },
    ];

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">🏷️ Categorías</h1><p className="page-subtitle">{categorias.length} categorías</p></div>
                <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nueva Categoría</button>
            </div>
            <div className="card">
                <div className="card-body">
                    {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                        <DataTable columns={COLS} data={categorias} searchKeys={['nombre']}
                            actions={row => (
                                <div className="flex gap-2">
                                    <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(row)}><Pencil size={13} /></button>
                                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDel(row)}><Trash2 size={13} /></button>
                                </div>
                            )}
                        />
                    )}
                </div>
            </div>

            <Modal open={modal} onClose={() => setModal(false)} title={editId ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}
                footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button></>}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group"><label className="form-label">Nombre *</label><input className="form-input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></div>
                    <div className="form-group">
                        <label className="form-label">Icono</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                            {ICONOS.map(i => (
                                <button key={i} type="button" onClick={() => set('icono', i)} style={{
                                    fontSize: '1.5rem', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)',
                                    background: form.icono === i ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                                    border: form.icono === i ? '2px solid var(--accent)' : '1px solid var(--border)',
                                    cursor: 'pointer'
                                }}>{i}</button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group"><label className="form-label">Descripción</label><textarea className="form-textarea" rows={2} value={form.descripcion} onChange={e => set('descripcion', e.target.value)} /></div>
                </form>
            </Modal>

            <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="⚠️ Eliminar categoría"
                footer={<><button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button><button className="btn btn-danger" onClick={() => handleDelete(confirmDel)}>Eliminar</button></>}
            >
                <p>¿Eliminar la categoría <strong>{confirmDel?.nombre}</strong>?</p>
            </Modal>
        </div>
    );
}
