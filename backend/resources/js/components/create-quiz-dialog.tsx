import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
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

const createQuizSchema = z.object({
    question: z.string().min(1, 'Vui lòng nhập câu hỏi'),
});

type CreateQuizForm = z.infer<typeof createQuizSchema>;

export default function CreateQuizDialog() {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateQuizForm>({
        resolver: zodResolver(createQuizSchema),
    });

    const createQuizMutation = useMutation({
        mutationFn: async (data: CreateQuizForm) => {
            const response = await axios.post('/api/v1/quizz', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
            toast.success('Tạo quiz thành công');
            reset();
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi tạo quiz');
        },
    });

    const onSubmit = (data: CreateQuizForm) => {
        createQuizMutation.mutate(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Tạo quiz mới</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tạo quiz mới</DialogTitle>
                    <DialogDescription>Tạo một quiz mới để chia sẻ với mọi người.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="question">Câu hỏi</Label>
                        <Input id="question" placeholder="Nhập câu hỏi của bạn" {...register('question')} />
                        {errors.question && <p className="text-sm text-red-500">{errors.question.message}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Hủy
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={createQuizMutation.isPending}>
                            {createQuizMutation.isPending ? 'Đang tạo...' : 'Tạo quiz'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
