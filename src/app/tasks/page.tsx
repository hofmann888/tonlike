'use server'

import { Task } from "@/lib/definitions";
import { getSession } from "../init-data/auth/session";
import { fetchUserTasks } from "@/db/sql";
import Link from "next/link";
import TaskItem from "@/components/TasksPage/TaskItem";
import "@/css/tasks.scss";


export default async function TasksPage() {
  const { user } = await getSession(); // TODO: TypeError: Cannot destructure property 'user' of '(intermediate value)' as it is null.

  if (!user.id) return <div>Not authorized!</div>; // TODO: throw exceptions and handle them in one place?

  const tasks: Task[] = await fetchUserTasks(user.id);

  return (
    <div className="tasks-page">
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

        <div className="new-task">
          <Link href="/new-task" className="new-task-btn">
            New Task
          </Link>
        </div>
    </div>
  )
}