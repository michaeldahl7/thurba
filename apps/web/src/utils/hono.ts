// import type { AppType } from "../../../server/src/index_good";
import type { AppType } from "@acme/rpc";
import { hc } from "hono/client";

export const client = hc<AppType>("http://localhost:3000");
