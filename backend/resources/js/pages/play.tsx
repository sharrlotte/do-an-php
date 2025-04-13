import JoinRoomButton from '@/components/join-room-button';
import AppLayout from '@/layouts/app-layout';

export default function Play() {
    return (
        <AppLayout>
            <div className="flex h-full w-full items-center justify-center">
                <h1>Tham gia phòng</h1>
                <p>Play the game</p>
                <JoinRoomButton />
            </div>
        </AppLayout>
    );
}
