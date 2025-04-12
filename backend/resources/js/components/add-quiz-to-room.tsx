import { api } from '@/axios';
import ErrorMessage from '@/components/error-message';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import useQuizziz from '@/hooks/use-quizziz';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounceValue } from 'usehooks-ts';

export default function AddQuizToRoom({ roomId }: { roomId: string }) {
    const [q, setQ] = useDebounceValue('', 500);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <span>Thêm quizz</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="flex h-full max-h-[90vh] flex-col p-10">
                <DialogTitle className="h-fit">Thêm quiz vào phòng</DialogTitle>
                <DialogDescription className="h-fit">Danh sách quiz của bạn sẽ được hiển thị ở đây</DialogDescription>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-md flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                            <Input className="pl-10" placeholder="Tìm kiếm quiz..." onChange={(event) => setQ(event.currentTarget.value)} />
                        </div>
                    </div>
                </div>
                <div className="flex h-full max-h-full flex-1 flex-col gap-4 overflow-y-auto rounded-xl">
                    <QuizzList q={q} roomId={roomId} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
function QuizzList({ q, roomId }: { q: string; roomId: string }) {
    const { data, isLoading, isError, error } = useQuizziz(q);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (quizzId: string) => api.post(`/api/v1/rooms/${roomId}/quizz`, { quizzId }),
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['room', roomId, 'quizz'] });
        },
    });

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    if (isLoading) {
        return <Loading />;
    }

    if (data?.data?.length === 0) {
        return <p className="text-muted-foreground m-auto">Không có quizz nào</p>;
    }

    return (
        <section className="grid gap-2">
            {data?.data?.map((q) => (
                <div className="cursor-pointer" key={q.id} onClick={() => mutation.mutate(q.id)}>
                    <div className="group bg-card relative flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <h2 className="text-card-foreground text-lg leading-tight font-semibold">{q.question}</h2>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
