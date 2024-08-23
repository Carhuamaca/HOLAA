import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const preguntas = [
  {
    pregunta: "¿Cuántos días a la semana asistes correctamente uniformado a la institución educativa?",
    opciones: ["1 vez", "2 veces", "3 veces", "4 o más veces"],
    emoji: "👕"
  },
  {
    pregunta: "¿Por qué razón los estudiantes llegan tarde a clases después del recreo?",
    opciones: ["Van al baño a última hora", "Se quedan en el kiosco", "Se quedan jugando con el balón", "No escuchan el timbre"],
    emoji: "⏰"
  },
  {
    pregunta: "¿Cuántas veces a la semana llegas tarde a la institución educativa?",
    opciones: ["1 vez", "2 veces", "3 veces", "Todos los días"],
    emoji: "🏃"
  },
  {
    pregunta: "El día que llegaste tarde a la institución educativa, ¿cuántos minutos de tardanza tuviste?",
    opciones: ["Menos de 5 min", "De 5 a 10 min", "De 10 a 15 min", "Más de 15 min"],
    emoji: "⌛"
  },
  {
    pregunta: "¿En qué medida cumples con las normas de convivencia establecidas en la hora de clase?",
    opciones: ["Siempre", "Casi siempre", "Nunca", "Casi nunca"],
    emoji: "📏"
  },
  {
    pregunta: "¿Por qué crees que los estudiantes asisten a la institución educativa con el cabello desalineado?",
    opciones: ["No tienen tiempo de arreglarse", "No respetan las normas de presentación escolar", "Es una moda venir sin arreglarse", "Quieren dar la contra a las autoridades de la I.E."],
    emoji: "💇"
  },
  {
    pregunta: "¿A qué se debe el bajo rendimiento académico en nuestra Institución Educativa?",
    opciones: ["No estudiamos o practicamos", "Desinterés", "Trabajo", "Falta de tiempo"],
    emoji: "📚"
  },
  {
    pregunta: "¿Por qué motivo los estudiantes llevan celulares a la Institución Educativa?",
    opciones: ["Contactarme con mis compañeros", "Herramienta de estudio", "Chatear", "Me obligan mis padres"],
    emoji: "📱"
  },
  {
    pregunta: "¿A qué se debe que la gran mayoría de los estudiantes carezcan de presentación personal?",
    opciones: ["Falta de tiempo", "Está de moda", "Baja autoestima", "Para estar a la par de mis compañeros"],
    emoji: "🪞"
  },
  {
    pregunta: "¿De qué manera podríamos mantener nuestra aula limpia, ordenada y ambientada?",
    opciones: ["Todos colaboramos", "El comité de aula", "El personal de limpieza", "Nos turnamos"],
    emoji: "🧹"
  }
]

export default function Component() {
  const [respuestas, setRespuestas] = useState(Array(10).fill(''))
  const [resultados, setResultados] = useState(Array(10).fill(Array(4).fill(0)))
  const [totalRespuestas, setTotalRespuestas] = useState(0)
  const [encuestaCompletada, setEncuestaCompletada] = useState(false)
  const [error, setError] = useState('')
  const [yaRespondio, setYaRespondio] = useState(false)

  useEffect(() => {
    const storedResultados = localStorage.getItem('resultadosEncuesta')
    const storedTotalRespuestas = localStorage.getItem('totalRespuestasEncuesta')
    const storedYaRespondio = localStorage.getItem('yaRespondioEncuesta')
    
    if (storedResultados) setResultados(JSON.parse(storedResultados))
    if (storedTotalRespuestas) setTotalRespuestas(parseInt(storedTotalRespuestas))
    if (storedYaRespondio) setYaRespondio(JSON.parse(storedYaRespondio))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (yaRespondio) {
      setError('Ya has respondido a esta encuesta. ¡Gracias por tu participación!')
      return
    }
    if (totalRespuestas >= 100) {
      setError('Lo sentimos, ya se han alcanzado las 100 respuestas máximas.')
      return
    }
    if (respuestas.some(r => r === '')) {
      setError('¡Hey! Falta responder algunas preguntas. ¡Échales un vistazo!')
      return
    }
    const nuevosResultados = resultados.map((pregunta, i) => 
      pregunta.map((opcion, j) => respuestas[i] === preguntas[i].opciones[j] ? opcion + 1 : opcion)
    )
    setResultados(nuevosResultados)
    setTotalRespuestas(prev => prev + 1)
    setEncuestaCompletada(true)
    setYaRespondio(true)
    localStorage.setItem('resultadosEncuesta', JSON.stringify(nuevosResultados))
    localStorage.setItem('totalRespuestasEncuesta', (totalRespuestas + 1).toString())
    localStorage.setItem('yaRespondioEncuesta', 'true')
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  if (yaRespondio || encuestaCompletada || totalRespuestas >= 100) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">¡Gracias por participar! 🎉</CardTitle>
          <CardDescription className="text-center text-xl">
            Total de respuestas: {totalRespuestas} / 100
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preguntas.map((pregunta, i) => (
            <motion.div 
              key={i} 
              className="mb-6 p-4 bg-white rounded-lg shadow-lg text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-2xl font-semibold mb-2 flex items-center text-indigo-700">
                <span className="text-4xl mr-2">{pregunta.emoji}</span>
                <span>{pregunta.pregunta}</span>
              </h3>
              {pregunta.opciones.map((opcion, j) => (
                <div key={j} className="flex items-center justify-between mb-2">
                  <span className="text-indigo-600 font-medium">{opcion}</span>
                  <div className="w-2/3 bg-gray-200 rounded-full h-6">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-6 rounded-full"
                      style={{ width: `${(resultados[i][j] / totalRespuestas) * 100}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(resultados[i][j] / totalRespuestas) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 + j * 0.05 }}
                    >
                      <span className="px-2 text-white font-bold">{resultados[i][j]}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">¡Tu opinión es importante! 🌟</CardTitle>
        <CardDescription className="text-center text-xl">
          Faltan {100 - totalRespuestas} respuestas. ¡Sé parte del cambio!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-500 text-white">
            <AlertTitle>¡Ojo! 👀</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          {preguntas.map((pregunta, i) => (
            <motion.div 
              key={i} 
              className={`mb-6 p-4 bg-white rounded-lg shadow-lg ${respuestas[i] === '' && error ? 'border-4 border-red-500' : ''}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Label className="text-2xl font-semibold mb-2 flex items-center text-indigo-700">
                <span className="text-4xl mr-2">{pregunta.emoji}</span>
                <span>{pregunta.pregunta}</span>
              </Label>
              <RadioGroup
                onValueChange={(value) => {
                  const nuevasRespuestas = [...respuestas]
                  nuevasRespuestas[i] = value
                  setRespuestas(nuevasRespuestas)
                  setError('')
                }}
                className="mt-2 grid grid-cols-2 gap-2"
              >
                {pregunta.opciones.map((opcion, j) => (
                  <div key={j} className="flex items-center space-x-2 bg-indigo-50 p-2 rounded-lg hover:bg-indigo-100 transition-colors">
                    <RadioGroupItem value={opcion} id={`p${i}o${j}`} />
                    <Label htmlFor={`p${i}o${j}`} className="text-indigo-600 font-medium cursor-pointer w-full">{opcion}</Label>
                  </div>
                ))}
              </RadioGroup>
            </motion.div>
          ))}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full text-xl shadow-lg transform transition-all duration-500 ease-in-out hover:shadow-2xl"
              disabled={respuestas.some(r => r === '') || yaRespondio}
            >
              ¡Enviar mis respuestas! 🚀
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  )
}