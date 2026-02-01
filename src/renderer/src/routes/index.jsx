import { createBrowserRouter, Navigate } from 'react-router-dom'
import Login from '@/pages/Login'
import DashboardSelector from '@/pages/DashboardSelector'
import DashboardAdmin from '@/pages/DashboardAdmin'
import DashboardEmpleado from '@/pages/DashboardEmpleado'
import TiposHabitacion from '@/pages/TiposHabitacion'
import Habitaciones from '@/pages/Habitaciones'
import Tarifas from '@/pages/Tarifas'
import Productos from '../pages/Productos'
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
        element: <DashboardSelector />,
      },
      {
        path: '/dashboard-admin',
        element: <DashboardAdmin />,
      },
      {
        path: '/dashboard-empleado',
        element: <DashboardEmpleado />,
      },
      {
        path: '/tipos-habitacion',
        element: <TiposHabitacion />,
      },
      {
        path: '/habitaciones',
        element: <Habitaciones />,
      },
      {
        path: '/tarifas',
        element: <Tarifas />,
      },
      {
        path: '/productos',
        element: <Productos />,
      },
      {
        path: '/estancias',
        element: <div className="p-8">Estancias - Próximamente</div>,
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