import { api } from '@/axios';
import { QuizAnswer } from '@/types';
import { useQuery } from '@tanstack/react-query';
export function useQuizAnswers(quizId: string) {
    return useQuery({
        queryKey: ['answers', quizId],
        queryFn: async () => {
            const response = await api.get<QuizAnswer[]>(`/api/v1/quizz/${quizId}/answers`);
            return response.data;
        },
    });
}
