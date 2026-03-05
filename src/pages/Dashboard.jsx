import { useEffect, useState } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    ArcElement, Title, Tooltip, Legend, PointElement, LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    DollarSign, Package, AlertTriangle, Users,
    TrendingUp, TrendingDown, ShoppingBag
} from 'lucide-react';
import { DEMO_KPI, DEMO_VENTAS_SEMANA, DEMO_VENTAS_CATEGORIA, DEMO_PRODUCTOS } from '../data/demo';
import { apiGet } from '../api/client';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, PointElement, LineElement);

const CHART_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => '$' + (v / 1000).toFixed(0) + 'k' } },
    },
};

const DONUT_OPTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12, font: { size: 11 } } } },
    cutout: '65%',
};

function StatCard({ label, value, icon: Icon, color, bg, change }) {
    const up = change >= 0;
    return (
        <div className="stat-card" style={{ '--stat-color': color, '--stat-bg': bg }}>
            <div className="stat-icon"><Icon /></div>
            <div className="stat-info">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
                {change !== undefined && (
                    <div className={`stat-change ${up ? 'up' : 'down'}`}>
                        {up ? <TrendingUp size={12} style={{ display: 'inline', marginRight: 3 }} /> : <TrendingDown size={12} style={{ display: 'inline', marginRight: 3 }} />}
                        {up ? '+' : ''}{change}%
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [kpi, setKpi] = useState(DEMO_KPI);
    const [semana, setSemana] = useState(DEMO_VENTAS_SEMANA);
    const [categoria, setCateg] = useState(DEMO_VENTAS_CATEGORIA);
    const [criticos, setCriticos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [kRes] = await Promise.all([apiGet('/dashboard/kpis')]);
                setKpi(kRes.data);
            } catch {
                // usar demo
            }
            // Productos con stock crítico
            try {
                const pRes = await apiGet('/productos');
                const data = pRes.data?.data || pRes.data || DEMO_PRODUCTOS;
                setCriticos(data.filter(p => p.stock <= p.stock_min));
            } catch {
                setCriticos(DEMO_PRODUCTOS.filter(p => p.stock <= p.stock_min));
            }
            setLoading(false);
        })();
    }, []);

    const barData = {
        labels: semana.labels,
        datasets: [{
            label: 'Ventas',
            data: semana.data,
            backgroundColor: 'rgba(245,158,11,0.7)',
            borderColor: '#f59e0b',
            borderWidth: 1,
            borderRadius: 4,
        }],
    };

    const donutData = {
        labels: categoria.labels,
        datasets: [{
            data: categoria.data,
            backgroundColor: categoria.colors,
            borderWidth: 0,
        }],
    };

    const fmt = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n?.toFixed(2)}`;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">📊 Dashboard</h1>
                    <p className="page-subtitle">Resumen ejecutivo en tiempo real</p>
                </div>
                <span className="text-xs text-muted">Actualizado: {new Date().toLocaleString('es-MX')}</span>
            </div>

            {/* KPIs */}
            <div className="stats-grid">
                <StatCard label="Ventas Hoy" value={fmt(kpi.ventas_hoy?.valor)} icon={DollarSign} color="#f59e0b" bg="rgba(245,158,11,0.1)" change={kpi.ventas_hoy?.cambio} />
                <StatCard label="Ventas del Mes" value={fmt(kpi.ventas_mes?.valor)} icon={TrendingUp} color="#10b981" bg="rgba(16,185,129,0.1)" change={kpi.ventas_mes?.cambio} />
                <StatCard label="Productos en Catálogo" value={kpi.productos_total?.valor} icon={Package} color="#3b82f6" bg="rgba(59,130,246,0.1)" />
                <StatCard label="Stock Crítico" value={kpi.stock_critico?.valor} icon={AlertTriangle} color="#ef4444" bg="rgba(239,68,68,0.1)" />
                <StatCard label="Clientes Atendidos" value={kpi.clientes_hoy?.valor} icon={Users} color="#8b5cf6" bg="rgba(139,92,246,0.1)" change={kpi.clientes_hoy?.cambio} />
            </div>

            {/* Gráficas */}
            <div className="charts-grid">
                {/* Bar */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">📈 Ventas por Día (semana actual)</span>
                    </div>
                    <div className="card-body" style={{ height: 280 }}>
                        <Bar data={barData} options={CHART_OPTS} />
                    </div>
                </div>
                {/* Donut */}
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">🍩 Ventas por Categoría</span>
                    </div>
                    <div className="card-body" style={{ height: 280 }}>
                        <Doughnut data={donutData} options={DONUT_OPTS} />
                    </div>
                </div>
            </div>

            {/* Stock Crítico */}
            <div className="card">
                <div className="card-header">
                    <span className="card-title">⚠️ Productos con Stock Crítico</span>
                    <span className="badge badge-red">{criticos.length} alertas</span>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    {criticos.length === 0 ? (
                        <div className="empty-state"><p>✅ Todos los productos tienen stock suficiente</p></div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Código</th>
                                        <th>Categoría</th>
                                        <th>Stock Actual</th>
                                        <th>Stock Mínimo</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {criticos.map(p => (
                                        <tr key={p.id}>
                                            <td><span style={{ marginRight: '0.5rem' }}>{p.icono}</span>{p.nombre}</td>
                                            <td><code style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.codigo}</code></td>
                                            <td>{p.categoria}</td>
                                            <td><span className="badge badge-red">{p.stock}</span></td>
                                            <td>{p.stock_min}</td>
                                            <td>
                                                <span className={`badge ${p.stock === 0 ? 'badge-red' : 'badge-yellow'}`}>
                                                    {p.stock === 0 ? 'Sin stock' : 'Bajo'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
