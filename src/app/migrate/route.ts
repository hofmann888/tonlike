// import bcrypt from 'bcrypt';
// import { db } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { users, services, actions } from '@/db/seed';

// TODO: use int/serial instead of big...? # big... returns string instead of number # max int = +2,147,483,647

// const client = await db.connect();
const sql = neon(`${process.env.DATABASE_URL}`); // TODO: add indexes in db

async function dropDB() {
    await sql(`DROP TABLE IF EXISTS users, services, actions, tasks, tasks_done;`);
    await sql(`DROP TYPE IF EXISTS task_status;`);
}

async function seedUsers() {
  await sql(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      tg_id BIGINT NOT NULL UNIQUE,
      address CHAR(48),
      balance FLOAT NOT NULL DEFAULT 0,
      reward BIGINT NOT NULL DEFAULT 0
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(
      (user) => sql(`
        INSERT INTO users (tg_id, address, balance, reward)
        VALUES ($1, $2, $3, $4)
      `, [user.tg_id, user.address, user.balance, user.reward]),
    ),
  );

  return insertedUsers;
}

async function seedServices() {
  await sql(`
    CREATE TABLE IF NOT EXISTS services (
      id SMALLSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);

  const insertedServices = await Promise.all(
    services.map(
      (service) => sql(`
        INSERT INTO services (name)
        VALUES ($1)
      `, [service.name]),
    ),
  );

  return insertedServices;
}

async function seedActions() {
  await sql(`
    CREATE TABLE IF NOT EXISTS actions (
      id SMALLSERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      reward INT NOT NULL DEFAULT 0
    );
  `);

  const insertedActions = await Promise.all(
    actions.map(
      (action) => sql(`
        INSERT INTO actions (name, reward)
        VALUES ($1, $2)
      `, [action.name, action.reward]),
    ),
  );

  return insertedActions;
}

async function seedTasks() {
  await sql(`CREATE TYPE task_status AS ENUM('active','stop','done');`);
  await sql(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY, 
      user_id INT NOT NULL,
      action_id SMALLINT NOT NULL,
      service_id SMALLINT NOT NULL,
      link VARCHAR(255) NOT NULL,
      price FLOAT NOT NULL,
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
}

async function seedTasksDone() {
  await sql(`
    CREATE TABLE IF NOT EXISTS tasks_done (
      id BIGSERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      task_id INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_task FOREIGN KEY(task_id) REFERENCES tasks(id)
    );
  `);
}

export async function GET() {
  try {
    await sql(`BEGIN`);
    await dropDB();
    await seedUsers();
    await seedServices();
    await seedActions();
    await seedTasks();
    await seedTasksDone();
    await sql(`COMMIT`);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await sql(`ROLLBACK`);
    return Response.json({ error }, { status: 500 });
  }
}
