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
                                    <Button variant="outline" className="border-white text-blue-800 hover:bg-white/20 hover:text-white">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="outline" className="border-white text-blue-800 hover:bg-white/20 hover:text-white">
                                        Sign up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </header>

                <main className="container mx-auto flex-1 px-4 py-12">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-5xl font-bold">Create engaging quizzes in minutes</h1>
                        <p className="mb-8 text-xl">
                            Make learning awesome with our interactive quiz platform. Create, share, and play quizzes with friends and colleagues.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-[#46178f] px-8 text-white hover:bg-[#3b1277]">
                                    Get started for free
                                </Button>
                            </Link>
                            <Link href="/how-it-works">
                                <Button size="lg" variant="outline" className="px-8">
                                    Learn more
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 grid gap-8 md:grid-cols-3">
                        <a href="/create-quiz" className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-3 text-xl font-semibold">Create</h2>
                            <p>Design engaging quizzes with multiple question types, timers, and point systems.</p>
                        </a>
                        <div className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-3 text-xl font-semibold">Share</h2>
                            <p>Invite others to join your quiz with a simple game code or link.</p>
                        </div>
                        <a href="/join" className="rounded-lg bg-white p-6 shadow-md">
                            <h2 className="mb-3 text-xl font-semibold">Play</h2>
                            <p>Compete in real-time and see who can answer correctly the fastest.</p>
                        </a>
                    </div>
                </main>

                <footer className="bg-gray-100 py-6">
                    <div className="container mx-auto text-center text-gray-600">
                        <p>© 2025 QuizMaster. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
