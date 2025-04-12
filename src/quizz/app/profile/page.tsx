"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Edit, Save } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  avatar: string
  bio: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedName, setUpdatedName] = useState("")
  const [updatedEmail, setUpdatedEmail] = useState("")
  const [updatedBio, setUpdatedBio] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      const userData = {
        name: "John Doe",
        email: "johndoe@example.com",
        avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        bio: "👋 Hello! I'm a full-stack developer who loves building beautiful web experiences.",
      }

      setUser(userData)
      setUpdatedName(userData.name)
      setUpdatedEmail(userData.email)
      setUpdatedBio(userData.bio)
    }

    fetchData()
  }, [])

  const handleEdit = () => setIsEditing(true)
  const handleSave = () => {
    setIsEditing(false)
    setUser({
      ...user!,
      name: updatedName,
      email: updatedEmail,
      bio: updatedBio,
    })
  }

  if (!user) return <div className="text-center pt-10">Loading...</div>

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-purple-100 to-blue-100 px-4 py-12">
      <Card className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="flex flex-col items-center text-center bg-gradient-to-r from-[#46178f] to-[#6234db] text-white py-10 space-y-4">
          <img
            alt={user.name}
            src={user.avatar}
            className="w-28 h-28 rounded-full border-4 border-white shadow-md"
          />
          <div>
            <CardTitle className="text-3xl font-bold">{user.name}</CardTitle>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#46178f] transition"
            onClick={isEditing ? handleSave : handleEdit}
          >
            {isEditing ? (
  <div className="flex items-center space-x-2">
    <Save className="text-black" size={18} />
    <span className="text-black">Save</span>
  </div>
) : (
  <div className="flex items-center space-x-2">
    <Edit className="text-black" size={18} />
    <span className="text-black">Edit Profile</span>
  </div>
)}
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-base font-semibold">Bio</Label>
            {isEditing ? (
              <Input
                className="mt-1"
                value={updatedBio}
                onChange={(e) => setUpdatedBio(e.target.value)}
              />
            ) : (
              <p className="text-gray-700 mt-1">{user.bio}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-semibold">Full Name</Label>
              {isEditing ? (
                <Input
                  className="mt-1"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                />
              ) : (
                <p className="text-gray-700 mt-1">{user.name}</p>
              )}
            </div>

            <div>
              <Label className="text-base font-semibold">Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  className="mt-1"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
              ) : (
                <p className="text-gray-700 mt-1">{user.email}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}