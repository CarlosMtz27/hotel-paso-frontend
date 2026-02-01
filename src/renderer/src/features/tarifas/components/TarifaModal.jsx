import { useState, useEffect } from 'react'
import { useTiposHabitacion } from '@/features/habitaciones/hooks/useTiposHabitacion'

/**
 * Modal para crear/editar Tarifa
 */
export default function TarifaModal({ 
  isOpen, 
  onClose, 
  onSave, 
  tarifa = null,
  isLoading = false 
}) {
  const { tipos, isLoading: isLoadingTipos } = useTiposHabitacion()
  
  const [formData, setFormData] = useState({
    nombre: '',
    tipo_habitacion: '',
    horas: '',
    precio: '',
    es_nocturna: false,
    hora_inicio_nocturna: '',
    hora_fin_nocturna: '',
    activa: true,
  })

  const [errors, setErrors] = useState({})

  // Cargar datos si estamos editando
  useEffect(() => {
    if (tarifa) {
      setFormData({
        nombre: tarifa.nombre || '',
        tipo_habitacion: tarifa.tipo_habitacion || '',
        horas: tarifa.horas || '',
        precio: tarifa.precio || '',
        es_nocturna: tarifa.es_nocturna || false,
        hora_inicio_nocturna: tarifa.hora_inicio_nocturna ? tarifa.hora_inicio_nocturna.substring(0, 5) : '',
        hora_fin_nocturna: tarifa.hora_fin_nocturna ? tarifa.hora_fin_nocturna.substring(0, 5) : '',
        activa: tarifa.activa ?? true,
      })
    } else {
      setFormData({
        nombre: '',
        tipo_habitacion: '',
        horas: '',
        precio: '',
        es_nocturna: false,
        hora_inicio_nocturna: '',
        hora_fin_nocturna: '',
        activa: true,
      })
    }
    setErrors({})
  }, [tarifa, isOpen])

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
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }
    
    if (!formData.tipo_habitacion) {
      newErrors.tipo_habitacion = 'Debes seleccionar un tipo de habitación'
    }
    
    if (!formData.horas || formData.horas <= 0) {
      newErrors.horas = 'Las horas deben ser mayor a 0'
    }
    
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0'
    }
    
    if (formData.es_nocturna) {
      if (!formData.hora_inicio_nocturna) {
        newErrors.hora_inicio_nocturna = 'La hora de inicio es requerida'
      }
      if (!formData.hora_fin_nocturna) {
        newErrors.hora_fin_nocturna = 'La hora de fin es requerida'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    // Preparar datos para enviar
    const dataToSend = {
      nombre: formData.nombre,
      tipo_habitacion: parseInt(formData.tipo_habitacion),
      horas: parseInt(formData.horas),
      precio: parseFloat(formData.precio),
      es_nocturna: formData.es_nocturna,
      activa: formData.activa,
    }
    
    // Agregar horarios nocturnos solo si es nocturna
    if (formData.es_nocturna) {
      dataToSend.hora_inicio_nocturna = formData.hora_inicio_nocturna + ':00'
      dataToSend.hora_fin_nocturna = formData.hora_fin_nocturna + ':00'
    } else {
      dataToSend.hora_inicio_nocturna = null
      dataToSend.hora_fin_nocturna = null
    }
    
    onSave(dataToSend)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            {tarifa ? 'Editar Tarifa' : 'Nueva Tarifa'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Tarifa *
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 3 Horas - Sencilla"
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            {/* Tipo de Habitación */}
            <div>
              <label htmlFor="tipo_habitacion" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Habitación *
              </label>
              {isLoadingTipos ? (
                <div className="text-sm text-gray-500">Cargando tipos...</div>
              ) : (
                <select
                  id="tipo_habitacion"
                  name="tipo_habitacion"
                  value={formData.tipo_habitacion}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                    errors.tipo_habitacion ? 'border-red-500' : 'border-gray-300'
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
              {errors.tipo_habitacion && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo_habitacion}</p>
              )}
            </div>

            {/* Horas */}
            <div>
              <label htmlFor="horas" className="block text-sm font-medium text-gray-700 mb-1">
                Horas *
              </label>
              <input
                type="number"
                id="horas"
                name="horas"
                value={formData.horas}
                onChange={handleChange}
                disabled={isLoading}
                min="1"
                step="1"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                  errors.horas ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="3, 12, 24..."
              />
              {errors.horas && (
                <p className="mt-1 text-sm text-red-600">{errors.horas}</p>
              )}
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio (MXN) *
              </label>
              <input
                type="number"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                disabled={isLoading}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                  errors.precio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="180.00"
              />
              {errors.precio && (
                <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
              )}
            </div>
          </div>

          {/* Es Nocturna */}
          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="es_nocturna"
              name="es_nocturna"
              checked={formData.es_nocturna}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="es_nocturna" className="ml-2 text-sm font-medium text-gray-700">
              Tarifa Nocturna (aplicar horario especial)
            </label>
          </div>

          {/* Horarios Nocturnos (solo si es nocturna) */}
          {formData.es_nocturna && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50 p-4 rounded-lg">
              <div>
                <label htmlFor="hora_inicio_nocturna" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Inicio Nocturna *
                </label>
                <input
                  type="time"
                  id="hora_inicio_nocturna"
                  name="hora_inicio_nocturna"
                  value={formData.hora_inicio_nocturna}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                    errors.hora_inicio_nocturna ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hora_inicio_nocturna && (
                  <p className="mt-1 text-sm text-red-600">{errors.hora_inicio_nocturna}</p>
                )}
              </div>

              <div>
                <label htmlFor="hora_fin_nocturna" className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin Nocturna *
                </label>
                <input
                  type="time"
                  id="hora_fin_nocturna"
                  name="hora_fin_nocturna"
                  value={formData.hora_fin_nocturna}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                    errors.hora_fin_nocturna ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.hora_fin_nocturna && (
                  <p className="mt-1 text-sm text-red-600">{errors.hora_fin_nocturna}</p>
                )}
              </div>
            </div>
          )}

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
              Tarifa activa
            </label>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3 text-sm text-blue-700">
                <p className="font-medium mb-1">Sobre tarifas nocturnas:</p>
                <p>Si marcas esta tarifa como nocturna, solo estará disponible en el rango de horas especificado. Por ejemplo: 22:00 a 08:00.</p>
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
                tarifa ? 'Actualizar' : 'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}