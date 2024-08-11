// import { Lucia } from "lucia";
// import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
// import { db } from "@acme/db/client";
// import { GitHub } from "arctic";
// import dotenv from "dotenv";

// import { SessionTable, UserTable } from "@acme/db/schema";

// dotenv.config();

// export const adapter = new DrizzlePostgreSQLAdapter(
//   db,
//   SessionTable,
//   UserTable,
// );

// export const lucia = new Lucia(adapter, {
//   sessionCookie: {
//     attributes: {
//       secure: process.env.NODE_ENV === "production",
//     },
//   },
//   getUserAttributes: (attributes) => {
//     return {
//       githubId: attributes.github_id,
//       username: attributes.username,
//     };
//   },
// });

// export const github = new GitHub(
//   process.env.GITHUB_CLIENT_ID!,
//   process.env.GITHUB_CLIENT_SECRET!,
// );

// declare module "lucia" {
//   interface Register {
//     Lucia: typeof lucia;
//     DatabaseUserAttributes: {
//       github_id: number;
//       username: string;
//     };
//   }
// }
