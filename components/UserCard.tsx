import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserProfile } from "@/types"

interface UserCardProps {
  profile: UserProfile
}

export default function UserCard({ profile }: UserCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
        <Badge>{profile.role}</Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-2">{profile.bio}</p>
        <div className="mb-2">
          <strong>Skills:</strong> {profile.skills.join(", ")}
        </div>
        <div>
          <strong>Interests:</strong> {profile.interests.join(", ")}
        </div>
      </CardContent>
      <CardFooter>
        <Button>Connect</Button>
      </CardFooter>
    </Card>
  )
}

