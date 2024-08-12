import { database } from "@acme/db/client";
import { sessions } from "@acme/db/schema";
import { UserId } from "../use-cases/types";
import { eq } from "drizzle-orm";

export async function deleteSessionForUser(userId: UserId, trx = database) {
  await trx.delete(sessions).where(eq(sessions.userId, userId));
}
