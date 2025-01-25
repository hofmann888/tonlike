// import { drizzle } from 'drizzle-orm/neon-serverless'; // TODO: neon-http?
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import '../../env-config.ts';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql as any, casing: 'snake_case' });