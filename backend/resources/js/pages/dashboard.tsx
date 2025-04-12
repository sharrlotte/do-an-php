import CreateQuizDialog from '@/components/create-quiz-dialog';
import ErrorMessage from '@/components/error-message';
import Loading from '@/components/loading';
import QuizzCard from '@/components/quizz-card';
import { Input } from '@/components/ui/input';
import useQuizziz from '@/hooks/use-quizziz';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trang chủ',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-1 items-center gap-2">
                        <div className="relative max-w-md flex-1">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
                            <Input className="pl-10" placeholder="Tìm kiếm quiz..." />
                        </div>
                    </div>
                    <CreateQuizDialog />
                </div>
                <h1 className="text-xl font-semibold">Quizz của bạn</h1>
                <QuizzList />
            </div>
        </AppLayout>
    );
}

function QuizzList() {
    const { data, isLoading, isError, error } = useQuizziz();

    if (isError) {
        return <ErrorMessage message={error} />;
    }

    if (isLoading) {
        return <Loading />;
    }

    return <section className="grid">{data?.data?.map((q) => <QuizzCard key={q.id} quizz={q} />)}</section>;
}
