import { drizzle } from 'drizzle-orm/node-postgres';
import { getEnv } from 'helpers';
import { Pool } from 'pg';

const connect = () => {
  const pool = new Pool({
    connectionString: getEnv('DB_URL'),
    ssl: true,
  });

  return drizzle(pool);
};

class DrizzleConnect {
  private drizzle = connect();
  private static instance: DrizzleConnect;

  constructor() {
    if (DrizzleConnect.instance) {
      return DrizzleConnect.instance;
    }
    DrizzleConnect.instance = this;
  }

  getDrizzle = () => this.drizzle
}

export const {getDrizzle} = new DrizzleConnect()
