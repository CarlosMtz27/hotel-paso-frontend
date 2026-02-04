import { useState, useEffect } from 'react'

/**
 * Modal para cerrar una estancia
 */
export default function CerrarEstanciaModal({ 
  isOpen, 
  onClose, 
  onSave, 
  estancia = null,
  isLoading = false 
}) {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (isOpen && estancia) {
      // Verificar si la estancia está por vencer o ya venció
      const now = new Date()
      const salidaProgramada = new Date(estancia.hora_salida_programada)
      const diff = salidaProgramada - now
      
      // Mostrar advertencia si faltan menos de 30 min o ya pasó el tiempo
      setShowWarning(diff < 30 * 60 * 1000)
    }
  }, [isOpen, estancia])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      estancia_id: estancia.id,
    })
  }

  if (!isOpen) return null

  // Calcular duración total
  const horaEntrada = estancia?.hora_entrada ? new Date(estancia.hora_entrada) : null
  const horaSalida = new Date()
  const duracionMs = horaEntrada ? horaSalida - horaEntrada : 0
  const duracionHoras = Math.floor(duracionMs / (1000 * 60 * 60))
  const duracionMinutos = Math.floor((duracionMs % (1000 * 60 * 60)) / (1000 * 60))

  // Verificar si excedió el tiempo
  const salidaProgramada = estancia?.hora_salida_programada ? new Date(estancia.hora_salida_programada) : null
  const tiempoExcedido = salidaProgramada && horaSalida > salidaProgramada
  const excedidoMs = tiempoExcedido ? horaSalida - salidaProgramada : 0
  const excedidoHoras = Math.floor(excedidoMs / (1000 * 60 * 60))
  const excedidoMinutos = Math.floor((excedidoMs % (1000 * 60 * 60)) / (1000 * 60))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Cerrar Estancia
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Habitación {estancia?.habitacion_numero}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Resumen de la Estancia */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Resumen de la Estancia</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Hora de entrada:</span>
                <span className="font-medium">
                  {horaEntrada?.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hora de salida programada:</span>
                <span className="font-medium">
                  {salidaProgramada?.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-300">
                <span>Duración total:</span>
                <span className="font-bold">{duracionHoras}h {duracionMinutos}m</span>
              </div>
            </div>
          </div>

          {/* Advertencia si excedió el tiempo */}
          {tiempoExcedido && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-red-800">
                    ⚠️ Tiempo Excedido
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    El cliente excedió el tiempo por <span className="font-bold">{excedidoHoras}h {excedidoMinutos}m</span>.
                    {excedidoHoras >= 1 && (
                      <span className="block mt-1">
                        Considera agregar horas extras antes de cerrar.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3 text-sm text-blue-700">
                <p>Al cerrar la estancia:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>La habitación quedará disponible para limpieza</li>
                  <li>Se registrará la hora de salida real</li>
                  <li>Los cobros ya fueron registrados al abrir y agregar horas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Cerrando...' : 'Cerrar Estancia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}