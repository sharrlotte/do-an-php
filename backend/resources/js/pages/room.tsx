import { api } from '@/axios';
import CreateRoomDialog from '@/components/create-room-dialog';
import ErrorMessage from '@/components/error-message';
import Loading from '@/components/loading';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Room } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Phòng',
        href: '/room',
    },
];

export default function Room() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Phòng chơi" />
            <div className="w-full space-y-4 p-4">
                <div className="flex w-full items-center justify-between">
                    <h1>Danh sách phòng</h1>
                    <CreateRoomDialog />
                </div>
                <RoomList />
            </div>
        </AppLayout>
    );
}

function RoomList() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const response = await api.get('/api/v1/rooms');
            return response.data as Room[];
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    if (data?.length === 0) {
        return <div className="mx-auto text-center">Không có phòng</div>;
    }

    return <section className="space-y-2">{data?.map((room) => <RoomCard key={room.id} room={room} />)}</section>;
}

function RoomCard({ room }: { room: Room }) {
    return (
        <Link className="flex rounded-lg border p-3" href={`/room/${room.id}`}>
            <div className="flex w-full justify-between">
                <h2 className="text-lg font-semibold">{room.name}</h2>
                <span className="text-sm">
                    {room.status === 'playing' ? (
                        <span className="text-green-400">Đang chơi</span>
                    ) : room.status === 'finished' ? (
                        <span className="text-blue-400">Đã chơi xong</span>
                    ) : (
                        <span className="text-yellow-300">Đang chờ bắt đầu</span>
                    )}
                </span>
            </div>
        </Link>
    );
}
