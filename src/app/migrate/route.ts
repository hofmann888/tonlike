// import bcrypt from 'bcrypt';
// import { db } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { users, services, actions } from '@/db/seed';

// const client = await db.connect();
const sql = neon(`${process.env.DATABASE_URL}`);

async function dropDB() {
    await sql(`DROP TABLE IF EXISTS users, services, actions, tasks, tasks_done;`);
}

async function seedUsers() {
  await sql(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT PRIMARY KEY,
      address CHAR(48) NOT NULL,
      balance FLOAT NOT NULL DEFAULT 0,
      reward BIGINT NOT NULL DEFAULT 0
    );
  `);

  const insertedUsers = await Promise.all(
    users.map(
      (user) => sql(`
        INSERT INTO users (id, address, balance, reward)
        VALUES ($1, $2, $3, $4)
      `, [user.id, user.address, user.balance, user.reward]),
    ),
  );

  return insertedUsers;
}

async function seedServices() {
  await sql(`
    CREATE TABLE IF NOT EXISTS services (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `);

  const insertedServices = await Promise.all(
    services.map(
      (service) => sql(`
        INSERT INTO services (id, name)
        VALUES ($1, $2)
      `, [service.id, service.name]),
    ),
  );

  return insertedServices;
}

async function seedActions() {
  await sql(`
    CREATE TABLE IF NOT EXISTS actions (
      id INT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      reward INT NOT NULL DEFAULT 0
    );
  `);

  const insertedActions = await Promise.all(
    actions.map(
      (action) => sql(`
        INSERT INTO actions (id, name, reward)
        VALUES ($1, $2, $3)
      `, [action.id, action.name, action.reward]),
    ),
  );

  return insertedActions;
}

async function seedTasks() {
  await sql(`
    CREATE TABLE IF NOT EXISTS tasks (
      id BIGINT PRIMARY KEY, 
      user_id BIGINT NOT NULL,
      service_id INT NOT NULL,
      action_id INT NOT NULL,
      link VARCHAR(255) NOT NULL,
      price FLOAT NOT NULL,
      count INT NOT NULL,
      done INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      edited_at TIMESTAMP NULL,
      finished_at TIMESTAMP NULL,

      CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
      CONSTRAINT fk_service FOREIGN KEY(service_id) REFERENCES services(id),
      CONSTRAINT fk_action FOREIGN KEY(action_id) REFERENCES actions(id)
    );
  `);
    // CONSTRAINT ... ON DELETE SET NULL | ON DELETE CASCADE
}

async function seedTasksDone() {
  await sql(`
    CREATE TABLE IF NOT EXISTS tasks_done (
      id BIGINT PRIMARY KEY,
      user_id BIGINT NOT NULL,
      task_id BIGINT NOT NULL,
      created_at TIMESTAMP NOT NULL,

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
