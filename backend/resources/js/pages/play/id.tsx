import { api } from '@/axios';
import ErrorMessage, { ErrorFallback } from '@/components/error-message';
import Loading from '@/components/loading';
import RoomStatus from '@/components/room-status';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { CurrentQuizz, Player, Quizz, Room, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
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
            {data.status === 'starting' ? (
                <span className="m-auto animate-bounce text-3xl">Trò chơi sắp bắt đầu</span>
            ) : data.status === 'ended' ? (
                <RankResult roomId={data.id} />
            ) : (
                <div className="h-full space-y-2 overflow-y-auto">
                    {data.status === 'on_going' && <CurrentQuizzCard room={data} />}
                    <section className="space-y-2 rounded-lg border p-4">
                        <div className="flex w-full justify-between text-sm">
                            <h2 className="text-xl">Danh sách người chơi</h2>
                            <span>Điểm số</span>
                        </div>
                        <PlayerList roomId={data.id} />
                    </section>
                </div>
            )}
        </div>
    );
}

function CurrentQuizzCard({ room }: { room: Room }) {
    const { auth } = usePage<SharedData>().props;
    const roomId = room.id;
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['room', roomId, 'current-quizz'],
        queryFn: () => api.get(`/api/v1/rooms/${roomId}/current-quizz`).then((res) => res.data as CurrentQuizz),
        refetchInterval: 1000,
    });

    const [timeLeft, setTimeLeft] = useState(20);

    useInterval(() => {
        if (room.next) {
            const timeLeft = (new Date(room.next + 'Z').getTime() - Date.now()) / 1000;

            setTimeLeft(Math.floor(timeLeft > 0 ? timeLeft : 0));

            if (timeLeft <= 0) {
                queryClient.invalidateQueries({ queryKey: ['room', roomId, 'player'] });
            }
        }
    }, 100);

    if (data && 'done' in data) {
        return (
            <div className="flex w-full flex-col justify-between gap-6 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                    <span>Đã kết thúc</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {isLoading && <Loading />}
                {isError && <ErrorMessage message={error} />}
                {data && (
                    <motion.div
                        layout
                        exit={{
                            x: '-100%',
                        }}
                        className="relative flex w-full flex-col justify-between gap-6 rounded-lg border p-3"
                    >
                        <div
                            className={cn(
                                'pointer-events-none absolute inset-0 z-50 hidden h-full items-center justify-center rounded-lg bg-white/20 text-center backdrop-blur-sm backdrop-brightness-90',
                                {
                                    flex: timeLeft <= 0,
                                },
                            )}
                        >
                            Đã hết thời gian, chờ câu hỏi tiếp theo
                        </div>
                        <div className="flex flex-col gap-2">
                            <span
                                className={cn('w-[200px] text-sm text-emerald-500', {
                                    'text-red-500': timeLeft <= 5,
                                    'text-yellow-500': timeLeft <= 10,
                                })}
                            >
                                {timeLeft} giây
                            </span>
                            <span className="text-lg font-semibold">{data?.question}</span>
                        </div>
                        <AnswerList roomId={room.id} answers={data.answer} />
                    </motion.div>
                )}
                {auth.user.id === room.ownerId && <RoomQuizzList roomId={roomId} currentId={data?.id} />}
            </ErrorBoundary>
        </div>
    );
}

function AnswerList({ answers, roomId }: { roomId: string; answers: { id: string; content: string }[] }) {
    const queryClient = useQueryClient();
    const {
        mutate: submitAnswer,
        isPending,
        isSuccess,
        variables,
    } = useMutation({
        mutationKey: ['room', roomId, 'answer', answers],
        mutationFn: (answerId: string) => api.post(`/api/v1/rooms/${roomId}/answer`, { answerId }).then((res) => res.data as { bonus: number }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['room', roomId, 'player'] });
            if (data.bonus > 0) toast.success(`Đáp án đúng, bạn được cộng thêm ${data.bonus} điểm`);
        },
    });

    return (
        <section className="text-muted-foreground grid w-full grid-cols-2 gap-2">
            {answers.map((answer) => (
                <Button
                    className={cn({
                        'bg-emerald-500 text-white': variables === answer.id,
                    })}
                    variant="outline"
                    key={answer.id}
                    disabled={isPending || isSuccess}
                    onClick={() => submitAnswer(answer.id)}
                >
                    {answer.content}
                </Button>
            ))}
        </section>
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
            <div>
                <h2 className="text-xl">Danh sách câu hỏi</h2>
                <p className="text-muted-foreground text-sm">Chỉ chủ phòng có thể thấy</p>
            </div>
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

    return data
        .sort((a, b) => b.score - a.score)
        .map((player) => (
            <motion.div layout id={player.id} key={player.id} className="bg-secondary flex justify-between rounded-lg border p-3">
                <span className="text-lg font-semibold">{player.name}</span>
                <span className="text-muted-foreground">
                    <Counter to={player.score} />
                </span>
            </motion.div>
        ));
}

function RankResult({ roomId }: { roomId: string }) {
    const { data } = useQuery({
        queryKey: ['room', roomId, 'player'],
        queryFn: () => api.get(`/api/v1/rooms/${roomId}/players`).then((res) => res.data as Player[]),
        refetchInterval: 1000,
    });

    if (!data) {
        return null;
    }

    const sortedPlayers = data.sort((a, b) => b.score - a.score);
    const [first, second, third, ...others] = sortedPlayers;

    return (
        <div className="flex h-full flex-col items-center gap-8">
            <h1 className="text-4xl font-bold">Kết quả</h1>

            <div className="flex items-end gap-4">
                {second && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="border-silver bg-secondary relative h-24 w-24 overflow-hidden rounded-full border-4">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">2</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-semibold">{second.name}</span>
                            <Counter to={second.score} />
                        </div>
                        <div className="h-32 w-24 rounded-t-lg bg-gray-200" />
                    </motion.div>
                )}

                {first && (
                    <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center gap-2">
                        <div className="bg-secondary relative h-32 w-32 overflow-hidden rounded-full border-4 border-yellow-500">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">👑</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-xl font-bold">{first.name}</span>
                            <Counter to={first.score} />
                        </div>
                        <div className="h-40 w-32 rounded-t-lg bg-yellow-500" />
                    </motion.div>
                )}

                {third && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="bg-secondary relative h-20 w-20 overflow-hidden rounded-full border-4 border-amber-700">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">3</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-semibold">{third.name}</span>
                            <Counter to={third.score} />
                        </div>
                        <div className="h-24 w-20 rounded-t-lg bg-amber-700" />
                    </motion.div>
                )}
            </div>

            {others.length > 0 && (
                <div className="mt-8 w-full max-w-md space-y-2">
                    {others.map((player, index) => (
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            key={player.id}
                            className="bg-secondary flex items-center justify-between rounded-lg border p-3"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">{index + 4}</span>
                                <span className="font-semibold">{player.name}</span>
                            </div>
                            <Counter to={player.score} />
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { animate, motion } from 'framer-motion';

function Counter({ to }: { to: number }) {
    const nodeRef = useRef<HTMLParagraphElement>(null);
    const prevValue = useRef(0);

    useEffect(() => {
        const node = nodeRef.current;
        const from = prevValue.current;

        const controls = animate(from, to, {
            duration: 0.3,
            onUpdate(value) {
                if (node) node.textContent = value.toFixed(0);
            },
        });

        prevValue.current = to;
        return () => controls.stop();
    }, [to]);

    return <p ref={nodeRef} />;
}
