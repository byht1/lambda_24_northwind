import { drizzle } from "drizzle-orm/node-postgres";
import { getEnv } from "helpers";
import { Pool } from "pg";

export const connect = () => {
  const pool = new Pool({
    connectionString: getEnv("DB_URL"),
    ssl: true,
  });

  return drizzle(pool);
};
