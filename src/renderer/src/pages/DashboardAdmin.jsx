import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function DashboardAdmin() {
  const { user } = useAuth()

  const menuItems = [
    {
      title: 'Gestión de Habitaciones',
      description: 'Administrar estado y disponibilidad',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      to: ROUTES.HABITACIONES,
      color: 'bg-blue-500',
    },
    {
      title: 'Tipos de Habitación',
      description: 'Configurar tipos, precios y capacidades',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
      to: ROUTES.TIPOS_HABITACION,
      color: 'bg-indigo-500',
    },
    {
      title: 'Tarifas',
      description: 'Gestionar tarifas por horas y extras',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      to: ROUTES.TARIFAS,
      color: 'bg-green-500',
    },
    {
      title: 'Productos',
      description: 'Inventario de productos para venta',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      to: ROUTES.PRODUCTOS,
      color: 'bg-yellow-500',
    },
    {
      title: 'Usuarios',
      description: 'Registrar y administrar empleados',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      to: ROUTES.USUARIOS,
      color: 'bg-purple-500',
    },
    {
      title: 'Caja',
      description: 'Movimientos, cortes y ventas',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      to: ROUTES.CAJA,
      color: 'bg-pink-500',
    },
    {
      title: 'Turnos',
      description: 'Historial de turnos y cierres',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      to: ROUTES.TURNOS,
      color: 'bg-teal-500',
    },
    {
      title: 'Reportes',
      description: 'Estadísticas generales',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      to: ROUTES.REPORTES,
      color: 'bg-gray-500',
    },
    {
      title: 'Modo Empleado',
      description: 'Acceder al panel de operaciones (Ventas/Turnos)',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      to: ROUTES.PANEL_EMPLEADO,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 md:h-20"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">
            Bienvenido, {user?.first_name || 'Administrador'}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 group"
          >
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}