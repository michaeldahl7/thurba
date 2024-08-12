import { database } from "@acme/db/client";
import { newsletters } from "@acme/db/schema";

/**
 * this inserts an email record into our database using drizzle-orm
 *
 * @param email the email to save
 */
export async function saveNewsletterSubscription(email: string) {
  await database
    .insert(newsletters)
    .values({
      email,
    })
    .onConflictDoNothing(); // we need onConflictDoNothing because if the same person tries to subscribe twice, we shouldn't crash for them
}
