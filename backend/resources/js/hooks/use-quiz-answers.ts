import { api } from '@/axios';
import { Pagination, QuizAnswer } from '@/types';
import { useQuery } from '@tanstack/react-query';
export function useQuizAnswers(quizId: string) {
    return useQuery({
        queryKey: ['quiz-answers', quizId],
        queryFn: async () => {
            const response = await api.get<Pagination<QuizAnswer>>(`/api/v1/quizz/${quizId}/answers`);
            return response.data;
        },
    });
}
