import { api } from '@/axios';
import ErrorMessage, { ErrorFallback } from '@/components/error-message';
import Loading from '@/components/loading';
import RoomStatus from '@/components/room-status';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { CurrentQuizz, Player, Quizz, Room, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useInterval } from 'usehooks-ts';

export default function Id({ id }: { id: string }) {
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Phòng',
                    href: '/play',
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
    const queryClient = useQueryClient();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', id],
        queryFn: async () => {
            const response = await api.get(`/api/v1/rooms/${id}`);

            return response.data as Room;
        },
        refetchInterval: 1000,
    });

    useEffect(() => {
        if (data?.next) {
            const timeout = setTimeout(
                () => {
                    queryClient.invalidateQueries({ queryKey: ['room', id], exact: false });
                    queryClient.invalidateQueries({ queryKey: ['room', id, 'quizz'], exact: false });
                },
                new Date(data.next).getTime() - Date.now(),
            );

            return () => clearTimeout(timeout);
        }
    }, [data?.next, id, queryClient]);

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
            </div>
            <div className="h-full space-y-2 overflow-y-auto">
                {data.status === 'on_going' && <CurrentQuizzCard room={data} />}
                <section className="space-y-2 rounded-lg border p-4">
                    <h2 className="text-xl">Danh sách người chơi</h2>
                    <PlayerList roomId={data.id} />
                </section>
            </div>
        </div>
    );
}

function CurrentQuizzCard({ room }: { room: Room }) {
    const { auth } = usePage<SharedData>().props;
    const roomId = room.id;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', roomId, 'current-quizz'],
        queryFn: () => api.get(`/api/v1/rooms/${roomId}/current-quizz`).then((res) => res.data as CurrentQuizz),
        refetchInterval: 1000,
    });

    const [timeLeft, setTimeLeft] = useState(0);

    useInterval(() => {
        if (room.next) {
            const timeLeft = (new Date(room.next + 'Z').getTime() - Date.now()) / 1000;
            setTimeLeft(timeLeft > 0 ? timeLeft : 0);
        }
    }, 100);

    return (
        <div className="space-y-2">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {isLoading && <Loading />}
                {isError && <ErrorMessage message={error} />}
                {data && (
                    <div className="flex w-full flex-col justify-between gap-6 rounded-lg border p-3">
                        <div className="flex gap-2">
                            <span>{timeLeft} giây</span>
                            <span className="text-lg font-semibold">{data?.question}</span>
                        </div>
                        <section className="text-muted-foreground grid w-full grid-cols-2 gap-2">
                            {data?.answer?.map((answer) => (
                                <Button variant="outline" key={answer.id}>
                                    {answer.content}
                                </Button>
                            ))}
                        </section>
                    </div>
                )}
                {auth.user.id === room.ownerId && <RoomQuizzList roomId={roomId} currentId={data?.id} />}
            </ErrorBoundary>
        </div>
    );
}

function RoomQuizzList({ roomId, currentId }: { currentId?: string; roomId: string }) {
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

    return (
        <section className="space-y-2 rounded-lg border p-3">
            {data.map((quizz) => (
                <div
                    key={quizz.id}
                    className={cn('bg-secondary group/item flex items-center rounded-lg border p-3', { 'bg-emerald-300': quizz.id === currentId })}
                >
                    {quizz.question}
                </div>
            ))}
        </section>
    );
}

function PlayerList({ roomId }: { roomId: string }) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', roomId, 'player'],
        queryFn: () => api.get(`/api/v1/rooms/${roomId}/players`).then((res) => res.data as Player[]),
        refetchInterval: 1000,
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

    return data.map((player) => (
        <div key={player.id} className="bg-secondary flex justify-between rounded-lg border p-3">
            <span className="text-lg font-semibold">{player.name}</span>
            <span className="text-muted-foreground">Điểm số: {player.score}</span>
        </div>
    ));
}
