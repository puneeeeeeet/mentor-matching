'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { setupProfile } from "@/app/action"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      // In a real application, you would get the userId from the session
      formData.append('userId', 'dummy-user-id')
      const result = await setupProfile(formData)

      if (result.success) {
        toast({
          title: "Profile setup successful",
          description: "Your profile has been created.",
        })
        router.push('/discover')
      }
    } catch (error) {
      toast({
        title: "Profile setup failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Set Up Your Profile</h1>
      <form onSubmit={onSubmit}>
        <div className="space-y-6">
          <div>
            <Label>I want to be a:</Label>
            <RadioGroup defaultValue="mentor" name="role" className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mentor" id="mentor" />
                <Label htmlFor="mentor">Mentor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mentee" id="mentee" />
                <Label htmlFor="mentee">Mentee</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input id="skills" name="skills" placeholder="e.g. JavaScript, React, Node.js" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interests">Interests (comma-separated)</Label>
            <Input id="interests" name="interests" placeholder="e.g. Web Development, Machine Learning, UX Design" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" placeholder="Tell us about yourself..." required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}

