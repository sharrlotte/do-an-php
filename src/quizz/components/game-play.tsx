"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface GamePlayProps {
  quizId: string
}

// Mock quiz data
const mockQuiz = {
  title: "Geography Quiz",
  questions: [
    {
      id: "q1",
      text: "What is the capital of France?",
      timeLimit: 30,
      answers: [
        { id: "a1", text: "London", isCorrect: false, color: "red" },
        { id: "a2", text: "Paris", isCorrect: true, color: "blue" },
        { id: "a3", text: "Berlin", isCorrect: false, color: "yellow" },
        { id: "a4", text: "Madrid", isCorrect: false, color: "green" },
      ],
    },
    {
      id: "q2",
      text: "Which continent is Egypt in?",
      timeLimit: 20,
      answers: [
        { id: "a1", text: "Asia", isCorrect: false, color: "red" },
        { id: "a2", text: "Europe", isCorrect: false, color: "blue" },
        { id: "a3", text: "Africa", isCorrect: true, color: "yellow" },
        { id: "a4", text: "South America", isCorrect: false, color: "green" },
      ],
    },
    {
      id: "q3",
      text: "What is the largest ocean on Earth?",
      timeLimit: 20,
      answers: [
        { id: "a1", text: "Atlantic Ocean", isCorrect: false, color: "red" },
        { id: "a2", text: "Indian Ocean", isCorrect: false, color: "blue" },
        { id: "a3", text: "Arctic Ocean", isCorrect: false, color: "yellow" },
        { id: "a4", text: "Pacific Ocean", isCorrect: true, color: "green" },
      ],
    },
  ],
}

const COLORS = {
  red: "bg-red-500 hover:bg-red-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  green: "bg-green-500 hover:bg-green-600",
}

export default function GamePlay({ quizId }: GamePlayProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswers, setShowAnswers] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const currentQuestion = mockQuiz.questions[currentQuestionIndex]

  useEffect(() => {
    if (!currentQuestion) return

    // Reset state for new question
    setTimeLeft(currentQuestion.timeLimit)
    setShowAnswers(false)
    setSelectedAnswer(null)

    // Start countdown
    const timer = setTimeout(() => {
      setShowAnswers(true)
    }, 3000) // Show answers after 3 seconds

    return () => clearTimeout(timer)
  }, [currentQuestion, currentQuestionIndex])

  useEffect(() => {
    if (!showAnswers || !currentQuestion) return

    // Start countdown timer
    setTimeLeft(currentQuestion.timeLimit)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          // Time's up, show correct answer
          setTimeout(() => {
            if (currentQuestionIndex < mockQuiz.questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1)
            } else {
              setShowResults(true)
            }
          }, 3000) // Show correct answer for 3 seconds
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showAnswers, currentQuestion, currentQuestionIndex])

  const handleAnswerSelect = (answerId: string) => {
    if (selectedAnswer || timeLeft === 0) return

    setSelectedAnswer(answerId)

    // Check if answer is correct
    const isCorrect = currentQuestion.answers.find((a) => a.id === answerId)?.isCorrect

    if (isCorrect) {
      // Calculate score based on time left (faster = more points)
      const pointsEarned = Math.round(1000 * (timeLeft / currentQuestion.timeLimit))
      setScore((prev) => prev + pointsEarned)
    }

    // Show correct answer and proceed to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < mockQuiz.questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1)
      } else {
        setShowResults(true)
      }
    }, 3000)
  }

  const restartGame = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setShowResults(false)
  }

  const exitGame = () => {
    router.push("/dashboard")
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#46178f] flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-4xl font-bold mb-6">Game Over!</h1>
          <div className="bg-white text-black rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Your Score</h2>
            <div className="text-5xl font-bold mb-6 text-[#46178f]">{score}</div>
            <p className="mb-4">
              You answered{" "}
              {selectedAnswer
                ? mockQuiz.questions.filter((_, index) => index <= currentQuestionIndex).length
                : currentQuestionIndex}{" "}
              out of {mockQuiz.questions.length} questions
            </p>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button onClick={restartGame} className="bg-white text-[#46178f] hover:bg-white/90">
              Play Again
            </Button>
            <Button onClick={exitGame} variant="outline" className="text-white border-white hover:bg-white/20">
              Exit
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#46178f] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading quiz...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#46178f] flex flex-col">
      <header className="p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">{mockQuiz.title}</div>
          <div className="text-sm">
            Question {currentQuestionIndex + 1}/{mockQuiz.questions.length}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col">
        {/* Question display */}
        <div className="p-6 text-center text-white">
          {!showAnswers ? (
            <div className="animate-pulse">
              <h2 className="text-3xl font-bold mb-4">Get Ready!</h2>
              <p className="text-xl">Next question coming up...</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-6">{currentQuestion.text}</h2>
              <div className="mb-4">
                <Progress value={(timeLeft / currentQuestion.timeLimit) * 100} className="h-2" />
                <div className="text-right mt-1">{timeLeft}s</div>
              </div>
            </>
          )}
        </div>

        {/* Answer options */}
        {showAnswers && (
          <div className="flex-1 grid grid-cols-2 gap-4 p-4">
            {currentQuestion.answers.map((answer) => {
              const isSelected = selectedAnswer === answer.id
              const showCorrect = selectedAnswer !== null || timeLeft === 0
              const isCorrect = answer.isCorrect

              let className = COLORS[answer.color as keyof typeof COLORS]

              if (showCorrect) {
                if (isCorrect) {
                  className = "bg-green-600 border-4 border-white"
                } else if (isSelected) {
                  className = "bg-red-600 border-4 border-white"
                } else {
                  className += " opacity-70"
                }
              }

              return (
                <button
                  key={answer.id}
                  className={`${className} rounded-lg p-6 text-white text-xl font-bold flex items-center justify-center h-full`}
                  onClick={() => handleAnswerSelect(answer.id)}
                  disabled={selectedAnswer !== null || timeLeft === 0}
                >
                  {answer.text}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

