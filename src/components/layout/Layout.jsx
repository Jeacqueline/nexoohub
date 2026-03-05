import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
