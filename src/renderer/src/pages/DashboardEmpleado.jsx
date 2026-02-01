import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function DashboardEmpleado() {
  const { user } = useAuth()
  const [selectedHabitacion, setSelectedHabitacion] = useState(null)

  // Mock data - después lo conectaremos con el backend
  const habitaciones = [
    { id: 1, numero: '101', tipo_nombre: 'Sencilla', estado: 'DISPONIBLE' },
    { id: 2, numero: '102', tipo_nombre: 'Doble', estado: 'OCUPADA', hora_salida: '16:00' },
    { id: 3, numero: '103', tipo_nombre: 'Suite', estado: 'LIMPIEZA' },
    { id: 4, numero: '104', tipo_nombre: 'Sencilla', estado: 'MANTENIMIENTO' },
    { id: 5, numero: '201', tipo_nombre: 'Doble', estado: 'DISPONIBLE' },
    { id: 6, numero: '202', tipo_nombre: 'Suite', estado: 'OCUPADA', hora_salida: '14:30' },
  ]

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'bg-green-500'
      case 'OCUPADA':
        return 'bg-yellow-500'
      case 'LIMPIEZA':
        return 'bg-blue-500'
      case 'MANTENIMIENTO':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible'
      case 'OCUPADA':
        return 'Ocupada'
      case 'LIMPIEZA':
        return 'En Limpieza'
      case 'MANTENIMIENTO':
        return 'Mantenimiento'
      default:
        return estado
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.username || user?.first_name || 'Usuario'}
        </h2>
        <p className="text-gray-600 mt-2">
          Panel de Control de Habitaciones
        </p>
      </div>

      {/* Grid de Habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {habitaciones.map((habitacion) => (
          <div
            key={habitacion.id}
            className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg ${
              selectedHabitacion?.id === habitacion.id ? 'ring-2 ring-indigo-600' : ''
            }`}
            onClick={() => setSelectedHabitacion(habitacion)}
          >
            {/* Header con estado */}
            <div className={`${getEstadoColor(habitacion.estado)} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium opacity-90">Habitación</p>
                  <p className="text-3xl font-bold">{habitacion.numero}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium opacity-90">Estado</p>
                  <p className="text-sm font-semibold">{getEstadoTexto(habitacion.estado)}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tipo:</span> {habitacion.tipo_nombre}
              </p>

              {habitacion.estado === 'OCUPADA' && habitacion.hora_salida && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-xs text-yellow-800 font-medium mb-1">
                    Hora de Salida Programada
                  </p>
                  <p className="text-xl font-bold text-yellow-900">
                    {habitacion.hora_salida}
                  </p>
                  {/* Aquí irá el temporizador */}
                </div>
              )}

              {/* Acciones según estado */}
              <div className="mt-4">
                {habitacion.estado === 'DISPONIBLE' && (
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Registrar Estancia
                  </button>
                )}

                {habitacion.estado === 'OCUPADA' && (
                  <div className="space-y-2">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Agregar Hora Extra
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Cerrar Estancia
                    </button>
                  </div>
                )}

                {habitacion.estado === 'LIMPIEZA' && (
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Marcar como Disponible
                  </button>
                )}

                {habitacion.estado === 'MANTENIMIENTO' && (
                  <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Finalizar Mantenimiento
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Productos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Venta de Productos
        </h3>
        <p className="text-gray-500">
          Los productos y su gestión estarán disponibles aquí
        </p>
      </div>
    </div>
  )
}