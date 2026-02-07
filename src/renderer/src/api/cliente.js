import axios from 'axios'

/**
 * Cliente Axios configurado para comunicarse con Django REST Framework
 */

// Obtener URL base desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de Request
 * Se ejecuta antes de cada petición
 */
apiClient.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage (si existe)
    const token = localStorage.getItem('access_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      })
    }

    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

/**
 * Interceptor de Response
 * Se ejecuta después de cada respuesta
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('Response:', {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Intentar refrescar el token
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          })

          const { access } = response.data
          
          // Guardar nuevo token
          localStorage.setItem('access_token', access)
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir a login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        
        // Aquí podrías redirigir al login
        // window.location.href = '/login'
        
        return Promise.reject(refreshError)
      }
    }

    // Manejar otros errores
    console.error('Response Error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    })

    return Promise.reject(error)
  }
)

export default apiClient