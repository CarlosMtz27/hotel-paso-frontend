import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { cajaAPI } from '@/api/endpoints'

const TIPOS_MOVIMIENTO = {
  ESTANCIA: 'Estancia',
  EXTRA: 'Hora Extra',
  PRODUCTO: 'Producto',
}

const METODOS_PAGO = {
  EFECTIVO: 'Efectivo',
  TRANSFERENCIA: 'Transferencia',
}

export default function Caja() {
  const [page, setPage] = useState(1)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('')
  const [filtroEstancia, setFiltroEstancia] = useState('')

  // GET movimientos
  const {
    data: movimientos,
    isLoading,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['caja-movimientos', page, filtroTipo, filtroMetodoPago, filtroEstancia],
    queryFn: () => cajaAPI.getMovimientos({
      page,
      tipo: filtroTipo || undefined,
      metodo_pago: filtroMetodoPago || undefined,
      estancia: filtroEstancia || undefined,
    }),
    placeholderData: keepPreviousData,
  })

  // Formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  // Calcular estadísticas
  const listaMovimientos = Array.isArray(movimientos)
    ? movimientos
    : (Array.isArray(movimientos?.results) ? movimientos.results : [])

  const totalCount = movimientos?.count || 0
  const hasNext = !!movimientos?.next
  const hasPrevious = !!movimientos?.previous

  const totalMovimientos = totalCount || listaMovimientos.length
  const totalEfectivo = listaMovimientos
    .filter(m => m.metodo_pago === 'EFECTIVO')
    .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0)
  const totalTransferencia = listaMovimientos
    .filter(m => m.metodo_pago === 'TRANSFERENCIA')
    .reduce((sum, m) => sum + parseFloat(m.monto || 0), 0)
  const totalGeneral = totalEfectivo + totalTransferencia

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Movimientos de Caja</h1>
            <p className="text-gray-600 mt-2">Registro de todos los movimientos de caja</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="filtroTipo" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimiento
            </label>
            <select
              id="filtroTipo"
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              <option value="ESTANCIA">Estancia</option>
              <option value="EXTRA">Hora Extra</option>
              <option value="PRODUCTO">Producto</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtroMetodoPago" className="block text-sm font-medium text-gray-700 mb-1">
              Método de Pago
            </label>
            <select
              id="filtroMetodoPago"
              value={filtroMetodoPago}
              onChange={(e) => {
                setFiltroMetodoPago(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtroEstancia" className="block text-sm font-medium text-gray-700 mb-1">
              ID Estancia
            </label>
            <input
              type="text"
              id="filtroEstancia"
              value={filtroEstancia}
              onChange={(e) => {
                setFiltroEstancia(e.target.value)
                setPage(1)
              }}
              placeholder="Ej: 123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          {(filtroTipo || filtroMetodoPago || filtroEstancia) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroTipo('')
                  setFiltroMetodoPago('')
                  setFiltroEstancia('')
                  setPage(1)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Movimientos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalMovimientos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Efectivo</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {formatPrecio(totalEfectivo)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Transferencia</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {formatPrecio(totalTransferencia)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total General</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {formatPrecio(totalGeneral)}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando movimientos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar movimientos</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estancia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listaMovimientos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No hay movimientos registrados
                    </td>
                  </tr>
                ) : (
                  listaMovimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{movimiento.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          movimiento.tipo === 'ESTANCIA' ? 'bg-blue-100 text-blue-800' :
                          movimiento.tipo === 'EXTRA' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {TIPOS_MOVIMIENTO[movimiento.tipo]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatPrecio(movimiento.monto)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          movimiento.metodo_pago === 'EFECTIVO' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {METODOS_PAGO[movimiento.metodo_pago]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movimiento.turno || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movimiento.estancia || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(movimiento.fecha).toLocaleString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={!hasPrevious || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {page} {totalCount > 0 ? `de ${Math.ceil(totalCount / 10)}` : ''}
              </span>
              <button
                onClick={() => {
                  if (!isPlaceholderData && hasNext) {
                    setPage((old) => old + 1)
                  }
                }}
                disabled={!hasNext || isPlaceholderData || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}