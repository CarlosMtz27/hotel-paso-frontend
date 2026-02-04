import { useState } from 'react'
import UserProfile from '@/components/common/UserProfile'
import IniciarTurnoModal from './IniciarTurnoModal'

export default function IniciarTurnoView({ onIniciarTurno, isIniciando }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSave = (formData) => {
    onIniciarTurno(formData, {
      onSuccess: () => {
        setIsModalOpen(false)
        // La re-renderización se manejará en el componente padre
      }
    })
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna de Perfil de Usuario */}
        <div className="md:col-span-1">
          <UserProfile />
        </div>

        {/* Columna de Acción */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No tienes un turno activo</h2>
          <p className="text-gray-600 mb-8">
            Para comenzar a operar y gestionar las habitaciones, necesitas iniciar tu turno.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isIniciando}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 text-lg disabled:opacity-50"
          >
            {isIniciando ? 'Iniciando...' : 'Iniciar Turno'}
          </button>
        </div>
      </div>

      {/* Modal para Iniciar Turno */}
      <IniciarTurnoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isLoading={isIniciando}
      />
    </div>
  )
}