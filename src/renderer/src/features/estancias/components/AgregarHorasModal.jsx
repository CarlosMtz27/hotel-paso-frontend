import { useState, useEffect } from 'react'

const METODOS_PAGO = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
]

/**
 * Modal para agregar horas extras a una estancia
 */
export default function AgregarHorasModal({ 
  isOpen, 
  onClose, 
  onSave, 
  estancia = null,
  isLoading = false 
}) {
  const [formData, setFormData] = useState({
    cantidad_horas: '1',
    precio_hora: '',
    metodo_pago: 'EFECTIVO',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setFormData({
        cantidad_horas: '1',
        precio_hora: '',
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
    
    if (!formData.cantidad_horas || parseInt(formData.cantidad_horas) < 1) {
      newErrors.cantidad_horas = 'Debe ser al menos 1 hora'
    }
    
    if (!formData.precio_hora || parseFloat(formData.precio_hora) <= 0) {
      newErrors.precio_hora = 'El precio debe ser mayor a 0'
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
      estancia_id: estancia.id,
      cantidad_horas: parseInt(formData.cantidad_horas),
      precio_hora: parseFloat(formData.precio_hora),
      metodo_pago: formData.metodo_pago,
    })
  }

  if (!isOpen) return null

  const totalCobro = formData.cantidad_horas && formData.precio_hora 
    ? (parseInt(formData.cantidad_horas) * parseFloat(formData.precio_hora)).toFixed(2)
    : '0.00'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Agregar Horas Extras
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cantidad de Horas */}
          <div>
            <label htmlFor="cantidad_horas" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad de Horas *
            </label>
            <input
              type="number"
              id="cantidad_horas"
              name="cantidad_horas"
              value={formData.cantidad_horas}
              onChange={handleChange}
              disabled={isLoading}
              min="1"
              step="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                errors.cantidad_horas ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cantidad_horas && (
              <p className="mt-1 text-sm text-red-600">{errors.cantidad_horas}</p>
            )}
          </div>

          {/* Precio por Hora */}
          <div>
            <label htmlFor="precio_hora" className="block text-sm font-medium text-gray-700 mb-1">
              Precio por Hora (MXN) *
            </label>
            <input
              type="number"
              id="precio_hora"
              name="precio_hora"
              value={formData.precio_hora}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                errors.precio_hora ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="150.00"
            />
            {errors.precio_hora && (
              <p className="mt-1 text-sm text-red-600">{errors.precio_hora}</p>
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

          {/* Resumen del Cobro */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Resumen del Cobro</h3>
            <div className="space-y-1 text-sm text-yellow-800">
              <p>Horas extras: <span className="font-medium">{formData.cantidad_horas}</span></p>
              <p>Precio por hora: <span className="font-medium">${formData.precio_hora || '0.00'}</span></p>
              <p className="text-base pt-2 border-t border-yellow-300">
                Total a cobrar: <span className="font-bold text-lg">${totalCobro}</span>
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="ml-3 text-sm text-blue-700">
                Se extenderá el tiempo de la estancia y se registrará un nuevo movimiento en caja.
              </p>
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
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Agregando...' : 'Agregar Horas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}