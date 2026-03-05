import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, BarChart3,
    Users, Truck, Tag, LogOut, Settings, Boxes,
    Receipt, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV = [
    {
        label: 'Principal',
        items: [
            { to: '/catalogo', icon: ShoppingCart, label: 'Catálogo', roles: ['cliente', 'usuario', 'ventas', 'admin', 'supervisor'] },
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'supervisor'] },
        ]
    },
    {
        label: 'Operaciones',
        items: [
            { to: '/inventario', icon: Boxes, label: 'Inventario', roles: ['usuario', 'ventas', 'admin'] },
            { to: '/ventas', icon: Receipt, label: 'Ventas', roles: ['ventas', 'admin'] },
        ]
    },
    {
        label: 'Administración',
        items: [
            { to: '/admin/productos', icon: Package, label: 'Productos', roles: ['admin'] },
            { to: '/admin/categorias', icon: Tag, label: 'Categorías', roles: ['admin'] },
            { to: '/admin/usuarios', icon: Users, label: 'Usuarios', roles: ['admin'] },
            { to: '/admin/proveedores', icon: Truck, label: 'Proveedores', roles: ['admin'] },
        ]
    },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const userRol = user?.rol || 'cliente';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">🏍️</div>
                <div>
                    <h2>Nexoo Hub</h2>
                    <span>Refacciones de Motos</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                {NAV.map(section => {
                    const visibleItems = section.items.filter(i => i.roles.includes(userRol));
                    if (!visibleItems.length) return null;
                    return (
                        <div key={section.label}>
                            <div className="nav-section-label">{section.label}</div>
                            {visibleItems.map(item => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="sidebar-footer">
                <NavLink to="/configuracion" className="nav-item" style={{ marginBottom: '0.25rem' }}>
                    <Settings size={18} />
                    Configuración
                </NavLink>
                <div className="user-card" onClick={handleLogout} title="Cerrar sesión">
                    <div className="user-avatar">{user?.avatar || user?.nombre?.[0] || 'U'}</div>
                    <div className="user-info">
                        <div className="user-name">{user?.nombre || 'Usuario'}</div>
                        <div className="user-role">{user?.rol}</div>
                    </div>
                    <LogOut size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
            </div>
        </aside>
    );
}
