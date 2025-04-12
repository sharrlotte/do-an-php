import { api } from '@/axios';
import { Pagination, Quizz } from '@/types';
import { useQuery } from '@tanstack/react-query';

export default function useQuizziz(q?: string) {
    return useQuery({
        queryKey: ['quizzes', q],
        queryFn: () =>
            api
                .get('/api/v1/quizz', {
                    params: {
                        page: 1,
                        size: 100,
                        q,
                    },
                })
                .then((res) => res.data as Pagination<Quizz>),
    });
}
