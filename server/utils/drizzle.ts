import { drizzle } from "drizzle-orm/libsql";
export { sql, eq, and, or } from "drizzle-orm";
import { createClient } from "@libsql/client";

import * as schema from "../database/schema";

export const tables = schema;

export function useDrizzle() {
  return drizzle(
    createClient({ url: process.env.DB_URL!, authToken: process.env.DB_TOKEN }),
    {
      schema,
    }
  );
}

export type User = typeof schema.users.$inferSelect;
