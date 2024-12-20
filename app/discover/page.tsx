import { getUserProfiles } from "@/app/action"
import UserCard from "@/components/UserCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default async function Discover() {
  const profiles = await getUserProfiles()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Discover Mentors and Mentees</h1>
      <form className="mb-8 flex items-end space-x-4">
        <div className="flex-grow">
          <Label htmlFor="search">Search by skill or interest</Label>
          <Input id="search" name="search" placeholder="e.g. JavaScript, Machine Learning" />
        </div>
        <Button type="submit">Search</Button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <UserCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  )
}

