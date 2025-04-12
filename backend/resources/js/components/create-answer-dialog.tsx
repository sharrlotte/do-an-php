import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '@/axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const createAnswerSchema = z.object({
    content: z.string().min(1, 'Vui lòng nhập nội dung đáp án'),
    isAnswer: z.boolean(),
});

type CreateAnswerForm = z.infer<typeof createAnswerSchema>;

interface CreateAnswerDialogProps {
    quizzId: string;
}

export default function CreateAnswerDialog({ quizzId }: CreateAnswerDialogProps) {
    const queryClient = useQueryClient();

    const {
        setValue,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateAnswerForm>({
        resolver: zodResolver(createAnswerSchema),
        defaultValues: {
            isAnswer: false,
            content: '',
        },
    });

    const createAnswerMutation = useMutation({
        mutationFn: async (data: CreateAnswerForm) => {
            const response = await api.post(`/api/v1/quizz/${quizzId}/answers`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['answers', quizzId] });
            reset();
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi tạo đáp án');
        },
    });

    const onSubmit = (data: CreateAnswerForm) => {
        createAnswerMutation.mutate(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Thêm đáp án</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm đáp án mới</DialogTitle>
                    <DialogDescription>Thêm một đáp án mới cho câu hỏi này.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">Nội dung đáp án</Label>
                        <Input id="content" placeholder="Nhập nội dung đáp án" {...register('content')} />
                        {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isAnswer"
                            {...register('isAnswer')}
                            onCheckedChange={(value) => setValue('isAnswer', value === 'indeterminate' ? false : value)}
                        />
                        <Label htmlFor="isAnswer">Đáp án đúng</Label>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Hủy
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" disabled={createAnswerMutation.isPending}>
                                {createAnswerMutation.isPending ? 'Đang tạo...' : 'Thêm đáp án'}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
