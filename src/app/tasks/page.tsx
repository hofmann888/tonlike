'use server'

import { Task, User } from "@/lib/definitions";
import { getAuthUser } from "@/app/auth/session";
import { fetchUserTasks } from "@/db/sql";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
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

      <div className="tasks-create">
        <Button
          as={Link}
          color="primary"
          href="/tasks/create"
          variant="shadow"
          size="lg"
          className="w-full mb-2 mt-2"
        >
          Create Task
        </Button>
      </div>
    </div>
  )
}