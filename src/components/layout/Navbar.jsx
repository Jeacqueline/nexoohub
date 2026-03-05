import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
    '/catalogo': '🛒 Catálogo de Productos',
    '/dashboard': '📊 Dashboard',
    '/inventario': '📦 Inventario',
    '/ventas': '💵 Ventas',
    '/admin/productos': '⚙️ Admin — Productos',
    '/admin/categorias': '⚙️ Admin — Categorías',
    '/admin/usuarios': '⚙️ Admin — Usuarios',
    '/admin/proveedores': '⚙️ Admin — Proveedores',
    '/configuracion': '⚙️ Configuración',
};

export default function Navbar() {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const title = PAGE_TITLES[pathname] || 'Nexoo Hub';

    return (
        <header className="navbar">
            <div className="navbar-title">{title}</div>
            <div className="navbar-actions">
                <span className={`badge-role ${user?.rol}`}>{user?.rol}</span>
                <button className="btn btn-ghost btn-icon" title="Notificaciones">
                    <Bell size={18} />
                </button>
            </div>
        </header>
    );
}
