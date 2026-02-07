import { Navigate } from 'react-router-dom'

/**
 * Componente para proteger rutas que requieren autenticación
 */
export default function ProtectedRoute({ children }) {
  // Verificar si hay token de autenticación
  const token = localStorage.getItem('access_token')
  
  // Si no hay token, redirigir a login
  if (!token) {
    window.electron?.setLoginWindow()
    return <Navigate to="/login" replace />
  }
  
   window.electron?.setAuthWindow()
  // Si hay token, mostrar el componente hijo
  return children
}