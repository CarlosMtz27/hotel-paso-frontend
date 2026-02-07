import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import ReporteTurnos from '@/features/reportes/components/ReporteTurnos'
import ResumenDiario from '@/features/reportes/components/ResumenDiario'
import ReporteEmpleados from '@/features/reportes/components/ReporteEmpleados'
import RankingEmpleados from '@/features/reportes/components/RankingEmpleados'
import GraficaIngresos from '@/features/reportes/components/GraficaIngresos'

const TABS = {
  TURNOS: 'turnos',
  DIARIO: 'diario',
  EMPLEADOS: 'empleados',
  RANKING: 'ranking',
  GRAFICA: 'grafica',
}

export default function Reportes() {
  const { userRole } = useAuth()
  const [activeTab, setActiveTab] = useState(TABS.TURNOS)

  // Tabs disponibles según el rol
  const availableTabs = userRole === 'admin' 
    ? [
        { id: TABS.TURNOS, name: 'Turnos', icon: '📋' },
        { id: TABS.DIARIO, name: 'Resumen Diario', icon: '📅' },
        { id: TABS.EMPLEADOS, name: 'Por Empleado', icon: '👥' },
        { id: TABS.RANKING, name: 'Ranking', icon: '🏆' },
        { id: TABS.GRAFICA, name: 'Gráfica', icon: '📊' },
      ]
    : [
        { id: TABS.TURNOS, name: 'Mis Turnos', icon: '📋' },
      ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-2">
          Visualiza y exporta reportes del sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {availableTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === TABS.TURNOS && <ReporteTurnos />}
        {activeTab === TABS.DIARIO && <ResumenDiario />}
        {activeTab === TABS.EMPLEADOS && <ReporteEmpleados />}
        {activeTab === TABS.RANKING && <RankingEmpleados />}
        {activeTab === TABS.GRAFICA && <GraficaIngresos />}
      </div>
    </div>
  )
}