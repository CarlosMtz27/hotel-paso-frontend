import { useState, useEffect } from 'react'

/**
 * Modal para iniciar un nuevo turno.
 */
export default function IniciarTurnoModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false
}) {
  const [formData, setFormData] = useState({
    tipo_turno: '',
    caja_inicial: ''
  })

  const [errors, setErrors] = useState({})

  // Resetear el formulario cuando el modal se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setFormData({
        tipo_turno: '',
        caja_inicial: ''
      })
      setErrors({})
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Limpiar error del campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.tipo_turno) {
      newErrors.tipo_turno = 'Debes seleccionar un tipo de turno'
    }

    if (formData.caja_inicial === '' || parseFloat(formData.caja_inicial) < 0) {
      newErrors.caja_inicial = 'La caja inicial debe ser un número mayor o igual a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    const dataToSend = {
      tipo_turno: formData.tipo_turno,
      caja_inicial: parseFloat(formData.caja_inicial)
    }

    onSave(dataToSend)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Iniciar Nuevo Turno</h2>
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
          {/* Tipo de Turno */}
          <div>
            <label htmlFor="tipo_turno" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Turno *
            </label>
            <select
              id="tipo_turno"
              name="tipo_turno"
              value={formData.tipo_turno}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                errors.tipo_turno ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Selecciona un turno</option>
              <option value="DIA">Vespertino</option>
              <option value="NOCHE">Nocturno</option>
            </select>
            {errors.tipo_turno && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo_turno}</p>
            )}
          </div>

          {/* Caja Inicial */}
          <div>
            <label htmlFor="caja_inicial" className="block text-sm font-medium text-gray-700 mb-1">
              Caja Inicial (MXN) *
            </label>
            <input
              type="number"
              id="caja_inicial"
              name="caja_inicial"
              value={formData.caja_inicial}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${
                errors.caja_inicial ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: 500.00"
            />
            {errors.caja_inicial && (
              <p className="mt-1 text-sm text-red-600">{errors.caja_inicial}</p>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="ml-3 text-sm text-blue-700">
                Al iniciar un turno, se registrará la caja inicial y podrás comenzar a operar. No podrás iniciar otro turno hasta que cierres el actual.
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
                  Iniciando...
                </span>
              ) : (
                'Iniciar Turno'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
