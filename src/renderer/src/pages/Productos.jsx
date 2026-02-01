import { useState } from 'react'
import { useProductos } from '@/features/productos/hooks/useProductos'
import ProductoModal from '@/features/productos/components/ProductoModal'

export default function Productos() {
  const {
    productos,
    isLoading,
    error,
    createProducto,
    updateProducto,
    toggleActivo,
    deleteProducto,
    isCreating,
    isUpdating,
    isDeleting,
  } = useProductos()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [productoToDelete, setProductoToDelete] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroStock, setFiltroStock] = useState('')
  const [busqueda, setBusqueda] = useState('')

  // Abrir modal para crear
  const handleCreate = () => {
    setSelectedProducto(null)
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const handleEdit = (producto) => {
    setSelectedProducto(producto)
    setIsModalOpen(true)
  }

  // Guardar (crear o actualizar)
  const handleSave = (formData) => {
    if (selectedProducto) {
      // Actualizar
      updateProducto(
        { id: selectedProducto.id, data: formData },
        {
          onSuccess: () => {
            setIsModalOpen(false)
            setSelectedProducto(null)
          },
        }
      )
    } else {
      // Crear
      createProducto(formData, {
        onSuccess: () => {
          setIsModalOpen(false)
        },
      })
    }
  }

  // Activar/Desactivar
  const handleToggleActivo = (producto) => {
    toggleActivo({
      id: producto.id,
      data: { activo: !producto.activo },
    })
  }

  // Confirmar eliminación
  const handleDeleteConfirm = () => {
    if (productoToDelete) {
      deleteProducto(productoToDelete.id, {
        onSuccess: () => {
          setProductoToDelete(null)
        },
      })
    }
  }

  // Filtrar productos
  const productosFiltrados = productos.filter((prod) => {
    const cumpleBusqueda = !busqueda || prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleEstado = !filtroEstado || (filtroEstado === 'activo' ? prod.activo : !prod.activo)
    const cumpleStock = !filtroStock || 
      (filtroStock === 'bajo' ? prod.stock < 10 : 
       filtroStock === 'sin-stock' ? prod.stock === 0 : 
       prod.stock >= 10)
    return cumpleBusqueda && cumpleEstado && cumpleStock
  })

  // Formatear precio
  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  // Calcular valor total del inventario
  const valorTotal = productos.reduce((sum, p) => sum + (parseFloat(p.precio) * p.stock), 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
            <p className="text-gray-600 mt-2">Gestiona el inventario de productos vendibles</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
          </button>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Producto
            </label>
            <input
              type="text"
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="filtroEstado" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="filtroEstado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>

          <div>
            <label htmlFor="filtroStock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <select
              id="filtroStock"
              value={filtroStock}
              onChange={(e) => setFiltroStock(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="">Todos</option>
              <option value="bajo">Stock Bajo (&lt;10)</option>
              <option value="sin-stock">Sin Stock (0)</option>
              <option value="normal">Stock Normal (≥10)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Total Productos</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{productos.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Productos Activos</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {productos.filter(p => p.activo).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {productos.filter(p => p.stock < 10 && p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-500">Valor Inventario</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {formatPrecio(valorTotal)}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error al cargar productos</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {busqueda || filtroEstado || filtroStock 
                      ? 'No se encontraron productos con los filtros aplicados'
                      : 'No hay productos registrados'}
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{producto.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-green-600">{formatPrecio(producto.precio)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${
                          producto.stock === 0 ? 'text-red-600' :
                          producto.stock < 10 ? 'text-yellow-600' :
                          'text-gray-900'
                        }`}>
                          {producto.stock}
                        </span>
                        {producto.stock < 10 && (
                          <svg className="w-4 h-4 ml-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          producto.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {producto.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(producto.fecha_creacion).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Editar */}
                        <button
                          onClick={() => handleEdit(producto)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Activar/Desactivar */}
                        <button
                          onClick={() => handleToggleActivo(producto)}
                          className={`${
                            producto.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={producto.activo ? 'Desactivar' : 'Activar'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {producto.activo ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </button>

                        {/* Eliminar */}
                        <button
                          onClick={() => setProductoToDelete(producto)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Crear/Editar */}
      <ProductoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProducto(null)
        }}
        onSave={handleSave}
        producto={selectedProducto}
        isLoading={isCreating || isUpdating}
      />

      {/* Modal de Confirmación de Eliminación */}
      {productoToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar el producto{' '}
              <span className="font-semibold">"{productoToDelete.nombre}"</span>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setProductoToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}