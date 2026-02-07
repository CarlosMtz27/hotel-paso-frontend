import React, { Suspense } from 'react'; // Importa React y Suspense
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
/**
 * Definimos todas las rutas de nuestra aplicación en un solo objeto.
 * Esto se llama centralizar las constantes. La gran ventaja es que si alguna vez
 * necesitamos cambiar una URL (por ejemplo, de '/productos' a '/inventario'),
 * solo tenemos que hacerlo en un lugar. También nos ayuda a evitar errores de tipeo
 * al usar las rutas en otras partes del código.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PANEL: '/dashboard',
  PANEL_ADMIN: '/dashboard-admin',
  PANEL_EMPLEADO: '/dashboard-empleado',
  TIPOS_HABITACION: '/tipos-habitacion',
  HABITACIONES: '/habitaciones',
  TARIFAS: '/tarifas',
  PRODUCTOS: '/productos',
  ESTANCIAS: '/estancias',
  TURNOS: '/turnos',
  CAJA: '/caja',
  USUARIOS: '/usuarios',
  REPORTES: '/reportes',
  NOT_FOUND: '*', // Para la ruta 404
};

/**
 * Aquí aplicamos una técnica de optimización llamada 'carga perezosa' (o 'lazy loading').
 * En lugar de cargar el código de todas las páginas a la vez, `React.lazy` permite
 * que cada página se cargue solo cuando el usuario navega hacia ella.
 * Esto hace que la aplicación se inicie mucho más rápido.
 */
const Login = React.lazy(() => import('@/pages/Login'));
const DashboardSelector = React.lazy(() => import('@/pages/DashboardSelector'));
const DashboardAdmin = React.lazy(() => import('@/pages/DashboardAdmin'));
const DashboardEmpleado = React.lazy(() => import('@/pages/DashboardEmpleado'));
const TiposHabitacion = React.lazy(() => import('@/pages/TiposHabitacion'));
const Habitaciones = React.lazy(() => import('@/pages/Habitaciones'));
const Tarifas = React.lazy(() => import('@/pages/Tarifas'));
const Productos = React.lazy(() => import('../pages/Productos'));
const Turnos = React.lazy(() => import('@/pages/Turnos'));
const Estancias = React.lazy(() => import('@/pages/Estancias'));
const Caja = React.lazy(() => import('@/pages/Caja'));
const Usuarios = React.lazy(() => import('@/pages/Usuarios'));
const Reportes = React.lazy(() => import('@/pages/Reportes'));



/**
 * Este es un componente 'envoltorio' (wrapper) que creamos para no repetir el código de `Suspense`.
 * `Suspense` es necesario para `React.lazy` y nos permite mostrar un mensaje de 'Cargando...'
 * mientras el componente de la página se descarga.
 */
const LazyElement = ({ Component }) => (
  <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando...</div>}>
    <Component />
  </Suspense>
);

/**
 * Aquí es donde `react-router-dom` define la estructura de navegación de toda la aplicación.
 * Cada objeto representa una ruta, su URL (`path`) y el componente que debe mostrar (`element`).
 */
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LazyElement Component={Login} />,
  },
  /**
   * Este es un grupo de rutas que comparten una estructura común. El `element` principal
   * (`ProtectedRoute` y `MainLayout`) se aplica a todas las rutas 'hijas' (`children`).
   * Esto es perfecto para las páginas que solo deben ser accesibles después de iniciar
   * sesión y que comparten la misma barra de navegación y pie de página.
   */
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.PANEL,
        element: <LazyElement Component={DashboardSelector} />,
      },
      {
        path: ROUTES.PANEL_ADMIN,
        element: <LazyElement Component={DashboardAdmin} />,
      },
      {
        path: ROUTES.PANEL_EMPLEADO,
        element: <LazyElement Component={DashboardEmpleado} />,
      },
      {
        path: ROUTES.TIPOS_HABITACION,
        element: <LazyElement Component={TiposHabitacion} />,
      },
      {
        path: ROUTES.HABITACIONES,
        element: <LazyElement Component={Habitaciones} />,
      },
      {
        path: ROUTES.TARIFAS,
        element: <LazyElement Component={Tarifas} />,
      },
      {
        path: ROUTES.PRODUCTOS,
        element: <LazyElement Component={Productos} />,
      },
      {
        path: ROUTES.ESTANCIAS,
        element: <LazyElement Component={Estancias} />,      },
      {
        path: ROUTES.TURNOS,
        element: <LazyElement Component={Turnos} />,
      },
      {
        path: ROUTES.CAJA,
        element: <LazyElement Component={Caja} />,},
      {
        path: ROUTES.USUARIOS,
        element: <LazyElement Component={Usuarios} />,
      },
      {
        path: ROUTES.REPORTES,
        element: <LazyElement Component={Reportes} />,
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
          <a
            href={ROUTES.PANEL}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Volver al Dashboard
          </a>
        </div>
      </div>
    ),
  },
])