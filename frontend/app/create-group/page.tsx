"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

const CreateGroupPage = () => {
    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log('Group created');
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-[#46178f] p-4 text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="text-2xl font-bold">QuizMaster!</div>
                </div>
            </header>
            <main className="container mx-auto p-4 flex-1">
                <h1 className="text-2xl font-bold mb-4 text-center">Tạo Nhóm Mới</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Tên nhóm" className="w-full p-2 border rounded" required />
                    <textarea placeholder="Mô tả nhóm" className="w-full p-2 border rounded" required></textarea>
                    <Button className="w-full">
                        <span>Tạo Nhóm</span>
                    </Button>
                </form>
            </main>
            <footer className="bg-[#46178f] p-4 text-white text-center">
                © 2025 QuizMaster
            </footer>
        </div>
    );
};

export default CreateGroupPage;