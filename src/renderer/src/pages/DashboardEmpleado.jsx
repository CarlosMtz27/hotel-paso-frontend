import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useHabitaciones } from '@/features/habitaciones/hooks/useHabitaciones'
import { useEstancias } from '@/features/estancias/hooks/useEstancias'
import { useTurnos } from '@/features/turnos/hooks/useTurnos'
import { useCaja } from '@/features/ventas/hooks/useCaja'
import { useVentas } from '@/features/ventas/hooks/useVentas'
import LoadingScreen from '@/components/common/LoadingScreen'
import IniciarTurnoView from '@/features/turnos/components/IniciarTurnoView'
import CerrarTurnoModal from '@/features/turnos/components/CerrarTurnoModal'
import AbrirEstanciaModal from '@/features/estancias/components/AbrirEstanciaModal'
import AgregarHorasModal from '@/features/estancias/components/AgregarHorasModal'
import CerrarEstanciaModal from '@/features/estancias/components/CerrarEstanciaModal'
import CountdownTimer from '@/features/estancias/components/CountdownTimer'
import MovimientosCajaTurno from '@/features/ventas/components/MovimientosCajaTurno'
import VenderProductoModal from '@/features/ventas/components/VenderProductoModal'


/**
 * Componente que muestra el panel de control de habitaciones.
 * Se renderiza solo cuando hay un turno activo.
 */
function DashboardGrid({ onCerrarTurnoClick, movimientosCaja, isLoadingMovimientos }) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const {
    habitaciones,
    isLoading: isLoadingHabitaciones,
    marcarDisponible, // Usaremos la nueva mutación específica
    isMarcandoDisponible // Y su estado de carga
  } = useHabitaciones()
  const {
    estancias,
    abrirEstancia,
    agregarHoras,
    cerrarEstancia,
    isAbriendo,
    isAgregandoHoras,
    isCerrando
  } = useEstancias()
   const {
    venderProducto,
    isVendiendo
  } = useVentas()


  const [modalAbrirOpen, setModalAbrirOpen] = useState(false)
  const [modalAgregarHorasOpen, setModalAgregarHorasOpen] = useState(false)
  const [modalCerrarOpen, setModalCerrarOpen] = useState(false)
    const [modalVentaOpen, setModalVentaOpen] = useState(false)
  const [selectedHabitacion, setSelectedHabitacion] = useState(null)
  const [selectedEstancia, setSelectedEstancia] = useState(null)
  const [updatingHabitacionId, setUpdatingHabitacionId] = useState(null)

  // Obtener estancia activa para una habitación
  const getEstanciaActiva = (habitacion) => {
    // Se busca la estancia activa comparando el número de la habitación.
    return estancias.find((e) => e.habitacion_numero === habitacion.numero && e.activa)
  }

  // Determinar estado de la habitación
  const getEstadoHabitacion = (habitacion) => {
    const estanciaActiva = getEstanciaActiva(habitacion)
    if (estanciaActiva) return 'OCUPADA'
    if (habitacion.estado === 'LIMPIEZA') return 'LIMPIEZA'
    if (!habitacion.activa) return 'MANTENIMIENTO'
    return 'DISPONIBLE'
  }

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

  // Handlers
  const handleAbrirEstancia = (habitacion) => {
    setSelectedHabitacion(habitacion)
    setModalAbrirOpen(true)
  }

  const handleSaveAbrirEstancia = (data) => {
    abrirEstancia(data, {
      onSuccess: () => {
        setModalAbrirOpen(false)
        setSelectedHabitacion(null)
      }
    })
  }

  const handleAgregarHoras = (estancia) => {
    setSelectedEstancia(estancia)
    setModalAgregarHorasOpen(true)
  }

  const handleSaveAgregarHoras = (data) => {
    agregarHoras(data, {
      onSuccess: () => {
        setModalAgregarHorasOpen(false)
        setSelectedEstancia(null)
        // Invalidar queries para refrescar la tabla de movimientos y los totales del turno
        queryClient.invalidateQueries({ queryKey: ['caja-movimientos'] })
        queryClient.invalidateQueries({ queryKey: ['activeTurno'] })
      }
    })
  }

  const handleCerrarEstancia = (estancia) => {
    setSelectedEstancia(estancia)
    setModalCerrarOpen(true)
  }

  const handleSaveCerrarEstancia = (data) => {
    cerrarEstancia(data, {
      onSuccess: () => {
        setModalCerrarOpen(false)
        setSelectedEstancia(null)
        // Invalidar queries para refrescar la tabla de movimientos y los totales del turno
        queryClient.invalidateQueries({ queryKey: ['caja-movimientos'] })
        queryClient.invalidateQueries({ queryKey: ['activeTurno'] })
      }
    })
  }

  const handleMarcarDisponible = (habitacion) => {
    setUpdatingHabitacionId(habitacion.id)
    // Llamamos a la nueva función del hook que hace POST al endpoint correcto
    marcarDisponible(habitacion.id, {
      onSettled: () => {
        setUpdatingHabitacionId(null)
      }
    })
  }
 // Handler Venta de Productos
  const handleVenderProductos = async (ventas) => {
    // Para cumplir con el requisito del backend, si un producto tiene una cantidad
    // mayor a 1, lo descomponemos en múltiples ventas individuales de cantidad 1.
    const ventasIndividuales = []
    ventas.forEach((venta) => {
      for (let i = 0; i < venta.cantidad; i++) {
        ventasIndividuales.push({
          ...venta,
          cantidad: 1 // Cada petición a la API debe tener cantidad 1.
        })
      }
    })

    try {
      // Procesamos cada venta de forma secuencial para evitar el error "database is locked"
      // que ocurre con SQLite cuando se realizan múltiples escrituras concurrentes.
      for (const venta of ventasIndividuales) {
        // `await` asegura que esperamos a que una venta se complete antes de iniciar la siguiente.
        await venderProducto(venta)
      }

      setModalVentaOpen(false)
    } catch (error) {
      console.error('Ocurrió un error al procesar una de las ventas:', error)
    }
  }
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user?.username || user?.first_name || 'Usuario'}
          </h2>
          <p className="text-gray-600 mt-2">Panel de Control de Habitaciones</p>
        </div>
        <button
          onClick={onCerrarTurnoClick}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar Turno
        </button>
      </div>

      {/* Loading */}
      {isLoadingHabitaciones && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando habitaciones...</p>
        </div>
      )}

      {/* Grid de Habitaciones */}
      {!isLoadingHabitaciones && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {habitaciones.map((habitacion) => {
            const estado = getEstadoHabitacion(habitacion)
            const estanciaActiva = getEstanciaActiva(habitacion)
            const isCurrentHabitacionUpdating =
              isMarcandoDisponible && updatingHabitacionId === habitacion.id

            return (
              <div
                key={habitacion.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg"
              >
                {/* Header con estado */}
                <div className={`${getEstadoColor(estado)} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium opacity-90">Habitación</p>
                      <p className="text-3xl font-bold">{habitacion.numero}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium opacity-90">Estado</p>
                      <p className="text-sm font-semibold">{getEstadoTexto(estado)}</p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Tipo:</span> {habitacion.tipo_nombre}
                  </p>

                  {/* Temporizador para habitaciones ocupadas */}
                  {estado === 'OCUPADA' && estanciaActiva && (
                    <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs text-yellow-800 font-medium mb-1">Tiempo Restante</p>
                      <CountdownTimer
                        horaSalidaProgramada={estanciaActiva.hora_salida_programada}
                      />
                      <p className="text-xs text-yellow-700 mt-2">
                        Sale:{' '}
                        {new Date(estanciaActiva.hora_salida_programada).toLocaleTimeString(
                          'es-MX',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )}
                      </p>
                    </div>
                  )}

                  {/* Acciones según estado */}
                  <div className="mt-4 space-y-2">
                    {estado === 'DISPONIBLE' && (
                      <button
                        onClick={() => handleAbrirEstancia(habitacion)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Registrar Estancia
                      </button>
                    )}

                    {estado === 'OCUPADA' && estanciaActiva && (
                      <>
                        <button
                          onClick={() => handleAgregarHoras(estanciaActiva)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Agregar Hora Extra
                        </button>
                        <button
                          onClick={() => handleCerrarEstancia(estanciaActiva)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          Cerrar Estancia
                        </button>
                      </>
                    )}

                    {estado === 'LIMPIEZA' && (
                      <button
                        onClick={() => handleMarcarDisponible(habitacion)}
                        disabled={isCurrentHabitacionUpdating}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-cyan-400 disabled:cursor-wait"
                      >
                        {isCurrentHabitacionUpdating
                          ? 'Actualizando...'
                          : 'Marcar como Disponible'}
                      </button>
                    )}

                    {estado === 'MANTENIMIENTO' && (
                      <button
                        disabled
                        className="w-full bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      >
                        En Mantenimiento
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    {/* Sección de Productos */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Venta de Productos
          </h3>
          <button
            onClick={() => setModalVentaOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Vender Productos
          </button>
        </div>
        <p className="text-gray-500">
          Haz click en el botón para abrir el punto de venta
        </p>
      </div>

      {/* Sección de Movimientos de Caja */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Movimientos de Caja del Turno
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Aquí se listan todas las transacciones (ventas de productos, cobros de estancias, etc.)
          realizadas durante este turno.
        </p>
        <MovimientosCajaTurno movimientos={movimientosCaja} isLoading={isLoadingMovimientos} />
      </div>

      {/* Modales */}
      <AbrirEstanciaModal
        isOpen={modalAbrirOpen}
        onClose={() => {
          setModalAbrirOpen(false)
          setSelectedHabitacion(null)
        }}
        onSave={handleSaveAbrirEstancia}
        habitacion={selectedHabitacion}
        isLoading={isAbriendo}
      />

      <AgregarHorasModal
        isOpen={modalAgregarHorasOpen}
        onClose={() => {
          setModalAgregarHorasOpen(false)
          setSelectedEstancia(null)
        }}
        onSave={handleSaveAgregarHoras}
        estancia={selectedEstancia}
        isLoading={isAgregandoHoras}
      />

      <CerrarEstanciaModal
        isOpen={modalCerrarOpen}
        onClose={() => {
          setModalCerrarOpen(false)
          setSelectedEstancia(null)
        }}
        onSave={handleSaveCerrarEstancia}
        estancia={selectedEstancia}
        isLoading={isCerrando}
      />
      <VenderProductoModal
        isOpen={modalVentaOpen}
        onClose={() => setModalVentaOpen(false)}
        onSave={handleVenderProductos}
        isLoading={isVendiendo}
      />
    </div>
  )
}

/**
 * Página principal para el empleado.
 * Actúa como un controlador que decide si mostrar la vista para iniciar turno
 * o el panel de control de habitaciones.
 */
export default function DashboardEmpleado() {
  const {
    hasActiveTurno,
    isLoadingActive,
    iniciarTurno,
    isIniciando,
    activeTurno,
    cerrarTurno,
    isCerrando
  } = useTurnos({ fetchActive: true, fetchList: false })

  // Obtener los movimientos de caja para el turno activo
  const {
    movimientos,
    isLoadingMovimientos
  } = useCaja({ turnoId: activeTurno?.id })

  const [isCerrarModalOpen, setIsCerrarModalOpen] = useState(false)

  const handleCerrarTurno = (formData) => {
    cerrarTurno(formData, {
      onSuccess: () => {
        setIsCerrarModalOpen(false)
        // La vista se actualizará automáticamente porque el hook `useTurnos`
        // invalida la query 'activeTurno', lo que causa una re-renderización.
      },
      onError: (error) => {
        // Opcional: mostrar un toast de error
        console.error('Error al cerrar turno:', error)
      }
    })
  }

  // Mientras se verifica si hay un turno activo, mostrar pantalla de carga.
  if (isLoadingActive) {
    return <LoadingScreen message="Verificando turno..." />
  }

  // Si hay un turno activo, mostrar el panel de control principal.
  if (hasActiveTurno) {
    return (
      <>
        <DashboardGrid
          onCerrarTurnoClick={() => setIsCerrarModalOpen(true)}
          movimientosCaja={movimientos}
          isLoadingMovimientos={isLoadingMovimientos}
        />
        <CerrarTurnoModal
          isOpen={isCerrarModalOpen}
          onClose={() => setIsCerrarModalOpen(false)}
          onSave={handleCerrarTurno}
          isLoading={isCerrando}
          turnoActivo={activeTurno}
          movimientos={movimientos}
          isLoadingMovimientos={isLoadingMovimientos}
        />
      </>
    )
  }

  // Si no hay turno activo, mostrar la vista para que el empleado inicie uno.
  return <IniciarTurnoView onIniciarTurno={iniciarTurno} isIniciando={isIniciando} />
}