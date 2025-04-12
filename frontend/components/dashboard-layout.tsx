"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Library, Search, BarChart, Users, ShoppingBag, Key, MessageSquare, Menu, X, Bell, User } from "lucide-react";

interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const pathname = usePathname();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navigation = [
		{ name: "Home", href: "/dashboard", icon: Home },
		{ name: "Discover", href: "/discover", icon: Search },
		{ name: "Library", href: "/library", icon: Library },
		{ name: "Reports", href: "/reports", icon: BarChart },
		{ name: "Groups", href: "/groups", icon: Users },
		{ name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
		{ name: "AccessPass", href: "/access-pass", icon: Key },
		{ name: "Channels", href: "/channels", icon: MessageSquare },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Mobile sidebar toggle */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b flex items-center justify-between p-4">
				<Link href="/dashboard" className="text-2xl font-bold text-[#46178f]">
					QuizMaster!
				</Link>
				<Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
					{sidebarOpen ? <X /> : <Menu />}
				</Button>
			</div>

			{/* Mobile sidebar */}
			{sidebarOpen && (
				<div className="lg:hidden fixed inset-0 z-10 bg-black/50" onClick={() => setSidebarOpen(false)}>
					<div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
						<div className="h-16 flex items-center px-6 border-b">
							<Link href="/dashboard" className="text-2xl font-bold text-[#46178f]">
								QuizMaster!
							</Link>
						</div>
						<nav className="p-4 space-y-1">
							{navigation.map((item) => {
								const isActive = pathname === item.href;
								return (
									<Link
										key={item.name}
										href={item.href}
										className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
											isActive ? "bg-[#46178f] text-white" : "text-gray-700 hover:bg-gray-100"
										}`}
									>
										<item.icon className="mr-3 h-5 w-5" />
										{item.name}
									</Link>
								);
							})}
						</nav>
					</div>
				</div>
			)}

			{/* Desktop sidebar */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
				<div className="flex flex-col flex-grow bg-white border-r">
					<div className="h-16 flex items-center px-6 border-b">
						<Link href="/dashboard" className="text-2xl font-bold text-[#46178f]">
							QuizMaster!
						</Link>
					</div>
					<nav className="flex-1 p-4 space-y-1">
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.name}
									href={item.href}
									className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
										isActive ? "bg-[#46178f] text-white" : "text-gray-700 hover:bg-gray-100"
									}`}
								>
									<item.icon className="mr-3 h-5 w-5" />
									{item.name}
								</Link>
							);
						})}
					</nav>
				</div>
			</div>

			{/* Main content */}
			<div className="lg:pl-64 pt-16 lg:pt-0">
				<header className="bg-white border-b">
					<div className="flex items-center justify-between p-4">
						<div className="flex-1 flex">
							<div className="max-w-md w-full">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
									<input
										type="text"
										placeholder="Search public content"
										className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46178f]"
									/>
								</div>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Button className="bg-[#1a73e8] hover:bg-[#1765cc]">Create</Button>
							<Button variant="ghost" size="icon">
								<Bell size={20} />
							</Button>
							<Link href="/profile">
								<Button variant="ghost" size="icon" className="rounded-full">
									<User size={20} />
								</Button>
							</Link>
						</div>
					</div>
				</header>
				<main>{children}</main>
			</div>
		</div>
	);
}
