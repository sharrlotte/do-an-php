"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

const GroupsPage = () => {
    const groups = [
        { 
            id: 1, 
            name: "Nhóm Toán Học", 
            description: "Thảo luận và giải đáp các vấn đề về toán",
            members: 156,
            quizzes: 25
        },
        { 
            id: 2, 
            name: "Nhóm Tiếng Anh", 
            description: "Luyện tập và chia sẻ kinh nghiệm học tiếng Anh",
            members: 234,
            quizzes: 42
        },
        { 
            id: 3, 
            name: "Nhóm Lập Trình", 
            description: "Cùng nhau học lập trình và giải thuật",
            members: 189,
            quizzes: 31
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
                        <h1 className="text-2xl font-bold">Danh sách nhóm</h1>
                        <Input placeholder="Tìm kiếm nhóm..." className="w-64" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {groups.map((group) => (
                            <Link href={`/groups/${group.id}`} key={group.id}>
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{group.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4">{group.description}</p>
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>{group.members} thành viên</span>
                                            <span>{group.quizzes} bài quiz</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                    <div className="flex justify-center">
                        <Link href="/create-group">
                            <Button className="w-full md:w-auto">
                                <span>Tạo nhóm mới</span>
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

export default GroupsPage;