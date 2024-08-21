createPasswordResetToken;

import { database } from "@acme/db/client";
import { resetTokens } from "@acme/db/schema";
import { eq } from "drizzle-orm";
import { TOKEN_LENGTH, TOKEN_TTL } from "../config.js";
import { generateRandomToken } from "../data-access/utils";
import type { UserId } from "../use-cases/types";

export async function createPasswordResetToken(userId: UserId) {
  const token = await generateRandomToken(TOKEN_LENGTH);
  const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

  await database
    .insert(resetTokens)
    .values({
      userId,
      token,
      tokenExpiresAt,
    })
    .onConflictDoUpdate({
      target: resetTokens.id,
      set: {
        token,
        tokenExpiresAt,
      },
    });

  return token;
}

export async function getPasswordResetToken(token: string) {
  const existingToken = await database.query.resetTokens.findFirst({
    where: eq(resetTokens.token, token),
  });

  return existingToken;
}

export async function deletePasswordResetToken(token: string, trx = database) {
  await trx.delete(resetTokens).where(eq(resetTokens.token, token));
}
