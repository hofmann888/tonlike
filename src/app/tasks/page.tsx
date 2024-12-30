'use server'

import { Task, User } from "@/lib/definitions";
import { getAuthUser } from "@/app/auth/session";
import { fetchUserTasks } from "@/db/sql";
import TaskItem from "@/components/TasksPage/TaskItem";
import Link from "next/link";
import "@/css/tasks.scss";

export default async function TasksPage() {
  const user: User = await getAuthUser(false);
  const tasks: Task[] = await fetchUserTasks(user.id);

  return (
    <div className="tasks-page">
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      <div className="tasks-create">
        <Link href="/tasks/create" className="tasks-create-btn">
          Create Task
        </Link>
      </div>
    </div>
  )
}