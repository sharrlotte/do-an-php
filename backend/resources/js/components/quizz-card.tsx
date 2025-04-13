import { api } from '@/axios';
import DeleteQuizDialog from '@/components/delete-quiz-dialog';
import ErrorMessage from '@/components/error-message';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuizAnswers } from '@/hooks/use-quiz-answers';
import { cn } from '@/lib/utils';
import { QuizAnswer, Quizz } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CreateAnswerDialog from './create-answer-dialog';

export default function QuizzCard({ className, quizz }: { className?: string; quizz: Quizz }) {
    return (
        <div className={cn('group bg-card relative flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-all hover:shadow-md', className)}>
            <div className="flex items-start justify-between gap-4">
                <h2 className="text-card-foreground text-xl leading-tight font-semibold">{quizz.question}</h2>
                <DeleteQuizDialog quizzId={quizz.id} />
            </div>
            <QuizzAnswer quizzId={quizz.id} />
            <div className="mt-4">
                <CreateAnswerDialog quizzId={quizz.id} />
            </div>
        </div>
    );
}

export function QuizzAnswer({ quizzId }: { quizzId: string }) {
    const { data: answers, isLoading, isError, error } = useQuizAnswers(quizzId);

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="mt-4 space-y-2">
            {isLoading ? (
                <div className="animate-pulse space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full rounded" />
                    ))}
                </div>
            ) : (
                answers?.map((answer) => <AnswerCard quizzId={quizzId} key={answer.id} answer={answer} />)
            )}
        </div>
    );
}

export function AnswerCard({ quizzId, answer }: { quizzId: string; answer: QuizAnswer }) {
    const queryClient = useQueryClient();
    const { control, reset, watch, register, setValue } = useForm({
        defaultValues: {
            content: answer.content,
            isAnswer: answer.isAnswer,
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: QuizAnswer) => {
            const response = await api.patch(`/api/v1/answers/${answer.id}`, data);
            return response.data;
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['answers', quizzId] });
        },
        onError: (error) => {
            toast.error('Có lỗi xảy ra khi cập nhật đáp án: ' + error.message);
            reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/api/v1/answers/${answer.id}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['answers', quizzId] });
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi xóa đáp án');
        },
    });

    const throttledSave = useMemo(
        () =>
            debounce((data) => {
                mutation.mutate(data);
            }, 1000),
        [mutation],
    );

    useEffect(() => {
        const subscription = watch((value) => {
            throttledSave(value);
        });
        return () => subscription.unsubscribe();
    }, [throttledSave, watch]);

    return (
        <div className={`group/item bg-secondary border-border flex justify-between rounded-lg border p-3`}>
            <div>
                <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                        <Input type="text" {...field} className={`w-full border-none p-0 text-lg ${watch('isAnswer') ? 'text-green-300' : ''}`} />
                    )}
                />
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="isAnswer"
                        {...register('isAnswer')}
                        checked={watch('isAnswer')}
                        onCheckedChange={(value) => setValue('isAnswer', value === 'indeterminate' ? false : value)}
                    />
                    <Label htmlFor="isAnswer">Đáp án đúng</Label>
                </div>
            </div>
            <Button
                className="bg-destructive hover:bg-destructive flex group-hover/item:flex md:hidden"
                onClick={() => deleteMutation.mutate()}
                variant="outline"
                disabled={deleteMutation.isPending}
            >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
        </div>
    );
}
