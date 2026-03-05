# 🏍️ Nexoo Hub - Sistema de Refacciones para Motocicletas

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

Nexoo Hub es un sistema frontend moderno y robusto diseñado para la administración de una refaccionaria de motocicletas. Incluye gestión de inventario, registro de ventas, catálogos interactivos, reportes en tiempo real y administración de usuarios basada en roles.

---

## ✨ Características Principales

- **🎨 Interfaz Premium (Dark Mode):** Diseño moderno basado en glassmorphism con paleta de colores personalizada (Primary `#273038`, Accent `#41cab8`).
- **🛡️ Sistema de Roles:** Rutas y funcionalidades restringidas dinámicamente según el rol del usuario (Admin, Supervisor, Ventas, Usuario, Cliente).
- **🛒 Catálogo Interactivo:** Búsqueda en tiempo real por categoría y nombre, con visualización de detalles técnicos y carrito de compras para clientes.
- **🧾 Módulo de Ventas (Punto de Venta):** Búsqueda de productos, cálculo automático de totales con IVA, generación de tickets de venta e historial de transacciones.
- **📊 Dashboard:** KPIs en tiempo real, gráficas interactivas de ventas (Chart.js) y alertas automáticas de stock crítico.
- **📦 Administración Completa (CRUD):** Módulos dedicados para gestionar Productos, Categorías, Proveedores y Usuarios.
- **🧪 Modo Demo Integrado:** Permite probar el 100% de la interfaz sin necesidad de un backend conectado gracias a su sistema de fallback.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** React 19 + Vite.
- **Enrutamiento:** React Router v6 (Rutas protegidas con layouts persistentes).
- **Estilos:** CSS puro (`index.css`) con uso intensivo de variables CSS (`:root`) para theming dinámico. Sin dependencias externas pesadas.
- **Peticiones HTTP:** Axios con interceptores personalizados para manejo automático y persistencia de JWT.
- **Íconos:** Lucide React.
- **Gráficas:** Chart.js + react-chartjs-2.
- **Notificaciones:** React Hot Toast.

---

## 🚀 Cómo Inicializar el Proyecto Localmente

### 1. Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

### 2. Clonar / Acceder al proyecto
Si ya lo tienes en tu computadora local:
```bash
cd "/ruta/hacia/tu/carpeta/Front"
```

### 3. Instalar dependencias
Instala todos los paquetes requeridos por Node:
```bash
npm install
```

### 4. Variables de Entorno (Opcional pero Recomendado)
El proyecto usa un archivo `.env` en la raíz para definir la conexión al backend. Ya viene preconfigurado con:
```env
VITE_API_URL=http://localhost:3000/api
```
*(Puedes sobreescribirlo modificando este archivo o directo en la interfaz de "Configuración" de la app).*

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible localmente, usualmente en `http://localhost:5173`.

---

## 🔑 Usuarios Demo (Para Pruebas)

Mientras conectas tu propia base de datos (PostgreSQL), el sistema tiene un modo **"Demo"** por defecto. Si el API falla, entrará con datos de respaldo. 

Puedes usar cualquiera de estas cuentas, todas tienen la contraseña `1234`:

| Email | Rol | Permisos Principales |
|---|---|---|
| `admin@nexoohub.com` | **Admin** | Acceso total a Ventas, Productos, Usuarios, Dashboard y Configuración. |
| `super@nexoohub.com` | **Supervisor** | Acceso a Dashboards y Reportes de nivel gerencial. |
| `ventas@nexoohub.com` | **Ventas** | Módulo de tickets POS, Inventario y Catálogo (sin acceso a CRUD de usuarios/proveedores). |
| `usuario@nexoohub.com` | **Usuario** | Acceso a Inventario y Catálogo. |
| `cliente@nexoohub.com` | **Cliente** | Solo acceso a Catálogo y su perfil. |

---

## 🔌 Conexión con tu Base de Datos (Backend / PostgreSQL)

Nexoo Hub espera comunicarse con una API RESTful. La comunicación se maneja centralmente a través de `src/api/client.js`.

### El Flujo de Autenticación (JWT) funciona así:
1. Al hacer login, la app hace un `POST /auth/login`. Espera recibir en el Body de respuesta: 
   `{ "token": "tu_jwt_aqui", "user": { "id": 1, "nombre": "...", "rol": "admin" } }`
2. Si es correcto, el token se guarda en localStorage como `nexoo_token`.
3. Para cualquier otra petición (ej. GET `/productos`), la app adjunta automáticamente el header: `Authorization: Bearer <tu_jwt_aqui>`.
4. Si tu backend devuelve un error `401 Unauthorized` por token vencido, la app automáticamente cierra sesión y redirige al `/login`.

### Configuración Rápida
Cuando subas tu backend a producción (ej. Render, AWS, Heroku), simplemente entra en Nexoo Hub a la pestaña inferior de **⚙️ Configuración** y pega ahí url de tu API de producción (ej. `https://api.miproyecto.com/v1`). No necesitas recompilar la app para probar distintos backends.

---

## 📂 Estructura Principal de Directorios

```text
src/
├── api/             # Cliente Axios e interceptores (client.js)
├── components/
│   ├── layout/      # Sidebar, Navbar y Layout estrucutral 
│   └── ui/          # Componentes reutilizables (DataTable, Modal, Buttons)
├── context/         # AuthContext (Manejo global de Estado, JWT y Sesiones)
├── data/            # Mock Data (demo.js) con productos de motos y fallback
├── hooks/           # Custom hooks (Ej. useApi.js)
├── pages/           # Vistas principales de la App
│   ├── admin/       # CRUD de catálogos superiores
│   ├── Catalogo.jsx
│   ├── Dashboard.jsx
│   ├── Inventario.jsx
│   └── Ventas.jsx
├── router/          # AppRouter y ProtectedRoutes (Lógica de Roles)
└── index.css        # Variables globales de UI, Theming y CSS centralizado
```

---
*Hecho para organizar, vender e impactar vizualmente.* 🏎️💨
