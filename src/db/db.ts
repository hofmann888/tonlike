// import { drizzle } from 'drizzle-orm/neon-serverless'; // TODO?: neon-http?
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "./schema";
import '../../env-config.ts';

export const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ 
  client: sql, 
  schema: schema, 
  casing: 'snake_case' 
});