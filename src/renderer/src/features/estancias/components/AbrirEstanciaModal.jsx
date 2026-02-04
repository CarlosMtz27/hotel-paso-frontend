import { useState, useEffect } from 'react'
import { useTarifas } from '@/features/tarifas/hooks/useTarifas'

const METODOS_PAGO = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
]

/**
 * Modal para abrir una nueva estancia
 */
export default function AbrirEstanciaModal({ 
  isOpen, 
  onClose, 
  onSave, 
  habitacion = null,
  isLoading = false 
}) {
  const { tarifas, isLoading: isLoadingTarifas } = useTarifas()
  
  const [formData, setFormData] = useState({
    tarifa_id: '',
    metodo_pago: 'EFECTIVO',
  })

  const [errors, setErrors] = useState({})

  // Reset form cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        tarifa_id: '',
        metodo_pago: 'EFECTIVO',
      })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.tarifa_id) {
      newErrors.tarifa_id = 'Debes seleccionar una tarifa'
    }
    
    if (!formData.metodo_pago) {
      newErrors.metodo_pago = 'Debes seleccionar un método de pago'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    onSave({
      habitacion_id: habitacion.id,
      tarifa_id: parseInt(formData.tarifa_id),
      metodo_pago: formData.metodo_pago,
    })
  }

  if (!isOpen) return null

  // Filtrar tarifas por tipo de habitación
  const tarifasDisponibles = tarifas.filter(
    t => t.activa && t.tipo_habitacion === habitacion?.tipo
  )

  const tarifaSeleccionada = tarifas.find(t => t.id === parseInt(formData.tarifa_id))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Registrar Estancia
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Habitación {habitacion?.numero} - {habitacion?.tipo_nombre}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tarifa */}
          <div>
            <label htmlFor="tarifa_id" className="block text-sm font-medium text-gray-700 mb-1">
              Tarifa *
            </label>
            {isLoadingTarifas ? (
              <div className="text-sm text-gray-500">Cargando tarifas...</div>
            ) : (
              <select
                id="tarifa_id"
                name="tarifa_id"
                value={formData.tarifa_id}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                  errors.tarifa_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona una tarifa</option>
                {tarifasDisponibles.map((tarifa) => (
                  <option key={tarifa.id} value={tarifa.id}>
                    {tarifa.nombre} - {tarifa.horas} hrs - ${tarifa.precio}
                    {tarifa.es_nocturna && ' 🌙'}
                  </option>
                ))}
              </select>
            )}
            {errors.tarifa_id && (
              <p className="mt-1 text-sm text-red-600">{errors.tarifa_id}</p>
            )}
          </div>

          {/* Método de Pago */}
          <div>
            <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago *
            </label>
            <select
              id="metodo_pago"
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                errors.metodo_pago ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {METODOS_PAGO.map((metodo) => (
                <option key={metodo.value} value={metodo.value}>
                  {metodo.label}
                </option>
              ))}
            </select>
            {errors.metodo_pago && (
              <p className="mt-1 text-sm text-red-600">{errors.metodo_pago}</p>
            )}
          </div>

          {/* Resumen */}
          {tarifaSeleccionada && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-900 mb-2">Resumen</h3>
              <div className="space-y-1 text-sm text-indigo-800">
                <p>Duración: <span className="font-medium">{tarifaSeleccionada.horas} horas</span></p>
                <p>Precio: <span className="font-medium text-lg">${tarifaSeleccionada.precio}</span></p>
                <p>Pago: <span className="font-medium">{METODOS_PAGO.find(m => m.value === formData.metodo_pago)?.label}</span></p>
              </div>
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Registrando...' : 'Registrar Estancia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}