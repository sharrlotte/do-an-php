import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { api } from '@/axios';
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
import { toast } from 'sonner';

const joinRoomSchema = z.object({
    roomId: z.string().min(1, 'Vui lòng nhập ID phòng'),
    name: z.string().min(1, 'Vui lòng nhập tên'),
});

type JoinRoomForm = z.infer<typeof joinRoomSchema>;

export default function JoinRoomButton() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<JoinRoomForm>({
        resolver: zodResolver(joinRoomSchema),
    });

    const joinRoomMutation = useMutation({
        mutationFn: async (data: JoinRoomForm) => {
            const response = await api.post(`/api/v1/rooms/${data.roomId}/join`, data);
            return response.data;
        },
        onSuccess: (_, data) => {
            toast.success('Tham gia phòng thành công');
            reset();
            window.location.href = `/play/${data.roomId}`;
        },
        onError: (error) => {
            toast.error('Lỗi khi tham gia phòng: ' + error.message);
        },
    });

    const onSubmit = (data: JoinRoomForm) => {
        joinRoomMutation.mutate(data);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Tham Gia Phòng</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tham Gia Phòng</DialogTitle>
                    <DialogDescription>Nhập ID phòng để tham gia.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <Input id="name" placeholder="Nhập tên" {...register('name')} />
                    <div className="flex items-center gap-2">
                        <Input id="roomId" placeholder="Nhập ID phòng" {...register('roomId')} />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    if (text) {
                                        reset({ roomId: text });
                                    }
                                } catch (err) {
                                    toast.error('Không thể truy cập bộ nhớ đệm: ' + err);
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                            </svg>
                        </Button>
                    </div>
                    {errors.roomId && <p className="text-sm text-red-500">{errors.roomId.message}</p>}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Hủy
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" disabled={joinRoomMutation.isPending}>
                                {joinRoomMutation.isPending ? 'Đang tham gia...' : 'Tham Gia'}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
