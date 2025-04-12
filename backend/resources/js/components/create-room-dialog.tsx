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

const createRoomSchema = z.object({
    name: z.string().min(1, 'Vui lòng nhập tên phòng'),
});

type CreateRoomForm = z.infer<typeof createRoomSchema>;

export default function CreateRoomDialog() {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateRoomForm>({
        resolver: zodResolver(createRoomSchema),
    });

    const createRoomMutation = useMutation({
        mutationFn: async (data: CreateRoomForm) => {
            const response = await axios.post('/api/v1/rooms', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            toast.success('Tạo phòng thành công');
            reset();
        },
        onError: (error) => {
            toast.error('Có lỗi xảy ra khi tạo phòng: ' + error.message);
        },
    });

    const onSubmit = (data: CreateRoomForm) => {
        createRoomMutation.mutate(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Tạo phòng mới</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tạo phòng mới</DialogTitle>
                    <DialogDescription>Tạo một phòng mới để chia sẻ với mọi người.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên phòng</Label>
                        <Input id="name" placeholder="Nhập tên phòng của bạn" {...register('name')} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Hủy
                            </Button>
                        </DialogClose>

                        <DialogClose asChild>
                            <Button type="submit" disabled={createRoomMutation.isPending}>
                                {createRoomMutation.isPending ? 'Đang tạo...' : 'Tạo phòng'}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
