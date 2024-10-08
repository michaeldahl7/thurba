import { database } from "@acme/db/client";
import { type Profile, profiles } from "@acme/db/schema";
import { eq } from "drizzle-orm";
import type { UserId } from "../use-cases/types";

export async function createProfile(
  userId: UserId,
  displayName: string,
  image?: string,
) {
  const [profile] = await database
    .insert(profiles)
    .values({
      userId,
      image,
      displayName,
    })
    .onConflictDoNothing()
    .returning();
  return profile;
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profile>,
) {
  await database
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId));
}

export async function getProfile(userId: UserId) {
  const profile = await database.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  });

  return profile;
}
