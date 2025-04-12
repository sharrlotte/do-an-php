"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const MarketplacePage = () => {
    const products = [
        {
            id: 1,
            name: "Gói Quiz Pro",
            description: "Truy cập không giới hạn các quiz và tính năng nâng cao",
            price: "299.000đ",
            features: [
                "Truy cập tất cả quiz",
                "Tính năng nâng cao",
                "Hỗ trợ 24/7",
                "Không quảng cáo"
            ]
        },
        {
            id: 2,
            name: "Gói Premium",
            description: "Tất cả tính năng của Pro + thêm 5 quiz custom",
            price: "499.000đ",
            features: [
                "Tất cả tính năng Pro",
                "5 quiz custom",
                "Hỗ trợ ưu tiên",
                "Báo cáo chi tiết"
            ]
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
                        <h1 className="text-2xl font-bold">Marketplace</h1>
                        <Input placeholder="Tìm kiếm sản phẩm..." className="w-64" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Card key={product.id}>
                                <CardHeader>
                                    <CardTitle>{product.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">{product.description}</p>
                                    <div className="space-y-2 mb-6">
                                        {product.features.map((feature, index) => (
                                            <p key={index} className="text-sm text-muted-foreground">
                                                • {feature}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-start gap-4 mb-4">
                                        <span className="text-2xl font-bold">{product.price}</span>
                                        <Button className="w-full">Mua ngay</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </main>
            <footer className="bg-[#46178f] p-4 text-white text-center">
                © 2025 QuizMaster
            </footer>
        </div>
    );
};

export default MarketplacePage;