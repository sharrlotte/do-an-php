import type { Metadata } from "next"
import GamePlay from "@/components/game-play"

export const metadata: Metadata = {
  title: "Playing Quiz - QuizMaster",
  description: "Play an interactive quiz",
}

export default function GamePlayPage({ params }: { params: { id: string } }) {
  return <GamePlay quizId={params.id} />
}

