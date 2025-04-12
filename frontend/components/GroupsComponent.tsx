"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const GroupsComponent = () => {
    const groups = [
        { id: 1, name: "Nhóm 1", description: "Mô tả nhóm 1" },
        { id: 2, name: "Nhóm 2", description: "Mô tả nhóm 2" },
        { id: 3, name: "Nhóm 3", description: "Mô tả nhóm 3" },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-[#46178f] p-4 text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-2xl font-bold">QuizMaster!</div>
                </div>
            </header>
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-2xl font-bold mb-4 text-center">Danh sách nhóm</h1>
                <ul className="space-y-4">
                    {groups.map(group => (
                        <li key={group.id} className="p-4 border rounded shadow-sm">
                            <h2 className="text-lg font-semibold">{group.name}</h2>
                            <p className="text-sm text-gray-600">{group.description}</p>
                        </li>
                    ))}
                </ul>
                <Link href="/create-group">
                    <Button className="w-full">
                        <span>Tạo Nhóm</span>
                    </Button>
                </Link>
            </main>
            <footer className="bg-[#46178f] p-4 text-white text-center">
                © 2025 QuizMaster
            </footer>
        </div>
    );
};

export default GroupsComponent;