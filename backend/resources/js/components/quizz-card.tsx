import { Skeleton } from '@/components/ui/skeleton';
import { useQuizAnswers } from '@/hooks/use-quiz-answers';
import { Quizz } from '@/types';

export default function QuizzCard({ quizz }: { quizz: Quizz }) {
    const { data: answers, isLoading } = useQuizAnswers(quizz.id);

    return (
        <div className="group bg-card relative flex h-full flex-col gap-3 rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
                <h2 className="text-card-foreground text-lg leading-tight font-semibold">{quizz.question}</h2>
            </div>
            <div className="mt-4 space-y-2">
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full rounded" />
                        ))}
                    </div>
                ) : (
                    answers?.data.map((answer) => (
                        <div
                            key={answer.id}
                            className={`rounded-lg border p-3 ${answer.isAnswer ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                        >
                            {answer.content}
                        </div>
                    ))
                )}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4"></div>
        </div>
    );
}
