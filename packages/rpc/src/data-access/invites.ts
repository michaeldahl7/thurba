import { database } from "@acme/db/client";
import { type GroupId, invites } from "@acme/db/schema";
import { eq } from "drizzle-orm";

export async function getInvite(token: string) {
  return await database.query.invites.findFirst({
    where: eq(invites.token, token),
  });
}

export async function deleteInvite(token: string) {
  await database.delete(invites).where(eq(invites.token, token));
}

export async function createInvite(groupId: GroupId) {
  const [invite] = await database
    .insert(invites)
    .values({
      groupId,
    })
    .returning();
  return invite;
}
