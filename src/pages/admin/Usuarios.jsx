import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DEMO_USERS } from '../../data/demo';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/client';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const ROLES = ['admin', 'supervisor', 'ventas', 'usuario', 'cliente'];
const EMPTY = { nombre: '', email: '', password: '', rol: 'cliente', activo: true };

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [confirmDel, setConfirmDel] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try { setUsuarios((await apiGet('/usuarios')).data?.data || (await apiGet('/usuarios')).data || DEMO_USERS); }
        catch { setUsuarios(DEMO_USERS); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true); };
    const openEdit = (u) => { setForm({ ...u, password: '' }); setEditId(u.id); setModal(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editId) { await apiPut(`/usuarios/${editId}`, form); toast.success('Usuario actualizado'); }
            else { await apiPost('/usuarios', form); toast.success('Usuario creado'); }
        } catch { toast.success(editId ? 'Usuario actualizado (demo)' : 'Usuario creado (demo)'); }
        if (editId) setUsuarios(p => p.map(u => u.id === editId ? { ...u, ...form } : u));
        else setUsuarios(p => [{ ...form, id: Date.now(), avatar: form.nombre[0] }, ...p]);
        setSaving(false); setModal(false);
    };

    const handleDelete = async (u) => {
        try { await apiDelete(`/usuarios/${u.id}`); } catch { }
        setUsuarios(p => p.filter(x => x.id !== u.id));
        toast.success('Usuario eliminado'); setConfirmDel(null);
    };

    const BADGE_ROL = { admin: 'badge-purple', supervisor: 'badge-blue', ventas: 'badge-green', usuario: 'badge-yellow', cliente: 'badge-gray' };

    const COLS = [
        {
            key: 'avatar', label: '', render: (v, row) => (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--accent),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                    {v || row.nombre?.[0] || '?'}
                </div>
            )
        },
        { key: 'nombre', label: 'Nombre' },
        { key: 'email', label: 'Email', render: v => <span className="text-muted text-sm">{v}</span> },
        { key: 'rol', label: 'Rol', render: v => <span className={`badge ${BADGE_ROL[v] || 'badge-gray'}`}>{v}</span> },
        { key: 'activo', label: 'Estado', render: v => <span className={`badge ${v ? 'badge-green' : 'badge-gray'}`}>{v ? 'Activo' : 'Inactivo'}</span> },
    ];

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div>
            <div className="page-header">
                <div><h1 className="page-title">👥 Usuarios</h1><p className="page-subtitle">{usuarios.length} usuarios registrados</p></div>
                <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nuevo Usuario</button>
            </div>
            <div className="card">
                <div className="card-body">
                    {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                        <DataTable columns={COLS} data={usuarios} searchKeys={['nombre', 'email', 'rol']}
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

            <Modal open={modal} onClose={() => setModal(false)} title={editId ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
                footer={<>
                    <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                </>}
            >
                <form onSubmit={handleSave}>
                    <div className="form-group"><label className="form-label">Nombre completo *</label><input className="form-input" value={form.nombre} onChange={e => set('nombre', e.target.value)} required /></div>
                    <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} required /></div>
                    <div className="form-grid">
                        <div className="form-group"><label className="form-label">Contraseña {editId ? '(dejar vacío para no cambiar)' : '*'}</label><input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} required={!editId} /></div>
                        <div className="form-group"><label className="form-label">Rol *</label>
                            <select className="form-select" value={form.rol} onChange={e => set('rol', e.target.value)}>
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-group"><label className="form-label">Estado</label>
                        <select className="form-select" value={form.activo} onChange={e => set('activo', e.target.value === 'true')}>
                            <option value="true">Activo</option><option value="false">Inactivo</option>
                        </select>
                    </div>
                </form>
            </Modal>

            <Modal open={!!confirmDel} onClose={() => setConfirmDel(null)} title="⚠️ Eliminar usuario"
                footer={<><button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button><button className="btn btn-danger" onClick={() => handleDelete(confirmDel)}>Eliminar</button></>}
            >
                <p>¿Eliminar al usuario <strong>{confirmDel?.nombre}</strong>?</p>
            </Modal>
        </div>
    );
}
