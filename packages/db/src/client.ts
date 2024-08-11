// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import * as schema from "./schema";

// const queryClient = postgres(process.env.POSTGRES_URL ?? "");

// export const db = drizzle(queryClient, { schema });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "./env";
import * as schema from "./schema";

const pg = postgres(env.DATABASE_URL);
const database = drizzle(pg, { schema });

export { database, pg };
