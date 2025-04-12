import { Room } from '@/types';

export default function RoomStatus({ status }: { status: Room['status'] }) {
    return (
        <span className="text-sm">
            {status === 'on_going' ? (
                <span className="rounded-full bg-emerald-600 p-1">Đang chơi</span>
            ) : status === 'finished' ? (
                <span className="rounded-full bg-blue-400 p-1">Đã chơi xong</span>
            ) : (
                <span className="rounded-full bg-yellow-600 p-1">Đang chờ bắt đầu</span>
            )}
        </span>
    );
}
