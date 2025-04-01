import { redirect } from "next/navigation"
import LandingPage from "@/components/landing-page"

export default function Home() {
  // In a real app, you would check if the user is authenticated
  // const isAuthenticated = checkAuth();
  const isAuthenticated = false

  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return <LandingPage />
}

