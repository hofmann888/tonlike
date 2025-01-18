import { neon } from '@neondatabase/serverless';
import { users, services, actions, serviceActions, tasks, userEarnings, reports } from '@/db/seed';

const sql = neon(`${process.env.DATABASE_URL}`); // TODO: add indexes in db

async function dropDB() {
    await sql(`DROP TABLE IF EXISTS reports, user_earnings, tasks, users, service_actions, services, actions;`);
    await sql(`DROP TYPE IF EXISTS task_status, user_earning_status, report_reason;`);
}

async function seedUsers() {
  await sql(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      address CHAR(48),
      balance BIGINT NOT NULL DEFAULT 0,
      tg_id BIGINT NOT NULL UNIQUE,
      tg_username VARCHAR(255) NOT NULL,
      tg_photo_url VARCHAR(255)
    );
  `);

  users.map(
    async (user) => await sql(`
      INSERT INTO users (id, address, balance, tg_id, tg_username, tg_photo_url)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [user.id, user.address, user.balance, user.tg_id, user.tg_username, user.tg_photo_url]),
  );

  await sql('ALTER SEQUENCE users_id_seq RESTART WITH 3;');
}

async function seedServices() {
  await sql(`
    CREATE TABLE IF NOT EXISTS services (
      id SMALLSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      img VARCHAR(255) NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE
    );
  `);

  services.map(
    async (service) => await sql(`
      INSERT INTO services (id, name, img, active)
      VALUES ($1, $2, $3, $4)
    `, [service.id, service.name, service.img, service.active]),
  );

  await sql('ALTER SEQUENCE services_id_seq RESTART WITH 8;');
}

async function seedActions() {
  await sql(`
    CREATE TABLE IF NOT EXISTS actions (
      id SMALLSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE
    );
  `);

  actions.map(
    async (action) => await sql(`
      INSERT INTO actions (id, name, active)
      VALUES ($1, $2, $3)
    `, [action.id, action.name, action.active]),
  );
  
  await sql('ALTER SEQUENCE actions_id_seq RESTART WITH 8;');
}

async function seedServiceActions() { // TODO: store as ARRAY type in services table? // FK
  await sql(`
    CREATE TABLE IF NOT EXISTS service_actions (
      id SERIAL PRIMARY KEY,
      service_id SMALLINT NOT NULL,
      action_id SMALLINT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,

      CONSTRAINT fk_service FOREIGN KEY(service_id) REFERENCES services(id),
      CONSTRAINT fk_action FOREIGN KEY(action_id) REFERENCES actions(id)
    );
  `);

  serviceActions.map(
    async (serviceAction) => await sql(`
      INSERT INTO service_actions (id, service_id, action_id, active)
      VALUES ($1, $2, $3, $4)
    `, [serviceAction.id, serviceAction.service_id, serviceAction.action_id, serviceAction.active]),
  );
  
  await sql('ALTER SEQUENCE service_actions_id_seq RESTART WITH 29;');
}

// TODO: service_action_id 
// price type - int and usdt_cents enum!
async function seedTasks() {
  await sql(`CREATE TYPE task_status AS ENUM('active','paused','scheduled','done','deleted');`);
  // TODO?: await sql(`CREATE TYPE currency AS ENUM('coin','usdt');`); // currency CURRENCY NOT NULL,
  await sql(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY, 
      user_id INT NOT NULL,
      service_id SMALLINT NOT NULL,
      action_id SMALLINT NOT NULL,
      link VARCHAR(255) NOT NULL,
      price BIGINT NOT NULL,
      count INT NOT NULL,
      done INT NOT NULL DEFAULT 0,
      status TASK_STATUS NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP NULL,

      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_service FOREIGN KEY(service_id) REFERENCES services(id),
      CONSTRAINT fk_action FOREIGN KEY(action_id) REFERENCES actions(id)
    );
  `);
    // updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ?, probably nope...or yep?
    // CONSTRAINT ... ON DELETE SET NULL | ON DELETE CASCADE

  tasks.map(
    async (task) => await sql(`
      INSERT INTO tasks (id, user_id, action_id, service_id, link, price, count, done, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [task.id, task.user_id, task.action_id, task.service_id, task.link, task.price, task.count, task.done, task.status]),
  );

  await sql('ALTER SEQUENCE tasks_id_seq RESTART WITH 9;');
}

// TODO?: user_tasks | earn_tasks?
// TODO?: reward
async function seedUserEarnings() {
  await sql(`CREATE TYPE user_earning_status AS ENUM('done','hidden');`);

  await sql(`
    CREATE TABLE IF NOT EXISTS user_earnings (
      id BIGSERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      task_id INT NOT NULL,
      profit BIGINT NOT NULL DEFAULT 0,
      status USER_EARNING_STATUS NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_task FOREIGN KEY(task_id) REFERENCES tasks(id)
    );
  `);

  userEarnings.map(
    async (userEarning) => await sql(`
      INSERT INTO user_earnings (id, user_id, task_id, profit, status)
      VALUES ($1, $2, $3, $4, $5)
    `, [userEarning.id, userEarning.user_id, userEarning.task_id, userEarning.profit, userEarning.status]),
  );

  await sql('ALTER SEQUENCE user_earnings_id_seq RESTART WITH 2;');
}

async function seedReports() {
  await sql(`CREATE TYPE report_reason AS ENUM('unavailable','scam','spam','copyright','content', 'other');`);

  await sql(`
    CREATE TABLE IF NOT EXISTS reports (
      id BIGSERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      task_id INT NOT NULL,
      reasons REPORT_REASON[] NOT NULL,
      comment TEXT NULL,  
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_task FOREIGN KEY(task_id) REFERENCES tasks(id)
    );
  `);
  
  reports.map(
    async (report) => await sql(`
      INSERT INTO reports (id, user_id, task_id, reasons, comment)
      VALUES ($1, $2, $3, $4, $5)
    `, [report.id, report.user_id, report.task_id, report.reasons, report.comment]),
  );

  await sql('ALTER SEQUENCE reports_id_seq RESTART WITH 2;');
}

export async function GET() {
  try {
    await sql(`BEGIN`);
    await dropDB();
    await seedUsers();
    await seedServices();
    await seedActions();
    await seedServiceActions();
    await seedTasks();
    await seedUserEarnings();
    await seedReports();
    await sql(`COMMIT`);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await sql(`ROLLBACK`);
    return Response.json({ error }, { status: 500 });
  }
}
