"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import Image from "next/image"

type User = {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  status: "active" | "inactive"
}

const users: User[] = [
  {
    id: 1,
    name: "Linh Nguyen",
    email: "linh@example.com",
    avatar: "/avatars/avatar-1.png",
    role: "Admin",
    status: "active",
  },
  {
    id: 2,
    name: "Hoang Tran",
    email: "hoang@example.com",
    avatar: "/avatars/avatar-2.png",
    role: "Premium",
    status: "active",
  },
  {
    id: 3,
    name: "Thao Le",
    email: "thao@example.com",
    avatar: "/avatars/avatar-3.png",
    role: "Guest",
    status: "inactive",
  },
]

export default function AccessPassPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#46178f]">User Access Pass</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between border p-4 rounded-md shadow-sm">
              <div className="flex items-center space-x-4">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-lg">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge
                  variant="outline"
                  className={
                    user.role === "Admin"
                      ? "bg-red-100 text-red-600"
                      : user.role === "Premium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }
                >
                  {user.role}
                </Badge>
                <Badge className={user.status === "active" ? "bg-green-500" : "bg-gray-400"}>
                  {user.status}
                </Badge>
                <Button variant="outline" size="icon">
                  <Pencil size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}