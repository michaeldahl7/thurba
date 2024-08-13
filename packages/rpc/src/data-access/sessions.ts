import { database } from "@acme/db/client";
import { sessions } from "@acme/db/schema";
import { eq } from "drizzle-orm";
import type { UserId } from "../use-cases/types";

export async function deleteSessionForUser(userId: UserId, trx = database) {
  await trx.delete(sessions).where(eq(sessions.userId, userId));
}
