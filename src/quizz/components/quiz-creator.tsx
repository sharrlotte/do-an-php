"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Clock, Award, ImageIcon, Plus, Trash2, Copy, ChevronRight, ChevronLeft } from "lucide-react"

interface Question {
  id: string
  text: string
  image: string | null
  timeLimit: number
  points: string
  answerType: string
  answers: Answer[]
}

interface Answer {
  id: string
  text: string
  isCorrect: boolean
  color: string
}

const COLORS = {
  red: "bg-red-500 hover:bg-red-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  yellow: "bg-yellow-500 hover:bg-yellow-600",
  green: "bg-green-500 hover:bg-green-600",
}

export default function QuizCreator() {
  const router = useRouter()
  const [title, setTitle] = useState("Untitled Quiz")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      image: null,
      timeLimit: 30,
      points: "standard",
      answerType: "single",
      answers: [
        { id: "a1", text: "", isCorrect: false, color: "red" },
        { id: "a2", text: "", isCorrect: false, color: "blue" },
        { id: "a3", text: "", isCorrect: false, color: "yellow" },
        { id: "a4", text: "", isCorrect: false, color: "green" },
      ],
    },
  ])

  const currentQuestion = questions[currentQuestionIndex]

  const handleQuestionChange = (value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].text = value
    setQuestions(updatedQuestions)
  }

  const handleAnswerChange = (id: string, value: string) => {
    const updatedQuestions = [...questions]
    const question = updatedQuestions[currentQuestionIndex]
    const answerIndex = question.answers.findIndex((a) => a.id === id)

    if (answerIndex !== -1) {
      question.answers[answerIndex].text = value
      setQuestions(updatedQuestions)
    }
  }

  const handleCorrectAnswerChange = (id: string) => {
    const updatedQuestions = [...questions]
    const question = updatedQuestions[currentQuestionIndex]

    // For single select, only one answer can be correct
    if (question.answerType === "single") {
      question.answers.forEach((answer) => {
        answer.isCorrect = answer.id === id
      })
    } else {
      // For multiple select, toggle the correct state
      const answerIndex = question.answers.findIndex((a) => a.id === id)
      if (answerIndex !== -1) {
        question.answers[answerIndex].isCorrect = !question.answers[answerIndex].isCorrect
      }
    }

    setQuestions(updatedQuestions)
  }

  const handleTimeLimitChange = (value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].timeLimit = Number.parseInt(value)
    setQuestions(updatedQuestions)
  }

  const handlePointsChange = (value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].points = value
    setQuestions(updatedQuestions)
  }

  const handleAnswerTypeChange = (value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[currentQuestionIndex].answerType = value
    setQuestions(updatedQuestions)
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      text: "",
      image: null,
      timeLimit: 30,
      points: "standard",
      answerType: "single",
      answers: [
        { id: `q${questions.length + 1}a1`, text: "", isCorrect: false, color: "red" },
        { id: `q${questions.length + 1}a2`, text: "", isCorrect: false, color: "blue" },
        { id: `q${questions.length + 1}a3`, text: "", isCorrect: false, color: "yellow" },
        { id: `q${questions.length + 1}a4`, text: "", isCorrect: false, color: "green" },
      ],
    }

    setQuestions([...questions, newQuestion])
    setCurrentQuestionIndex(questions.length)
  }

  const duplicateQuestion = () => {
    const questionToDuplicate = questions[currentQuestionIndex]
    const duplicatedQuestion: Question = {
      ...JSON.parse(JSON.stringify(questionToDuplicate)),
      id: `q${questions.length + 1}`,
    }

    // Update answer IDs to be unique
    duplicatedQuestion.answers = duplicatedQuestion.answers.map((answer, index) => ({
      ...answer,
      id: `q${questions.length + 1}a${index + 1}`,
    }))

    const newQuestions = [...questions]
    newQuestions.splice(currentQuestionIndex + 1, 0, duplicatedQuestion)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(currentQuestionIndex + 1)
  }

  const deleteQuestion = () => {
    if (questions.length <= 1) return

    const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex)
    setQuestions(newQuestions)

    // Adjust current index if needed
    if (currentQuestionIndex >= newQuestions.length) {
      setCurrentQuestionIndex(newQuestions.length - 1)
    }
  }

  const addMoreAnswers = () => {
    if (currentQuestion.answers.length >= 6) return

    const colors = ["red", "blue", "yellow", "green", "purple", "orange"]
    const updatedQuestions = [...questions]
    const newAnswer = {
      id: `q${currentQuestionIndex + 1}a${currentQuestion.answers.length + 1}`,
      text: "",
      isCorrect: false,
      color: colors[currentQuestion.answers.length % colors.length],
    }

    updatedQuestions[currentQuestionIndex].answers.push(newAnswer)
    setQuestions(updatedQuestions)
  }

  const saveQuiz = () => {
    // In a real app, you would save the quiz to a database
    console.log("Saving quiz:", { title, questions })
    router.push("/dashboard")
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-[#46178f]">QuizMaster!</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-none text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Enter kahoot title..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">Settings</Button>
            <Button variant="outline">Themes</Button>
            <Button variant="outline">Preview</Button>
            <Button variant="outline">Exit</Button>
            <Button onClick={saveQuiz}>Save</Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Question sidebar */}
        <div className="w-64 bg-white border-r h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4">
            <Button onClick={addQuestion} className="w-full mb-4">
              Add question
            </Button>
            <Button onClick={addQuestion} variant="outline" className="w-full">
              Add slide
            </Button>
          </div>
          <div className="border-t">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`p-4 border-b cursor-pointer ${index === currentQuestionIndex ? "bg-gray-100" : ""}`}
                onClick={() => goToQuestion(index)}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1 truncate">
                    <div className="font-medium">{question.text || `Question ${index + 1}`}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#e9d8f4] rounded-lg p-8 mb-6">
              <Input
                value={currentQuestion.text}
                onChange={(e) => handleQuestionChange(e.target.value)}
                className="text-xl font-medium bg-white border-none mb-6 p-4 h-auto"
                placeholder="Start typing your question"
              />

              {currentQuestion.image ? (
                <div className="relative h-64 mb-6">
                  <Image
                    src={currentQuestion.image || "/placeholder.svg"}
                    alt="Question image"
                    fill
                    className="object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      const updatedQuestions = [...questions]
                      updatedQuestions[currentQuestionIndex].image = null
                      setQuestions(updatedQuestions)
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-64 bg-white/50 border-dashed border-2 mb-6"
                  onClick={() => {
                    // In a real app, you would open a file picker
                    const updatedQuestions = [...questions]
                    updatedQuestions[currentQuestionIndex].image = "/placeholder.svg?height=400&width=600"
                    setQuestions(updatedQuestions)
                  }}
                >
                  <div className="flex flex-col items-center">
                    <ImageIcon size={48} className="mb-2 text-gray-400" />
                    <span>Add image</span>
                  </div>
                </Button>
              )}

              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.answers.map((answer) => (
                  <div key={answer.id} className="relative">
                    <div className={`${COLORS[answer.color as keyof typeof COLORS]} rounded-md p-4 text-white`}>
                      <div className="flex items-center">
                        <div
                          className={`w-6 h-6 rounded-md mr-3 border-2 border-white flex items-center justify-center cursor-pointer ${
                            answer.isCorrect ? "bg-white" : ""
                          }`}
                          onClick={() => handleCorrectAnswerChange(answer.id)}
                        >
                          {answer.isCorrect && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`w-4 h-4 ${
                                answer.color === "red"
                                  ? "text-red-500"
                                  : answer.color === "blue"
                                    ? "text-blue-500"
                                    : answer.color === "yellow"
                                      ? "text-yellow-500"
                                      : "text-green-500"
                              }`}
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <Input
                          value={answer.text}
                          onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                          className="bg-transparent border-none text-white placeholder-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder={`Add answer ${currentQuestion.answers.findIndex((a) => a.id === answer.id) + 1}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {currentQuestion.answers.length < 6 && (
                <Button variant="outline" className="mt-4 w-full" onClick={addMoreAnswers}>
                  <Plus size={16} className="mr-2" />
                  Add more answers
                </Button>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      Time limit
                    </div>
                  </label>
                  <Select value={currentQuestion.timeLimit.toString()} onValueChange={handleTimeLimitChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="20">20 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="90">90 seconds</SelectItem>
                      <SelectItem value="120">120 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <div className="flex items-center">
                      <Award size={16} className="mr-2" />
                      Points
                    </div>
                  </label>
                  <Select value={currentQuestion.points} onValueChange={handlePointsChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select points" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="double">Double points</SelectItem>
                      <SelectItem value="noPoints">No points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <div className="flex items-center">
                      <Settings size={16} className="mr-2" />
                      Answer options
                    </div>
                  </label>
                  <Select value={currentQuestion.answerType} onValueChange={handleAnswerTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select answer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single select</SelectItem>
                      <SelectItem value="multiple">Multiple select</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between mt-6 pt-6 border-t">
                <div>
                  <Button variant="destructive" onClick={deleteQuestion} disabled={questions.length <= 1}>
                    Delete
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={duplicateQuestion}>
                    <Copy size={16} className="mr-2" />
                    Duplicate
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToQuestion(currentQuestionIndex - 1)}
                      disabled={currentQuestionIndex === 0}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <span>
                      {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => goToQuestion(currentQuestionIndex + 1)}
                      disabled={currentQuestionIndex === questions.length - 1}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

