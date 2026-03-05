import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DEMO_PROVEEDORES } from '../../data/demo';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const EMPTY = { nombre: '', contacto: '', telefono: '', email: '', ciudad: '', notas: '' };

export default function AdminProveedores() {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try { setProveedores((await apiGet('/proveedores')).data?.data || (await apiGet('/proveedores')).data || DEMO_PROVEEDORES); }
        catch { setProveedores(DEMO_PROVEEDORES); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true); };
    const openEdit = (p) => { setForm(p); setEditId(p.id); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true);
        try {
            if (editId) { await apiPut(`/proveedores/${editId}`, form); toast.success('Proveedor actualizado'); }
            else { await apiPost('/proveedores', form); toast.success('Proveedor creado'); }
        } catch { toast.success(editId ? 'Proveedor actualizado (demo)' : 'Proveedor creado (demo)'); }
        if (editId) setProveedores(p => p.map(x => x.id === editId ? { ...x, ...form } : x));
        else setProveedores(p => [{ ...form, id: Date.now() }, ...p]);
        setSaving(false); setModal(false);
    };

    const handleDelete = async (p) => {
        try { await apiDelete(`/proveedores/${p.id}`); } catch { }
        setProveedores(prev => prev.filter(x => x.id !== p.id));
        toast.success('Proveedor eliminado'); setConfirmDel(null);
    };

    const COLS = [
        { key: 'nombre', label: 'Empresa', render: v => <strong>{v}</strong> },
        { key: 'contacto', label: 'Contacto' },
        { key: 'telefono', label: 'Teléfono', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'email', label: 'Email', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'ciudad', label: 'Ciudad', render: v => <span className="badge badge-blue">{v}</span> },
    ];

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">🚚 Proveedores</h1><p className="page-subtitle">{proveedores.length} proveedores</p></div>
                <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo Proveedor</button>
            </div>
            <div className="card">
                <div className="card-body">
                    {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                        <DataTable columns={COLS} data={proveedores} searchKeys={['nombre', 'contacto', 'ciudad', 'email']}
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

            <Modal open={modal} onClose={() => setModal(false)} title={editId ? '✏️ Editar Proveedor' : '➕ Nuevo Proveedor'}
                footer={<><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button><button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button></>}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group"><label className="form-label">Nombre empresa *</label><input className="form-input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></div>
                    <div className="form-grid">
                        <div className="form-group"><label className="form-label">Contacto</label><input className="form-input" value={form.contacto} onChange={e => set('contacto', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Teléfono</label><input className="form-input" value={form.telefono} onChange={e => set('telefono', e.target.value)} /></div>
                    </div>
                    <div className="form-grid">
                        <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} /></div>
                        <div className="form-group"><label className="form-label">Ciudad</label><input className="form-input" value={form.ciudad} onChange={e => set('ciudad', e.target.value)} /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Notas</label><textarea className="form-textarea" rows={3} value={form.notas} onChange={e => set('notas', e.target.value)} /></div>
                </form>
            </Modal>

            <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="⚠️ Eliminar proveedor"
                footer={<><button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button><button className="btn btn-danger" onClick={() => handleDelete(confirmDel)}>Eliminar</button></>}
            >
                <p>¿Eliminar al proveedor <strong>{confirmDel?.nombre}</strong>?</p>
            </Modal>
        </div>
    );
}
