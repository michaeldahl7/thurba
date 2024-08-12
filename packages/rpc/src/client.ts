import type { AppType } from "./index";
import { hc } from "hono/client";
import { env } from "../env";

const client = hc<AppType>(env.HOST_NAME);

export { client };
