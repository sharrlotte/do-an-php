import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#46178f] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">QuizMaster!</div>
          <div className="space-x-2">
            <Link href="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white/20 hover:text-white">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-[#46178f] hover:bg-white/90">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Create engaging quizzes in minutes</h1>
          <p className="text-xl mb-8">
            Make learning awesome with our interactive quiz platform. Create, share, and play quizzes with friends and
            colleagues.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-[#46178f] hover:bg-[#3b1277] text-white px-8">
                Get started for free
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="px-8">
                Learn more
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Create</h2>
            <p>Design engaging quizzes with multiple question types, timers, and point systems.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Share</h2>
            <p>Invite others to join your quiz with a simple game code or link.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Play</h2>
            <p>Compete in real-time and see who can answer correctly the fastest.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          <p>© 2025 QuizMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

