import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to Mentorship Matching Platform</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Connect with mentors and mentees in your field. Grow your skills and help others succeed.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/register">Get Started</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}

