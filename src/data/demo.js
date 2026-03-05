// ─── Datos Demo — Refacciones de Motocicletas ────────────────────────────────

export const DEMO_USERS = [
    { id: 1, nombre: 'Admin Sistema', email: 'admin@nexoohub.com', password: '1234', rol: 'admin', avatar: 'A' },
    { id: 2, nombre: 'Carlos Ventas', email: 'ventas@nexoohub.com', password: '1234', rol: 'ventas', avatar: 'C' },
    { id: 3, nombre: 'María López', email: 'usuario@nexoohub.com', password: '1234', rol: 'usuario', avatar: 'M' },
    { id: 4, nombre: 'Juan Cliente', email: 'cliente@nexoohub.com', password: '1234', rol: 'cliente', avatar: 'J' },
    { id: 5, nombre: 'Sup. General', email: 'super@nexoohub.com', password: '1234', rol: 'supervisor', avatar: 'S' },
];

export const DEMO_CATEGORIAS = [
    { id: 1, nombre: 'Motor', icono: '🔩' },
    { id: 2, nombre: 'Frenos', icono: '🔴' },
    { id: 3, nombre: 'Suspensión', icono: '🔧' },
    { id: 4, nombre: 'Eléctrico', icono: '⚡' },
    { id: 5, nombre: 'Filtros', icono: '🌀' },
    { id: 6, nombre: 'Transmisión', icono: '⚙️' },
    { id: 7, nombre: 'Carrocería', icono: '🏍️' },
    { id: 8, nombre: 'Lubricantes', icono: '🛢️' },
    { id: 9, nombre: 'Rodamiento/Sello', icono: '⭕' },
    { id: 10, nombre: 'Escape', icono: '💨' },
];

export const DEMO_PROVEEDORES = [
    { id: 1, nombre: 'MotoPartes MX', contacto: 'Luis Ramírez', telefono: '555-1001', email: 'compras@motopartes.mx', ciudad: 'CDMX' },
    { id: 2, nombre: 'Distribuciones Moto', contacto: 'Ana Gómez', telefono: '555-2002', email: 'ventas@distmoto.com', ciudad: 'Guadalajara' },
    { id: 3, nombre: 'RepMoto Factory', contacto: 'Pedro Sánchez', telefono: '555-3003', email: 'info@repmatofactory.com', ciudad: 'Monterrey' },
    { id: 4, nombre: 'BikeParts S.A.', contacto: 'Elena Torres', telefono: '555-4004', email: 'pedidos@bikeparts.mx', ciudad: 'Puebla' },
];

export const DEMO_PRODUCTOS = [
    // Motor
    { id: 1, codigo: 'MOT-001', nombre: 'Pistón + Anillos Honda CB125', categoria_id: 1, categoria: 'Motor', precio: 380.00, costo: 200.00, stock: 25, stock_min: 5, marca: 'Honda', proveedor_id: 1, icono: '🔩', activo: true },
    { id: 2, codigo: 'MOT-002', nombre: 'Válvulas de Admisión/Escape Italika', categoria_id: 1, categoria: 'Motor', precio: 220.00, costo: 110.00, stock: 40, stock_min: 10, marca: 'Italika', proveedor_id: 2, icono: '🔩', activo: true },
    { id: 3, codigo: 'MOT-003', nombre: 'Cigüeñal Completo Yamaha YBR 125', categoria_id: 1, categoria: 'Motor', precio: 1850.00, costo: 980.00, stock: 8, stock_min: 3, marca: 'Yamaha', proveedor_id: 1, icono: '🔩', activo: true },
    // Frenos
    { id: 4, codigo: 'FRE-001', nombre: 'Balatas Traseras Honda CG 150', categoria_id: 2, categoria: 'Frenos', precio: 120.00, costo: 60.00, stock: 60, stock_min: 15, marca: 'Honda', proveedor_id: 3, icono: '🔴', activo: true },
    { id: 5, codigo: 'FRE-002', nombre: 'Balatas Delanteras Disco Suzuki GN', categoria_id: 2, categoria: 'Frenos', precio: 185.00, costo: 90.00, stock: 35, stock_min: 8, marca: 'Suzuki', proveedor_id: 3, icono: '🔴', activo: true },
    { id: 6, codigo: 'FRE-003', nombre: 'Disco de Freno Delantero Kawasaki', categoria_id: 2, categoria: 'Frenos', precio: 560.00, costo: 300.00, stock: 3, stock_min: 4, marca: 'Kawasaki', proveedor_id: 2, icono: '🔴', activo: true },
    // Suspensión
    { id: 7, codigo: 'SUS-001', nombre: 'Amortiguador Trasero Universal 270mm', categoria_id: 3, categoria: 'Suspensión', precio: 420.00, costo: 220.00, stock: 18, stock_min: 6, marca: 'YSS', proveedor_id: 1, icono: '🔧', activo: true },
    { id: 8, codigo: 'SUS-002', nombre: 'Resorte Horquilla Delantera CB190R', categoria_id: 3, categoria: 'Suspensión', precio: 280.00, costo: 140.00, stock: 12, stock_min: 4, marca: 'Honda', proveedor_id: 4, icono: '🔧', activo: true },
    // Eléctrico
    { id: 9, codigo: 'ELE-001', nombre: 'CDI Universal Motos 50-150cc', categoria_id: 4, categoria: 'Eléctrico', precio: 250.00, costo: 120.00, stock: 45, stock_min: 10, marca: 'Genérico', proveedor_id: 2, icono: '⚡', activo: true },
    { id: 10, codigo: 'ELE-002', nombre: 'Bobina de Encendido Italika DS150', categoria_id: 4, categoria: 'Eléctrico', precio: 195.00, costo: 95.00, stock: 30, stock_min: 8, marca: 'Italika', proveedor_id: 1, icono: '⚡', activo: true },
    { id: 11, codigo: 'ELE-003', nombre: 'Batería Moto 12V 5Ah YTX5L-BS', categoria_id: 4, categoria: 'Eléctrico', precio: 480.00, costo: 260.00, stock: 20, stock_min: 5, marca: 'Yuasa', proveedor_id: 3, icono: '⚡', activo: true },
    // Filtros
    { id: 12, codigo: 'FIL-001', nombre: 'Filtro de Aceite Moto Honda/Yamaha', categoria_id: 5, categoria: 'Filtros', precio: 95.00, costo: 45.00, stock: 80, stock_min: 20, marca: 'Hiflofiltro', proveedor_id: 4, icono: '🌀', activo: true },
    { id: 13, codigo: 'FIL-002', nombre: 'Filtro de Aire Esponja Italika 125', categoria_id: 5, categoria: 'Filtros', precio: 75.00, costo: 35.00, stock: 55, stock_min: 12, marca: 'Italika', proveedor_id: 2, icono: '🌀', activo: true },
    // Transmisión
    { id: 14, codigo: 'TRA-001', nombre: 'Kit Cadena + Piñones 428H Honda CG', categoria_id: 6, categoria: 'Transmisión', precio: 360.00, costo: 180.00, stock: 22, stock_min: 6, marca: 'DID', proveedor_id: 1, icono: '⚙️', activo: true },
    { id: 15, codigo: 'TRA-002', nombre: 'Corona 37T Yamaha FZ150', categoria_id: 6, categoria: 'Transmisión', precio: 180.00, costo: 85.00, stock: 14, stock_min: 4, marca: 'Yamaha', proveedor_id: 3, icono: '⚙️', activo: true },
    // Lubricantes
    { id: 16, codigo: 'LUB-001', nombre: 'Aceite Motor Moto 4T 10W-40 1L', categoria_id: 8, categoria: 'Lubricantes', precio: 145.00, costo: 70.00, stock: 100, stock_min: 25, marca: 'Motul', proveedor_id: 4, icono: '🛢️', activo: true },
    { id: 17, codigo: 'LUB-002', nombre: 'Aceite Horquilla 5W 500ml', categoria_id: 8, categoria: 'Lubricantes', precio: 110.00, costo: 55.00, stock: 30, stock_min: 8, marca: 'Bel-Ray', proveedor_id: 4, icono: '🛢️', activo: true },
    // Rodamientos / Sellos
    { id: 18, codigo: 'ROD-001', nombre: 'Rodamiento Rueda Trasera 6301 2RS', categoria_id: 9, categoria: 'Rodamiento/Sello', precio: 85.00, costo: 40.00, stock: 50, stock_min: 12, marca: 'SKF', proveedor_id: 2, icono: '⭕', activo: true },
    { id: 19, codigo: 'ROD-002', nombre: 'Sello de Aceite Motor 28x42x7', categoria_id: 9, categoria: 'Rodamiento/Sello', precio: 45.00, costo: 20.00, stock: 70, stock_min: 15, marca: 'NOK', proveedor_id: 1, icono: '⭕', activo: true },
    // Escape
    { id: 20, codigo: 'ESC-001', nombre: 'Junta Escape Motor 125cc Universal', categoria_id: 10, categoria: 'Escape', precio: 55.00, costo: 25.00, stock: 2, stock_min: 5, marca: 'Genérico', proveedor_id: 3, icono: '💨', activo: true },
];

export const DEMO_VENTAS = [
    { id: 1001, folio: 'V-2026-001', fecha: '2026-03-01', cliente: 'Pedro Ruiz', total: 620.00, iva: 84.14, subtotal: 535.86, estado: 'completada', cajero: 'Carlos Ventas', items: 2 },
    { id: 1002, folio: 'V-2026-002', fecha: '2026-03-02', cliente: 'Ana García', total: 1285.00, iva: 174.48, subtotal: 1110.52, estado: 'completada', cajero: 'Carlos Ventas', items: 3 },
    { id: 1003, folio: 'V-2026-003', fecha: '2026-03-03', cliente: 'Luis Martínez', total: 380.00, iva: 51.60, subtotal: 328.40, estado: 'completada', cajero: 'Carlos Ventas', items: 1 },
    { id: 1004, folio: 'V-2026-004', fecha: '2026-03-04', cliente: 'Rosa Flores', total: 2450.00, iva: 332.76, subtotal: 2117.24, estado: 'completada', cajero: 'Carlos Ventas', items: 4 },
    { id: 1005, folio: 'V-2026-005', fecha: '2026-03-05', cliente: 'Juan Moreno', total: 960.00, iva: 130.34, subtotal: 829.66, estado: 'completada', cajero: 'Carlos Ventas', items: 2 },
];

export const DEMO_KPI = {
    ventas_hoy: { valor: 4695.00, cambio: +12.3 },
    ventas_mes: { valor: 89250.00, cambio: +8.7 },
    productos_total: { valor: 20, cambio: 0 },
    stock_critico: { valor: 3, cambio: -1 },
    clientes_hoy: { valor: 24, cambio: +5.2 },
};

export const DEMO_VENTAS_SEMANA = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    data: [8200, 11500, 9800, 13200, 15700, 18900, 4200],
};

export const DEMO_VENTAS_CATEGORIA = {
    labels: ['Motor', 'Frenos', 'Eléctrico', 'Transmisión', 'Filtros', 'Otros'],
    data: [30, 20, 18, 15, 10, 7],
    colors: ['#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4', '#6b7280'],
};
