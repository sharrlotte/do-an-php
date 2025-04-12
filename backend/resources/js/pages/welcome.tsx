import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col">
                <header className="bg-[#46178f] p-4 text-white">
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="text-2xl font-bold">QuizMaster!</div>
                        {!auth.user && (
                            <div className="space-x-2">
                                <Link href="/login">
                                    <Button
                                        variant="outline"
                                        className="border-[#46178f] bg-white text-[#46178f] hover:border-white hover:bg-[#46178f] hover:text-white"
                                    >
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button
                                        variant="outline"
                                        className="border-[#46178f] bg-white text-[#46178f] hover:border-white hover:bg-[#46178f] hover:text-white"
                                    >
                                        Đăng ký
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <main className="container mx-auto flex-1 px-4 py-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-5xl font-bold">Tạo bài trắc nghiệm hấp dẫn trong vài phút</h1>
                        <p className="mb-8 text-xl">
                            Làm cho việc học trở nên thú vị với nền tảng trắc nghiệm tương tác của chúng tôi. Tạo, chia sẻ và chơi các bài trắc nghiệm
                            cùng bạn bè và đồng nghiệp.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-[#46178f] px-8 text-white hover:bg-[#3b1277]">
                                    Bắt đầu miễn phí
                                </Button>
                            </Link>
                            <Link href="/how-it-works">
                                <Button size="lg" variant="outline" className="px-8">
                                    Tìm hiểu thêm
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 grid gap-8 md:grid-cols-3">
                        <a href="/create-quiz" className="rounded-lg p-6 shadow-md">
                            <h2 className="mb-3 text-xl font-semibold">Tạo</h2>
                            <p>Thiết kế bài trắc nghiệm hấp dẫn với nhiều loại câu hỏi, bộ đếm thời gian và hệ thống tính điểm.</p>
                        </a>
                        <div className="rounded-lg p-6 shadow-md">
                            <h2 className="mb-3 text-xl font-semibold">Chia sẻ</h2>
                            <p>Mời người khác tham gia bài trắc nghiệm của bạn với mã trò chơi hoặc đường link đơn giản.</p>
                        </div>
                        <a href="/join" className="rounded-lg p-6 shadow-md">
                            <h2 className="mb-3 text-xl font-semibold">Chơi</h2>
                            <p>Thi đấu theo thời gian thực và xem ai có thể trả lời đúng nhanh nhất.</p>
                        </a>
                    </div>
                </main>

                <footer className="bg-gray-100 py-6">
                    <div className="container mx-auto text-center text-gray-600">
                        <p>© 2025 QuizMaster. Đã đăng ký bản quyền.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
