export interface UserProfile {
    id: string
    name: string
    role: 'mentor' | 'mentee'
    bio: string
    skills: string[]
    interests: string[]
  }