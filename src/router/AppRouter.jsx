import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages
import Login from '../pages/Login';
import Catalogo from '../pages/Catalogo';
import Dashboard from '../pages/Dashboard';
import Inventario from '../pages/Inventario';
import Ventas from '../pages/Ventas';
import Configuracion from '../pages/Configuracion';

// Admin pages
import AdminProductos from '../pages/admin/Productos';
import AdminUsuarios from '../pages/admin/Usuarios';
import AdminProveedores from '../pages/admin/Proveedores';
import AdminCategorias from '../pages/admin/Categorias';

export default function AppRouter() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Pública */}
                    <Route path="/login" element={<Login />} />

                    {/* Protegidas → Layout con sidebar */}
                    <Route element={
                        <ProtectedRoute roles={['cliente', 'usuario', 'ventas', 'admin', 'supervisor']}>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="/catalogo" replace />} />
                        <Route path="/catalogo" element={<Catalogo />} />

                        <Route path="/dashboard" element={
                            <ProtectedRoute roles={['admin', 'supervisor']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/inventario" element={
                            <ProtectedRoute roles={['usuario', 'ventas', 'admin']}>
                                <Inventario />
                            </ProtectedRoute>
                        } />

                        <Route path="/ventas" element={
                            <ProtectedRoute roles={['ventas', 'admin']}>
                                <Ventas />
                            </ProtectedRoute>
                        } />

                        {/* Admin */}
                        <Route path="/admin/productos" element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminProductos />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/usuarios" element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminUsuarios />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/proveedores" element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminProveedores />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/categorias" element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminCategorias />
                            </ProtectedRoute>
                        } />

                        <Route path="/configuracion" element={<Configuracion />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/catalogo" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
