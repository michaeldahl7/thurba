import { database } from "@acme/db/client";
import { subscriptions } from "@acme/db/schema";
import type { UserId } from "../use-cases/types";
import { eq } from "drizzle-orm";

export async function createSubscription(subscription: {
  userId: UserId;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}) {
  await database.insert(subscriptions).values(subscription);
}

export async function updateSubscription(subscription: {
  stripeSubscriptionId: string;
  stripePriceId: string;
  stripeCurrentPeriodEnd: Date;
}) {
  await database
    .update(subscriptions)
    .set({
      stripePriceId: subscription.stripePriceId,
      stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    })
    .where(
      eq(subscriptions.stripeSubscriptionId, subscription.stripeSubscriptionId),
    );
}

export async function getSubscription(userId: UserId) {
  return await database.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
  });
}
