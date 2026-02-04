import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cajaAPI } from '@/api/endpoints'

/**
 * Hook para manejar la creación de ventas de productos.
 */
export function useVentas() {
  const queryClient = useQueryClient()

  const createVentaMutation = useMutation({
    // Usamos el endpoint que postea a /api/caja/movimientos/
    mutationFn: cajaAPI.venderProducto,
    onSuccess: () => {
      // Cuando una venta es exitosa, invalidamos las queries que se ven afectadas
      // para que la UI se actualice con los nuevos datos.
      queryClient.invalidateQueries({ queryKey: ['productos'] }) // 1. Para actualizar el stock.
      queryClient.invalidateQueries({ queryKey: ['activeTurno'] }) // 2. Para recalcular los totales del turno.
      queryClient.invalidateQueries({ queryKey: ['caja-movimientos'] }) // 3. Para el historial de caja.
    }
  })

  return {
    // Devolvemos la función `mutateAsync` que retorna una promesa.
    venderProducto: createVentaMutation.mutateAsync,
    isVendiendo: createVentaMutation.isPending,
    ventaError: createVentaMutation.error
  }
}