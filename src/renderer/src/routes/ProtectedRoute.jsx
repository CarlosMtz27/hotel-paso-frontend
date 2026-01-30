import { Navigate } from 'react-router-dom'

/**
 * Componente para proteger rutas que requieren autenticación
 */
export default function ProtectedRoute({ children }) {
  // Verificar si hay token de autenticación
  const token = localStorage.getItem('access_token')
  
  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // Si hay token, mostrar el componente hijo
  return children
}