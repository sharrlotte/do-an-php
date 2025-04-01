"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Play } from "lucide-react"

interface GameLobbyProps {
  quizId: string
}

export default function GameLobby({ quizId }: GameLobbyProps) {
  const [gamePin, setGamePin] = useState("")
  const [players, setPlayers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Generate a random 6-digit game pin
    const pin = Math.floor(100000 + Math.random() * 900000).toString()
    setGamePin(pin)
    setIsLoading(false)

    // Simulate players joining (in a real app, this would be via WebSockets)
    const interval = setInterval(() => {
      if (players.length < 10) {
        const randomNames = [
          "Alex",
          "Taylor",
          "Jordan",
          "Casey",
          "Riley",
          "Morgan",
          "Jamie",
          "Quinn",
          "Avery",
          "Skyler",
        ]
        const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]
        if (!players.includes(randomName)) {
          setPlayers((prev) => [...prev, randomName])
        }
      } else {
        clearInterval(interval)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [players])

  const startGame = () => {
    // In a real app, this would start the game for all connected players
    console.log("Starting game with players:", players)
    // Navigate to the game screen
    window.location.href = `/play/${quizId}/game`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#46178f]">
        <div className="text-white text-center">
          <div className="text-2xl font-bold mb-4">Loading game...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#46178f] flex flex-col">
      <header className="p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">QuizMaster!</div>
          <div>
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              End game
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-white text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Game PIN:</h1>
          <div className="text-6xl font-bold mb-6">{gamePin}</div>
          <p className="text-xl">
            Join at <span className="font-bold">quizmaster.com</span> or with the QuizMaster app
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Users className="mr-2" />
                <h2 className="text-xl font-bold">Players: {players.length}</h2>
              </div>
              <Button onClick={startGame} disabled={players.length === 0}>
                <Play className="mr-2" size={16} />
                Start
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <Card key={index} className="bg-gray-100">
                  <CardContent className="p-4 text-center">
                    <div className="font-medium">{player}</div>
                  </CardContent>
                </Card>
              ))}
              {Array.from({ length: Math.max(0, 8 - players.length) }).map((_, index) => (
                <Card key={`empty-${index}`} className="border-dashed border-2 border-gray-300">
                  <CardContent className="p-4 text-center text-gray-400">
                    <div className="font-medium">Waiting...</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

