import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import QuizList from "@/components/quiz-list"

export const metadata: Metadata = {
  title: "Dashboard - QuizMaster",
  description: "Manage your quizzes",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Your Quizzes</h1>
        <QuizList />
      </div>
    </DashboardLayout>
  )
}

