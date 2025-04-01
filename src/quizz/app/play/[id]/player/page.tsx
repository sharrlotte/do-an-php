"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function PlayerGamePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const playerName = searchParams.get("name") || "Player"
  const [gameState, setGameState] = useState<"waiting" | "question" | "results">("waiting")
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [rank, setRank] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState({
    answers: [
      { id: "a1", color: "red" },
      { id: "a2", color: "blue" },
      { id: "a3", color: "yellow" },
      { id: "a4", color: "green" },
    ],
  })

  // Simulate game state changes (in a real app, this would be via WebSockets)
  useEffect(() => {
    // Simulate question starting after 5 seconds
    const questionTimer = setTimeout(() => {
      setGameState("question")
      setSelectedAnswer(null)
    }, 5000)

    // Simulate results after 15 seconds
    const resultsTimer = setTimeout(() => {
      setGameState("results")
      // Simulate score and rank
      setScore((prev) => prev + Math.floor(Math.random() * 1000))
      setRank(Math.floor(Math.random() * 10) + 1)

      // Go back to waiting after 5 seconds
      setTimeout(() => {
        setGameState("waiting")
      }, 5000)
    }, 20000)

    return () => {
      clearTimeout(questionTimer)
      clearTimeout(resultsTimer)
    }
  }, [gameState === "waiting"])

  const handleAnswerSelect = (answerId: string) => {
    if (selectedAnswer || gameState !== "question") return
    setSelectedAnswer(answerId)
  }

  const COLORS = {
    red: "bg-red-500 hover:bg-red-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    green: "bg-green-500 hover:bg-green-600",
  }

  return (
    <div className="min-h-screen bg-[#46178f] flex flex-col">
      <header className="p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">QuizMaster!</div>
          <div className="text-lg">{playerName}</div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        {gameState === "waiting" && (
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Get ready!</h2>
            <p className="text-xl">Waiting for the next question...</p>
            <div className="mt-6">
              <Card className="bg-white p-4">
                <CardContent className="text-center">
                  <div className="text-lg font-medium">Your score</div>
                  <div className="text-3xl font-bold text-[#46178f]">{score}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {gameState === "question" && (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  className={`${COLORS[answer.color as keyof typeof COLORS]} rounded-lg p-12 text-white ${
                    selectedAnswer === answer.id ? "border-4 border-white" : ""
                  }`}
                  onClick={() => handleAnswerSelect(answer.id)}
                  disabled={selectedAnswer !== null}
                >
                  <div className="w-12 h-12 mx-auto">
                    {answer.color === "red" && (
                      <div className="w-0 h-0 border-l-[30px] border-l-transparent border-b-[50px] border-b-white border-r-[30px] border-r-transparent mx-auto"></div>
                    )}
                    {answer.color === "blue" && (
                      <div className="w-12 h-12 bg-white rounded-md transform rotate-45 mx-auto"></div>
                    )}
                    {answer.color === "yellow" && <div className="w-12 h-12 bg-white rounded-full mx-auto"></div>}
                    {answer.color === "green" && <div className="w-12 h-12 bg-white mx-auto"></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gameState === "results" && (
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Results</h2>
            <Card className="bg-white p-6 mb-4">
              <CardContent className="text-center">
                <div className="text-lg font-medium mb-2">Points earned</div>
                <div className="text-4xl font-bold text-[#46178f]">+{Math.floor(Math.random() * 1000)}</div>
              </CardContent>
            </Card>
            <Card className="bg-white p-6">
              <CardContent className="text-center">
                <div className="text-lg font-medium mb-2">Current rank</div>
                <div className="text-4xl font-bold text-[#46178f]">#{rank}</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

