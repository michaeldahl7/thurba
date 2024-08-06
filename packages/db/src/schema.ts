import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  pgTableCreator,
  index,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const createTable = pgTableCreator((name) => `thurba_${name}`);

// export const PostTable = pgTable("post", {
//   id: uuid("id").notNull().primaryKey().defaultRandom(),
//   title: varchar("name", { length: 256 }).notNull(),
//   content: text("content").notNull(),
//   createdAt: timestamp("created_at").defaultNow().notNull(),
//   updatedAt: timestamp("updatedAt", {
//     mode: "date",
//     withTimezone: true,
//   }).$onUpdateFn(() => sql`now()`),
// });

// export const CreatePostSchema = createInsertSchema(PostTable, {
//   title: z.string().max(256),
//   content: z.string().max(256),
// }).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

export const UserTable = createTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  password_hash: varchar("password_hash", { length: 255 }),
  username: varchar("username", { length: 255 }).unique(),
  github_id: integer("github_id").unique(),
  image: varchar("image", { length: 255 }),
});

export const UserRelations = relations(UserTable, ({ many }) => ({
  accounts: many(AccountTable),
}));

export const AccountTable = createTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => UserTable.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(AccountTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AccountTable.userId],
    references: [UserTable.id],
  }),
}));

// export const Session = pgTable("session", {
//   sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
//   userId: uuid("userId")
//     .notNull()
//     .references(() => User.id, { onDelete: "cascade" }),
//   expiresAt: timestamp("expires", {
//     mode: "date",
//     withTimezone: true,
//   }).notNull(),
// });

export const SessionTable = createTable("session", {
  id: text("id").primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => UserTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const SessionRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}));
