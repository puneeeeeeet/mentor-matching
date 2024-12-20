import { getMatches } from "@/app/action"
import UserCard from "@/components/UserCard"

export default async function Matches() {
  // In a real application, you would get the userId from the session
  const matches = await getMatches('dummy-user-id')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Matches</h1>
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <UserCard key={match.id} profile={match} />
          ))}
        </div>
      ) : (
        <p>No matches found. Try broadening your skills and interests to find more connections.</p>
      )}
    </div>
  )
}

