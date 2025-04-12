"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

const ChannelsPage = () => {
    const channels = [
        {
            id: 1,
            name: "Kênh Toán Học",
            description: "Học và ôn tập các chủ đề toán học",
            category: "Toán Học",
            members: 1234,
            avatar: "/images/channels/math.jpg"
        },
        {
            id: 2,
            name: "Kênh Tiếng Anh",
            description: "Luyện thi IELTS và TOEFL",
            category: "Tiếng Anh",
            members: 856,
            avatar: "/images/channels/english.jpg"
        },
        {
            id: 3,
            name: "Kênh Khoa Học Tự Nhiên",
            description: "Khám phá thế giới khoa học",
            category: "Khoa Học",
            members: 789,
            avatar: "/images/channels/science.jpg"
        }
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-[#46178f] p-4 text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-2xl font-bold">QuizMaster!</div>
                </div>
            </header>
            <main className="container mx-auto p-4 flex-1">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Danh sách kênh</h1>
                        <Input placeholder="Tìm kiếm kênh..." className="w-64" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {channels.map((channel) => (
                            <Link href={`/channels/${channel.id}`} key={channel.id}>
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center text-center">
                                            <img 
                                                src={channel.avatar} 
                                                alt={channel.name}
                                                className="w-24 h-24 rounded-full mb-4"
                                            />
                                            <CardHeader>
                                                <CardTitle>{channel.name}</CardTitle>
                                            </CardHeader>
                                            <p className="text-muted-foreground mb-4">{channel.description}</p>
                                            <div className="flex justify-between w-full text-sm text-muted-foreground">
                                                <span>{channel.category}</span>
                                                <span>{channel.members} thành viên</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <Link href="/create-channel">
                            <Button className="w-full md:w-auto">
                                <span>Tạo kênh mới</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <footer className="bg-[#46178f] p-4 text-white text-center">
                © 2025 QuizMaster
            </footer>
        </div>
    );
};

export default ChannelsPage;