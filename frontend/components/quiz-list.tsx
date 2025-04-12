"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Grid, List } from "lucide-react";

// Mock data for quizzes
const mockQuizzes = [
	{
		id: 1,
		title: "Geography Quiz",
		questions: 12,
		image: "/placeholder.svg?height=200&width=300",
		author: "quizmaster",
	},
	{
		id: 2,
		title: "Math Challenge",
		questions: 8,
		image: "/placeholder.svg?height=200&width=300",
		author: "quizmaster",
	},
	{
		id: 3,
		title: "Science Trivia",
		questions: 15,
		image: "/placeholder.svg?height=200&width=300",
		author: "quizmaster",
	},
];

export default function QuizList() {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-xl font-semibold">Your folders</h2>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center">
						<span className="mr-2 text-sm text-gray-600">Sort by:</span>
						<select className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#46178f]">
							<option>Most recent</option>
							<option>Alphabetical</option>
							<option>Most played</option>
						</select>
					</div>
					<Button variant="outline">New folder</Button>
					<div className="flex border rounded-md overflow-hidden">
						<Button
							variant="ghost"
							size="icon"
							className={`rounded-none ${viewMode === "grid" ? "bg-gray-100" : ""}`}
							onClick={() => setViewMode("grid")}
						>
							<Grid size={18} />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className={`rounded-none ${viewMode === "list" ? "bg-gray-100" : ""}`}
							onClick={() => setViewMode("list")}
						>
							<List size={18} />
						</Button>
					</div>
				</div>
			</div>

			<div className={`grid ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"} gap-6`}>
				<Link href="/create-quiz">
					<Card className="h-full border-dashed border hover:border-[#46178f] transition-colors cursor-pointer">
						<CardContent className="flex flex-col items-center justify-center h-full p-6">
							<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
								<Plus className="h-8 w-8 text-gray-500" />
							</div>
							<h3 className="text-lg font-medium text-center">Create new quiz</h3>
							<p className="text-sm text-gray-500 text-center mt-2">Start from scratch or use a template</p>
						</CardContent>
					</Card>
				</Link>

				{mockQuizzes.map((quiz) => (
					<Link key={quiz.id} href={`/edit-quiz/${quiz.id}`}>
						<Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
							<div className="relative h-40 bg-gray-100">
								<Image src={quiz.image || "/placeholder.svg"} alt={quiz.title} fill className="object-cover" />
								<div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
									{quiz.questions} questions
								</div>
							</div>
							<CardContent className="p-4">
								<h3 className="font-medium">{quiz.title}</h3>
								<p className="text-sm text-gray-500 mt-1">{quiz.author}</p>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
