'use server'

import { UserProfile } from "@/types"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const client = await clientPromise
  const db = client.db("mentorship_platform")

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Insert the new user
  const result = await db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  })

  return { success: true, userId: result.insertedId.toString() }
}

export async function loginUser(formData: FormData) {
  const client = await clientPromise
  const db = client.db("mentorship_platform")

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await db.collection("users").findOne({ email })

  if (!user) {
    throw new Error("User not found")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error("Invalid password")
  }

  // In a real application, you would create a session or JWT here
  return { success: true, userId: user._id }
}

export async function setupProfile(formData: FormData) {
  const client = await clientPromise
  const db = client.db("mentorship_platform")

  const userId = formData.get('userId') as string
  const role = formData.get('role') as string
  const skills = (formData.get('skills') as string).split(',').map(skill => skill.trim())
  const interests = (formData.get('interests') as string).split(',').map(interest => interest.trim())
  const bio = formData.get('bio') as string

  const result = await db.collection("profiles").updateOne(
    { userId: new ObjectId(userId) },
    {
      $set: {
        role,
        skills,
        interests,
        bio,
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  )

  return { success: true, profileId: result.upsertedId || userId }
}

export async function getUserProfiles(): Promise<UserProfile[]> {
  const client = await clientPromise
  const db = client.db("mentorship_platform")

  const profiles = await db.collection("profiles")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          id: { $toString: "$_id" },
          name: "$user.name",
          role: 1,
          bio: 1,
          skills: 1,
          interests: 1
        }
      }
    ])
    .toArray()

  return profiles as UserProfile[]
}

export async function getMatches(userId: string): Promise<UserProfile[]> {
  const client = await clientPromise
  const db = client.db("mentorship_platform")

  const userProfile = await db.collection("profiles").findOne({ userId: new ObjectId(userId) })

  if (!userProfile) {
    throw new Error("User profile not found")
  }

  const matches = await db.collection("profiles")
    .aggregate([
      {
        $match: {
          userId: { $ne: new ObjectId(userId) },
          role: userProfile.role === 'mentor' ? 'mentee' : 'mentor',
          $or: [
            { skills: { $in: userProfile.interests } },
            { interests: { $in: userProfile.skills } }
          ]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          id: { $toString: "$_id" },
          name: "$user.name",
          role: 1,
          bio: 1,
          skills: 1,
          interests: 1
        }
      }
    ])
    .toArray()

  return matches as UserProfile[]
}

