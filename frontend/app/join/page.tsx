"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function JoinGamePage() {
  const [gamePin, setGamePin] = useState("")
  const [nickname, setNickname] = useState("")
  const [step, setStep] = useState<"pin" | "nickname">("pin")
  const [error, setError] = useState("")
  const router = useRouter()

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (gamePin.length !== 6 || !/^\d+$/.test(gamePin)) {
      setError("Please enter a valid 6-digit game PIN")
      return
    }

    // In a real app, you would validate the game PIN with the server
    setError("")
    setStep("nickname")
  }

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim()) {
      setError("Please enter a nickname")
      return
    }

    // In a real app, you would join the game with the server
    router.push(`/play/${gamePin}/player?name=${encodeURIComponent(nickname)}`)
  }

  return (
    <div className="min-h-screen bg-[#46178f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#46178f]">QuizMaster!</CardTitle>
        </CardHeader>
        <CardContent>
          {step === "pin" ? (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Enter game PIN</h2>
              </div>
              <Input
                type="text"
                placeholder="Game PIN"
                value={gamePin}
                onChange={(e) => setGamePin(e.target.value)}
                className="text-center text-2xl py-6"
                maxLength={6}
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full bg-[#46178f] hover:bg-[#3b1277]">
                Enter
              </Button>
            </form>
          ) : (
            <form onSubmit={handleNicknameSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Enter your nickname</h2>
                <p className="text-gray-500">Game PIN: {gamePin}</p>
              </div>
              <Input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-center text-xl py-6"
                maxLength={15}
              />
              {error && <p className="text-red-500 text-center">{error}</p>}
              <Button type="submit" className="w-full bg-[#46178f] hover:bg-[#3b1277]">
                Join game
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => setStep("pin")}>
                Back
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

