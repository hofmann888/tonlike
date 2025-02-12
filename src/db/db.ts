import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';
// import { Pool } from '@neondatabase/serverless';
import * as schema from "./schema";
import '../../env-config.ts';

export const sql = neon(process.env.DATABASE_URL!);
export const db = drizzleHttp({ 
  client: sql, 
  schema: schema, 
  casing: 'snake_case' 
});

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const dbPool = drizzle({ 
//   client: pool,
//   schema: schema, 
//   casing: 'snake_case' 
// });

