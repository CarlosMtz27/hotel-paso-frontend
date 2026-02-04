import React from 'react'

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '$0.00'
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function MovimientosCajaTurno({ movimientos, isLoading }) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Cargando movimientos...</p>
      </div>
    )
  }

  if (!movimientos || movimientos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No se han registrado movimientos en este turno.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de pago</th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movimientos.map((mov) => (
            <tr key={mov.id}>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatDate(mov.fecha)}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${mov.tipo === 'PRODUCTO' ? 'bg-blue-100 text-blue-800' : mov.tipo === 'ESTANCIA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {mov.tipo}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-800 truncate max-w-xs">{mov.descripcion || mov.producto_nombre || mov.estancia_info || '-'}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{mov.metodo_pago || '-'}</td>
              <td className={`px-4 py-3 whitespace-nowrap text-right text-sm font-semibold ${parseFloat(mov.monto) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {formatCurrency(mov.monto)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
