import { neon } from '@neondatabase/serverless';
import '../../env-config.ts';

const sql = neon(process.env.DATABASE_URL!);

async function dropDB() {
  console.log('dropDB', process.env.DATABASE_URL);

  await sql(`DROP TABLE IF EXISTS black_list, reports, task_earnings, quest_earnings, tasks, quests, service_actions, services, actions, users;`);
  await sql(`DROP TYPE IF EXISTS task_status, task_earning_status, report_reason, black_list_reason;`);
}

dropDB();