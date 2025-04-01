import type { Metadata } from "next"
import GameLobby from "@/components/game-lobby"

export const metadata: Metadata = {
  title: "Play Quiz - QuizMaster",
  description: "Join and play an interactive quiz",
}

export default function PlayQuizPage({ params }: { params: { id: string } }) {
  return <GameLobby quizId={params.id} />
}

