import { useState, useEffect } from 'react'
import { useTiposHabitacion } from '../hooks/useTiposHabitacion'

/**
 * Modal para crear/editar Habitación
 */
export default function HabitacionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  habitacion = null,
  isLoading = false 
}) {
  const { tipos, isLoading: isLoadingTipos } = useTiposHabitacion()
  
  const [formData, setFormData] = useState({
    numero: '',
    tipo: '',
    activa: true,
  })

  const [errors, setErrors] = useState({})

  // Cargar datos si estamos editando
  useEffect(() => {
    if (habitacion) {
      setFormData({
        numero: habitacion.numero || '',
        tipo: habitacion.tipo || '',
        activa: habitacion.activa ?? true,
      })
    } else {
      setFormData({
        numero: '',
        tipo: '',
        activa: true,
      })
    }
    setErrors({})
  }, [habitacion, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.numero.trim()) {
      newErrors.numero = 'El número de habitación es requerido'
    }
    
    if (!formData.tipo) {
      newErrors.tipo = 'Debes seleccionar un tipo de habitación'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    // Convertir tipo a número
    const dataToSend = {
      ...formData,
      tipo: parseInt(formData.tipo),
    }
    
    onSave(dataToSend)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {habitacion ? 'Editar Habitación' : 'Nueva Habitación'}
          </h2>
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
          {/* Número */}
          <div>
            <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Habitación *
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                errors.numero ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 101, 202, etc."
            />
            {errors.numero && (
              <p className="mt-1 text-sm text-red-600">{errors.numero}</p>
            )}
          </div>

          {/* Tipo de Habitación */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Habitación *
            </label>
            {isLoadingTipos ? (
              <div className="text-sm text-gray-500">Cargando tipos...</div>
            ) : (
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                  errors.tipo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un tipo</option>
                {tipos
                  .filter(tipo => tipo.activo)
                  .map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
              </select>
            )}
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
            )}
          </div>

          {/* Activa */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activa"
              name="activa"
              checked={formData.activa}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="activa" className="ml-2 text-sm text-gray-700">
              Habitación activa
            </label>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="ml-3 text-sm text-blue-700">
                El número de habitación debe ser único. Los estados de disponibilidad se gestionan desde el panel de empleados.
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
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                habitacion ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}