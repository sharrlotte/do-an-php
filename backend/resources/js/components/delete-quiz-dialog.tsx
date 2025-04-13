import { api } from '@/axios';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteQuizDialog({ quizzId }: { quizzId: string }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            await api.delete(`/api/v1/quizz/${quizzId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes'] });
            toast.success('Xóa quiz thành công');
        },
        onError: (error) => {
            toast.error('Có lỗi xảy ra khi xóa quiz: ' + error.message);
        },
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <Trash2 className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xóa quiz</DialogTitle>
                    <DialogDescription>Bạn có chắc chắn muốn xóa quiz này không?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => mutation.reset()}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={() => mutation.mutate()}>
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
