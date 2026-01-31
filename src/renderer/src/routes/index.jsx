import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import Register from '@/pages/Registro'
import Dashboard from '@/pages/Dashboard'
import TiposHabitacion from '@/pages/TiposHabitacion'
import MainLayout from '@/layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'

/**
 * Configuración de rutas de la aplicación
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  // Rutas con Layout (protegidas)
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        path: '/tipos-habitacion',
        element: <TiposHabitacion />,
      },
      // Aquí irán las demás rutas con el layout
      {
        path: '/habitaciones',
        element: <div className="p-8">Habitaciones - Próximamente</div>,
      },
      {
        path: '/tarifas',
        element: <div className="p-8">Tarifas - Próximamente</div>,
      },
      {
        path: '/estancias',
        element: <div className="p-8">Estancias - Próximamente</div>,
      },
      {
        path: '/productos',
        element: <div className="p-8">Productos - Próximamente</div>,
      },
      {
        path: '/turnos',
        element: <div className="p-8">Turnos - Próximamente</div>,
      },
      {
        path: '/caja',
        element: <div className="p-8">Caja - Próximamente</div>,
      },
      {
        path: '/reportes',
        element: <div className="p-8">Reportes - Próximamente</div>,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
          <a
            href="/dashboard"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Volver al Dashboard
          </a>
        </div>
      </div>
    ),
  },
])