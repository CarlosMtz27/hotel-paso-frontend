import { useState, useEffect } from 'react'
import { useProductos } from '@/features/productos/hooks/useProductos'

const METODOS_PAGO = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
]

/**
 * Modal para vender productos
 */
export default function VenderProductoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading = false 
}) {
  const { productos, isLoading: isLoadingProductos } = useProductos()
  
  const [carrito, setCarrito] = useState([])
  const [selectedProducto, setSelectedProducto] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [metodoPago, setMetodoPago] = useState('EFECTIVO')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      setCarrito([])
      setSelectedProducto('')
      setCantidad('1')
      setMetodoPago('EFECTIVO')
      setErrors({})
    }
  }, [isOpen])

  // Productos activos con stock
  const productosDisponibles = productos.filter(p => p.activo && p.stock > 0)

  // --- Lógica para validación de stock en vivo ---
  // Encuentra el objeto del producto seleccionado
  const productoSeleccionadoObj = productos.find((p) => p.id === parseInt(selectedProducto))
  // Encuentra el item en el carrito para saber cuántos ya se han agregado
  const itemEnCarrito = carrito.find((item) => item.producto.id === parseInt(selectedProducto))
  // Calcula la cantidad máxima que se puede agregar en este momento
  const maxCantidadAgregable = productoSeleccionadoObj
    ? productoSeleccionadoObj.stock - (itemEnCarrito?.cantidad || 0)
    : 1

  // Agregar producto al carrito
  const handleAgregarAlCarrito = () => {
    if (!selectedProducto) {
      setErrors({ producto: 'Selecciona un producto' })
      return
    }

    const producto = productos.find(p => p.id === parseInt(selectedProducto))
    const cantidadNum = parseInt(cantidad)

    if (!producto) return
    if (cantidadNum <= 0 || cantidadNum > producto.stock) {
      setErrors({ cantidad: `Stock disponible: ${producto.stock}` })
      return
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.producto.id === producto.id)
    
    if (itemExistente) {
      // Actualizar cantidad
      const nuevaCantidad = itemExistente.cantidad + cantidadNum
      if (nuevaCantidad > producto.stock) {
        setErrors({ cantidad: `Stock disponible: ${producto.stock}` })
        return
      }
      
      setCarrito(carrito.map(item => 
        item.producto.id === producto.id 
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ))
    } else {
      // Agregar nuevo item
      setCarrito([...carrito, { 
        producto, 
        cantidad: cantidadNum 
      }])
    }

    setSelectedProducto('')
    setCantidad('1')
    setErrors({})
  }

  // Eliminar producto del carrito
  const handleEliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId))
  }

  // Actualizar cantidad en el carrito
  const handleActualizarCantidad = (productoId, nuevaCantidad) => {
    const producto = productos.find(p => p.id === productoId)
    if (nuevaCantidad <= 0 || nuevaCantidad > producto.stock) return

    setCarrito(carrito.map(item =>
      item.producto.id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ))
  }

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((sum, item) => 
      sum + (parseFloat(item.producto.precio) * item.cantidad), 0
    )
  }

  // Procesar venta
  const handleVender = () => {
    if (carrito.length === 0) {
      setErrors({ carrito: 'Agrega al menos un producto' })
      return
    }

    // Enviar cada producto como un movimiento de caja individual
    const ventas = carrito.map(item => ({
      producto_id: item.producto.id,
      cantidad: item.cantidad,
      metodo_pago: metodoPago,
      estancia_id: null, // null porque es venta independiente
    }))

    onSave(ventas)
  }

  const formatPrecio = (precio) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(precio)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Vender Productos
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

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Selección de Productos */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Agregar Productos</h3>

              {/* Producto */}
              <div>
                <label htmlFor="producto" className="block text-sm font-medium text-gray-700 mb-1">
                  Producto
                </label>
                {isLoadingProductos ? (
                  <div className="text-sm text-gray-500">Cargando productos...</div>
                ) : (
                  <select
                    id="producto"
                    value={selectedProducto}
                    onChange={(e) => {
                      setSelectedProducto(e.target.value)
                      setErrors({})
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                      errors.producto ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecciona un producto</option>
                    {productosDisponibles.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre} - {formatPrecio(producto.precio)} (Stock: {producto.stock})
                      </option>
                    ))}
                  </select>
                )}
                {errors.producto && (
                  <p className="mt-1 text-sm text-red-600">{errors.producto}</p>
                )}
              </div>

              {/* Cantidad */}
              <div>
                <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  onChange={(e) => {
                    setCantidad(e.target.value)
                    setErrors({})
                  }}
                  min="1"
                  max={maxCantidadAgregable > 0 ? maxCantidadAgregable : 0}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none ${
                    errors.cantidad ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cantidad && (
                  <p className="mt-1 text-sm text-red-600">{errors.cantidad}</p>
                )}
                {productoSeleccionadoObj && maxCantidadAgregable > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Puedes agregar hasta {maxCantidadAgregable} más. (Stock total:{' '}
                    {productoSeleccionadoObj.stock})
                  </p>
                )}
              </div>

              <button
                onClick={handleAgregarAlCarrito}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Agregar al Carrito
              </button>

              {productosDisponibles.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  No hay productos disponibles con stock
                </div>
              )}
            </div>

            {/* Carrito */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Carrito de Compra</h3>

              {carrito.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                  El carrito está vacío
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {carrito.map((item) => (
                    <div key={item.producto.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.producto.nombre}</p>
                          <p className="text-sm text-gray-600">{formatPrecio(item.producto.precio)} c/u</p>
                        </div>
                        <button
                          onClick={() => handleEliminarDelCarrito(item.producto.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleActualizarCantidad(item.producto.id, item.cantidad - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center disabled:opacity-50"
                            disabled={item.cantidad <= 1}
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.cantidad}</span>
                          <button
                            onClick={() => handleActualizarCantidad(item.producto.id, item.cantidad + 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.cantidad >= item.producto.stock}
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {formatPrecio(parseFloat(item.producto.precio) * item.cantidad)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Método de Pago */}
              {carrito.length > 0 && (
                <div>
                  <label htmlFor="metodo_pago" className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pago
                  </label>
                  <select
                    id="metodo_pago"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    {METODOS_PAGO.map((metodo) => (
                      <option key={metodo.value} value={metodo.value}>
                        {metodo.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Total */}
              {carrito.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-900">Total:</span>
                    <span className="text-2xl font-bold text-green-900">
                      {formatPrecio(calcularTotal())}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {carrito.length} producto{carrito.length !== 1 ? 's' : ''} • {carrito.reduce((sum, item) => sum + item.cantidad, 0)} unidad{carrito.reduce((sum, item) => sum + item.cantidad, 0) !== 1 ? 'es' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Errors */}
          {errors.carrito && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm">{errors.carrito}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleVender}
              disabled={isLoading || carrito.length === 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : (
                `Vender - ${formatPrecio(calcularTotal())}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}