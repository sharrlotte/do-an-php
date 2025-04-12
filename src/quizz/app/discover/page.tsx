"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const featuredQuizzes = [
  {
    id: "1",
    title: "General Knowledge Quiz",
    description: "Test your overall knowledge with this fun quiz!",
    tags: ["General", "Trivia"],
  },
  {
    id: "2",
    title: "Science Challenge",
    description: "Can you answer these tricky science questions?",
    tags: ["Science", "Physics"],
  },
  {
    id: "3",
    title: "Geography Expert",
    description: "Do you know your countries, cities and capitals?",
    tags: ["Geography", "World"],
  },
]

const popularTags = ["Science", "History", "Math", "Pop Culture", "Trivia", "Geography"]

export default function DiscoverPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#46178f]">Discover New Quizzes</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-[#46178f] hover:text-white">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Featured Quizzes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{quiz.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-gray-600">{quiz.description}</p>
                <div className="flex flex-wrap gap-1">
                  {quiz.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/quiz/${quiz.id}`}>
                  <Button size="sm" className="mt-2 bg-[#46178f] hover:bg-[#3b1277]">
                    Take Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}