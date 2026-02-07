import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Link } from 'react-router-dom'
import LoginInvitadoModal from '@/features/auth/components/LoginInvitadoModal'
import { SessionChecker } from '@/components/auth/SessionChecker'
import logo  from '@/assets/logo.png'

function LoginContent() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)

  const { 
    login, 
    loginAsGuest, 
    isLoggingIn, 
    isLoggingInAsGuest, 
    loginError, 
    loginGuestError 
  } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(credentials)
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    })
  }

  const handleGuestLogin = (guestData) => {
    loginAsGuest(guestData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Hotel Paso Logo"
            className="h-20 w-auto mx-auto mb-6 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
          />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Bienvenido
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Ingresa a tu cuenta para administrar el hotel
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error message */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">
                {loginError.response?.data?.detail || 
                 loginError.response?.data?.message ||
                 'Error al iniciar sesión. Verifica tus credenciales.'}
              </p>
            </div>
          )}

          {/* Username */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={isLoggingIn}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400"
              placeholder="Ingresa tu usuario"
            />
          </div>

          {/* Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={isLoggingIn}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed placeholder-gray-400 pr-10"
                placeholder="Ingresa tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none"
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400 font-medium">O continúa con</span>
          </div>
        </div>

        {/* Guest login button */}
        <button
          type="button"
          onClick={() => setIsGuestModalOpen(true)}
          disabled={isLoggingIn}
          className="w-full bg-white border-2 border-gray-100 text-gray-600 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center gap-2"
        >
          <span>🚶</span> Continuar como Invitado
        </button>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 font-medium">
            Solo el administrador puede crear cuentas
          </p>
        </div>
      </div>

      {/* Modal de Login Invitado */}
      <LoginInvitadoModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSubmit={handleGuestLogin}
        isLoading={isLoggingInAsGuest}
        error={loginGuestError}
      />
    </div>
  )
}

export default function Login() {
  return (
    <SessionChecker>
      <LoginContent />
    </SessionChecker>
  )
}