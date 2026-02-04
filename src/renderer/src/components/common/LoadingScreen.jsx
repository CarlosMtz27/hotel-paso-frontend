/**
 * Componente de pantalla de carga completa con una animación más elaborada.
 * Ideal para momentos de carga inicial de la aplicación.
 */
export default function LoadingScreen({ message = 'Cargando...' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative inline-flex items-center justify-center">
        {/* Icono base (usamos el mismo del login para consistencia) */}
        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        {/* Animación de "ping" que se expande y desaparece (clase de Tailwind) */}
        <div className="w-16 h-16 bg-indigo-400 rounded-full absolute top-0 left-0 animate-ping opacity-75"></div>
        {/* Animación de "pulso" que cambia de opacidad (clase de Tailwind) */}
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
      <p className="text-gray-600 mt-8 text-lg font-medium">{message}</p>
    </div>
  )
}
