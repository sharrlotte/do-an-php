"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Badge } from "@/components/ui/badge"

const quizStats = [
  { name: "Math", score: 85 },
  { name: "Science", score: 92 },
  { name: "History", score: 78 },
  { name: "Geography", score: 88 },
]

const recentResults = [
  { quiz: "Math Basics", score: 85, date: "2025-04-08" },
  { quiz: "World History", score: 78, date: "2025-04-06" },
  { quiz: "Physics Intro", score: 92, date: "2025-04-04" },
  { quiz: "Countries & Capitals", score: 88, date: "2025-04-02" },
]

export default function ReportPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[#46178f]">Reports Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quizStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#46178f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Stats</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>Total quizzes taken: <span className="font-semibold">12</span></div>
            <div>Average score: <span className="font-semibold">85%</span></div>
            <div>Best Subject: <Badge variant="default" className="bg-green-600">Science</Badge></div>
            <div>Weakest Subject: <Badge variant="default" className="bg-red-500">History</Badge></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Quiz</th>
                <th className="py-2">Score</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2">{result.quiz}</td>
                  <td className="py-2">{result.score}%</td>
                  <td className="py-2">{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}