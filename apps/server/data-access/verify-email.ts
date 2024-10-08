import { database } from "@acme/db/client";
import { resetTokens, verifyEmailTokens } from "@acme/db/schema";
import { eq } from "drizzle-orm";
import { TOKEN_LENGTH, TOKEN_TTL } from "../config";
import { generateRandomToken } from "../data-access/utils";
import type { UserId } from "../use-cases/types";

export async function createVerifyEmailToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await database
    .insert(verifyEmailTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: verifyEmailTokens.id,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  return token;
}

export async function getVerifyEmailToken(token: string) {
  const existingToken = await database.query.verifyEmailTokens.findFirst({
    where: eq(verifyEmailTokens.token, token),
  });

  return existingToken;
}

export async function deleteVerifyEmailToken(token: string) {
  await database
    .delete(verifyEmailTokens)
    .where(eq(verifyEmailTokens.token, token));
}
