import type { Metadata } from "next"
import DashboardLayout from "@/components/dashboard-layout"
import LibraryContent from "@/components/library-content"

export const metadata: Metadata = {
  title: "Library - QuizMaster",
  description: "Browse your quiz library",
}

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <LibraryContent />
    </DashboardLayout>
  )
}

