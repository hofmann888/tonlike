'use server'

import { Task, User } from "@/lib/definitions";
import { getAuthUser } from "../init-data/auth/session";
import { fetchUserTasks } from "@/db/sql";
import Link from "next/link";
import TaskItem from "@/components/TasksPage/TaskItem";
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

      <div className="new-task">
        <Link href="/new-task" className="new-task-btn">
          New Task
        </Link>
      </div>
    </div>
  )
}