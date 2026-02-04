import { useState, useEffect } from 'react'

/**
 * Componente de temporizador countdown
 */
export default function CountdownTimer({ horaSalidaProgramada }) {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const endTime = new Date(horaSalidaProgramada)
      const diff = endTime - now

      if (diff <= 0) {
        setIsExpired(true)
        const overtime = Math.abs(diff)
        const hours = Math.floor(overtime / (1000 * 60 * 60))
        const minutes = Math.floor((overtime % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((overtime % (1000 * 60)) / 1000)
        setTimeRemaining(`+${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
      } else {
        setIsExpired(false)
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        
        // Warning si quedan menos de 30 minutos
        setIsWarning(diff < 30 * 60 * 1000)
        
        setTimeRemaining(`${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [horaSalidaProgramada])

  return (
    <div className={`text-2xl font-bold ${
      isExpired ? 'text-red-600' : 
      isWarning ? 'text-yellow-600' : 
      'text-green-600'
    }`}>
      {timeRemaining}
    </div>
  )
}