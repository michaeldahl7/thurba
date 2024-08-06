import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

console.log("All env variables:", process.env);
console.log("dburl in client: ", process.env.POSTGRES_URL);
console.log("Current working directory:", process.cwd());
const queryClient = postgres(process.env.POSTGRES_URL ?? "");

export const db = drizzle(queryClient, { schema });
