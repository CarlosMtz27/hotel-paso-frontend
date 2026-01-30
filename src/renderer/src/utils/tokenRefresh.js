import { authAPI } from '@/api/endpoints'

/**
 * Servicio para refrescar el token automáticamente
 */

let refreshTimer = null

/**
 * Decodifica un JWT para obtener su información
 */
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Calcula cuándo expira el token
 */
function getTokenExpiration(token) {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return null
  
  // exp viene en segundos, convertir a milisegundos
  return decoded.exp * 1000
}

/**
 * Refresca el token antes de que expire
 */
async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      console.log('No refresh token available')
      stopTokenRefresh()
      return false
    }

    console.log('🔄 Refreshing access token...')
    
    const data = await authAPI.refreshToken(refreshToken)
    
    // Guardar nuevo access token
    localStorage.setItem('access_token', data.access)
    
    // Si el backend también devuelve un nuevo refresh token
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh)
    }
    
    console.log('✅ Token refreshed successfully')
    
    // Programar el próximo refresh
    scheduleTokenRefresh(data.access)
    
    return true
  } catch (error) {
    console.error('❌ Error refreshing token:', error)
    
    // Si falla, limpiar tokens y detener el refresh
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    stopTokenRefresh()
    
    // Redirigir al login
    window.location.href = '/login'
    
    return false
  }
}

/**
 * Programa el próximo refresh del token
 * Se ejecuta 1 minuto antes de que expire el token
 */
function scheduleTokenRefresh(accessToken) {
  // Limpiar timer anterior si existe
  if (refreshTimer) {
    clearTimeout(refreshTimer)
  }

  const expiration = getTokenExpiration(accessToken)
  
  if (!expiration) {
    console.warn('Could not get token expiration')
    return
  }

  const now = Date.now()
  const timeUntilExpiration = expiration - now
  
  // Refrescar 1 minuto antes de que expire (60000 ms)
  const timeUntilRefresh = timeUntilExpiration - 60000
  
  // Si el token ya expiró o está por expirar muy pronto, refrescar inmediatamente
  if (timeUntilRefresh <= 0) {
    console.log('Token expiring soon, refreshing immediately')
    refreshAccessToken()
    return
  }

  console.log(`⏰ Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000)} seconds`)
  
  refreshTimer = setTimeout(() => {
    refreshAccessToken()
  }, timeUntilRefresh)
}

/**
 * Inicia el sistema de refresh automático
 */
export function startTokenRefresh() {
  const accessToken = localStorage.getItem('access_token')
  
  if (!accessToken) {
    console.log('No access token found, skipping refresh setup')
    return
  }

  console.log('🚀 Starting token refresh system')
  scheduleTokenRefresh(accessToken)
}

/**
 * Detiene el sistema de refresh automático
 */
export function stopTokenRefresh() {
  if (refreshTimer) {
    console.log('🛑 Stopping token refresh system')
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

/**
 * Reinicia el sistema de refresh (útil después de login)
 */
export function restartTokenRefresh() {
  stopTokenRefresh()
  startTokenRefresh()
}