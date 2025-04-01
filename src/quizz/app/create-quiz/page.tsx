import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import QuizCreator from "@/components/quiz-creator"

export const metadata: Metadata = {
  title: "Create Quiz - QuizMaster",
  description: "Create a new interactive quiz",
}

export default function CreateQuizPage() {
  return (
    <DashboardLayout>
      <QuizCreator />
    </DashboardLayout>
  )
}

