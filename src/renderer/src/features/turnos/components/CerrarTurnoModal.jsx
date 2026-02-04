import { useState, useEffect } from 'react'
import MovimientosCajaTurno from '@/features/ventas/components/MovimientosCajaTurno'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
/**
 * Modal para cerrar el turno activo.
 */
export default function CerrarTurnoModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  turnoActivo = null,
  movimientos = [],
  isLoadingMovimientos = false
}) {
  const [formData, setFormData] = useState({
    efectivo_reportado: '',
    sueldo: ''
  })

  const [errors, setErrors] = useState({})
  const [showMovimientos, setShowMovimientos] = useState(false)

  // Resetear el formulario cuando el modal se abre/cierra
  useEffect(() => {
    if (isOpen) {
      setFormData({
        efectivo_reportado: '',
        sueldo: ''
      })
      setErrors({})
      setShowMovimientos(false)
    }
  }, [isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (formData.efectivo_reportado === '' || parseFloat(formData.efectivo_reportado) < 0) {
      newErrors.efectivo_reportado = 'El efectivo debe ser un número mayor o igual a 0'
    }
    if (formData.sueldo === '' || parseFloat(formData.sueldo) < 0) {
      newErrors.sueldo = 'El sueldo debe ser un número mayor o igual a 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      efectivo_reportado: parseFloat(formData.efectivo_reportado),
      sueldo: parseFloat(formData.sueldo)
    })
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Reporte de Cierre de Turno', 14, 22)
    doc.setFontSize(11)
    doc.setTextColor(100)

    // Info del turno
    doc.text(`Usuario: ${turnoActivo?.usuario_nombre || 'N/A'}`, 14, 32)
    doc.text(`Fecha de Inicio: ${turnoActivo ? formatDate(turnoActivo.fecha_inicio) : 'N/A'}`, 14, 38)
    doc.text(`Fecha de Cierre: ${formatDate(new Date().toISOString())}`, 14, 44)

    // Tabla de movimientos
    const tableColumn = ["Hora", "Tipo", "Descripción", "Método Pago", "Monto"];
    const tableRows = [];

    movimientos.forEach(mov => {
      const movData = [
        formatTime(mov.fecha),
        mov.tipo,
        mov.descripcion || mov.producto_nombre || mov.estancia_info || '-',
        mov.metodo_pago || '-',
        formatCurrency(mov.monto)
      ];
      tableRows.push(movData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 8 },
    })

    // Totales
    const finalTableY = doc.lastAutoTable?.finalY || 50
    doc.setFontSize(10)
    doc.text('Resumen Financiero', 14, finalTableY + 10)

    const efectivoReportado = parseFloat(formData.efectivo_reportado) || 0
    const diferencia = efectivoReportado - efectivoEsperado

    const resumen = [
        ['Caja Inicial:', formatCurrency(turnoActivo?.caja_inicial)],
        ['Ingresos por Estancias:', formatCurrency(totalEstancias)],
        ['Ingresos por Productos:', formatCurrency(totalProductos)],
        ['Total Ingresos:', formatCurrency(totalIngresos)],
        ['Sueldo Descontado:', `-${formatCurrency(totalSueldo)}`],
        ['Efectivo Esperado en Caja:', formatCurrency(efectivoEsperado)],
        ['Efectivo Reportado:', formatCurrency(efectivoReportado)],
        ['Diferencia:', formatCurrency(diferencia)],
    ]

    doc.autoTable({
      body: resumen,
      startY: finalTableY + 12,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 1.5 },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' }
      }
    })

    doc.save(`reporte_turno_${turnoActivo?.id || 'sin_turno'}_${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value || 0)

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })

  if (!isOpen) return null

  // Cálculos de totales
  const totalEstancias = movimientos
    .filter((m) => m.tipo === 'ESTANCIA')
    .reduce((sum, m) => sum + parseFloat(m.monto), 0)
  const totalProductos = movimientos
    .filter((m) => m.tipo === 'PRODUCTO')
    .reduce((sum, m) => sum + parseFloat(m.monto), 0)
  const totalIngresos = totalEstancias + totalProductos
  const totalSueldo = parseFloat(formData.sueldo) || 0
  const efectivoEsperado = (turnoActivo?.caja_inicial || 0) + totalIngresos - totalSueldo

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${showMovimientos ? 'max-w-3xl' : 'max-w-md'} mx-4 transition-all duration-300 max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Cerrar Turno</h2>
          <button onClick={onClose} disabled={isLoading} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Resumen del Turno */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Resumen del Turno Actual</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Usuario:</span>
              <span className="font-medium text-gray-800">{turnoActivo?.usuario_nombre || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fecha de Inicio:</span>
              <span className="font-medium text-gray-800">{turnoActivo ? formatDate(turnoActivo.fecha_inicio) : 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Caja Inicial:</span>
              <span className="font-medium text-green-600">{turnoActivo ? formatCurrency(turnoActivo.caja_inicial) : '$0.00'}</span>
            </div>
          </div>

          {/* Botón para ver movimientos */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowMovimientos(!showMovimientos)}
              className="w-full text-center text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
            >
              {showMovimientos ? 'Ocultar Movimientos' : 'Ver Movimientos y Totales'}
            </button>
          </div>

          {/* Sección de Movimientos y Totales */}
          {showMovimientos && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Detalle de Movimientos</h3>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-lg text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Descargar PDF
                </button>
              </div>
              <MovimientosCajaTurno movimientos={movimientos} isLoading={isLoadingMovimientos} />
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Total Ingresos:</span> <span className="font-semibold text-gray-800">{formatCurrency(totalIngresos)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Sueldo a Descontar:</span> <span className="font-semibold text-red-600">-{formatCurrency(totalSueldo)}</span></div>
                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t"><span className="text-gray-900">Efectivo Esperado:</span> <span className="text-green-700">{formatCurrency(efectivoEsperado)}</span></div>
              </div>
            </div>
          )}

          {/* Efectivo Reportado */}
          <div>
            <label htmlFor="efectivo_reportado" className="block text-sm font-medium text-gray-700 mb-1">
              Efectivo Reportado (en caja) *
            </label>
            <input
              type="number"
              id="efectivo_reportado"
              name="efectivo_reportado"
              value={formData.efectivo_reportado}
              onChange={handleChange}
              disabled={isLoading}
              min="0" step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.efectivo_reportado ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: 1250.50"
            />
            {errors.efectivo_reportado && <p className="mt-1 text-sm text-red-600">{errors.efectivo_reportado}</p>}
          </div>

          {/* Sueldo */}
          <div>
            <label htmlFor="sueldo" className="block text-sm font-medium text-gray-700 mb-1">
              Sueldo a Descontar *
            </label>
            <input
              type="number"
              id="sueldo"
              name="sueldo"
              value={formData.sueldo}
              onChange={handleChange}
              disabled={isLoading}
              min="0" step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.sueldo ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: 300.00"
            />
            {errors.sueldo && <p className="mt-1 text-sm text-red-600">{errors.sueldo}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
              {isLoading ? 'Cerrando...' : 'Cerrar Turno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
