import { api } from '@/axios';
import AddQuizToRoom from '@/components/add-quiz-to-room';
import ErrorMessage from '@/components/error-message';
import Loading from '@/components/loading';
import QuizzCard from '@/components/quizz-card';
import RoomStatus from '@/components/room-status';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { Player, Quizz, Room } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Id({ id }: { id: string }) {
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Phòng',
                    href: '/room',
                },
                {
                    title: id,
                    href: `/room/${id}`,
                },
            ]}
        >
            <RoomPage id={id} />
        </AppLayout>
    );
}

function RoomPage({ id }: { id: string }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', id],
        queryFn: async () => {
            const response = await api.get(`/api/v1/rooms/${id}`);

            return response.data as Room;
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    if (!data) {
        return <p className="text-muted-foreground m-auto">Không tìm thấy phòng</p>;
    }

    return (
        <div className="flex h-full flex-col space-y-4 overflow-hidden p-4">
            <div className="flex w-full justify-between">
                <h1 className="flex items-center gap-1 text-3xl font-semibold">
                    <span>{data.name}</span>
                    <RoomStatus status={data.status} />
                </h1>
                <div className="ml-auto flex items-center gap-1">
                    <Button
                        variant="outline"
                        onClick={() => {
                            navigator.clipboard.writeText(data.id);
                            toast.success('Đã sao chép mã phòng');
                        }}
                        className="ml-2"
                    >
                        Sao chép mã phòng
                    </Button>
                    <AddQuizToRoom roomId={data.id} />
                </div>
            </div>
            <div className="h-full space-y-2 overflow-y-auto">
                <section className="space-y-2 rounded-lg border p-4">
                    <h2 className="text-xl">Danh sách người chơi</h2>
                    <PlayerList roomId={data.id} />
                </section>
                <section className="space-y-2 rounded-lg border p-4">
                    <h2 className="text-xl">Danh sách câu đố</h2>
                    <RoomQuizzList roomId={data.id} />
                </section>
            </div>
            <div className="mt-auto flex w-full justify-end">{data.status !== 'on_going' && <StartButton roomId={data.id} />}</div>
        </div>
    );
}

function StartButton({ roomId }: { roomId: string }) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: () => api.post(`/api/v1/rooms/${roomId}/start`),
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['room'], exact: false });
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="bg-emerald-400 text-white hover:bg-emerald-500 hover:text-white">Bắt đầu</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>Bắt đầu trò chơi</AlertDialogTitle>
                <AlertDialogDescription>Một khi bắt đầu thì không thể dừng lại cho đến khi kết thúc</AlertDialogDescription>
                <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
                <AlertDialogAction disabled={isPending} onClick={() => mutate()}>
                    Bắt đầu
                </AlertDialogAction>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function PlayerList({ roomId }: { roomId: string }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', roomId, 'player'],
        queryFn: () => api.get(`/api/v1/rooms/${roomId}/players`).then((res) => res.data as Player[]),
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    if (!data || data.length === 0) {
        return <span className="text-muted-foreground m-auto">Chưa có người chơi tham gia</span>;
    }

    return data
        .sort((a, b) => b.score - a.score)
        .map((player) => (
            <div className="bg-secondary flex justify-between rounded-lg border p-3">
                <span className="text-lg font-semibold">{player.name}</span>
                <span className="text-muted-foreground">Điểm số: {player.score}</span>
            </div>
        ));
}

function RoomQuizzList({ roomId }: { roomId: string }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', roomId, 'quizz'],
        queryFn: () => api.get(`/api/v1/rooms/${roomId}/quizz`).then((res) => res.data as Quizz[]),
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    if (!data || data.length === 0) {
        return <span className="text-muted-foreground m-auto">Không có quizz, hãy thêm quizz</span>;
    }

    return data.map((quizz) => (
        <Dialog key={quizz.id}>
            <div className="bg-secondary group/item flex items-center rounded-lg border p-3">
                <DialogTrigger className="w-full cursor-pointer text-start">{quizz.question}</DialogTrigger>
                <RemoveQuizzFromRoomButton quizzId={quizz.id} roomId={roomId} />
            </div>
            <DialogContent className="p-6">
                <QuizzCard className="border-none bg-transparent" quizz={quizz} />
            </DialogContent>
        </Dialog>
    ));
}

function RemoveQuizzFromRoomButton({ roomId, quizzId }: { roomId: string; quizzId: string }) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: () => api.delete(`/api/v1/rooms/${roomId}/quizz/${quizzId}`),
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['room', roomId, 'quizz'] });
        },
    });

    return (
        <Button className="opacity-100 group-hover/item:opacity-100 md:opacity-0" variant="destructive" disabled={isPending} onClick={() => mutate()}>
            {isPending ? 'Đang xóa' : 'Xóa'}
        </Button>
    );
}
