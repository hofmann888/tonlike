'use server'

import { fetchUserEarnTasks } from "@/db/sql";
import { Task, User } from "@/lib/definitions";
import { getAuthUser } from "../init-data/auth/session";
import EarnItem from "@/components/EarnPage/EarnItem";
import "@/css/earn.scss";

export default async function EarnPage() {
  const user: User = await getAuthUser();

  if (!user?.id) return <div>Not authorized!</div>; // TODO: throw exceptions and handle them in one place?

  const tasks: Task[] = await fetchUserEarnTasks(user.id);

  return (
    <div className="earn-page">
      <div className="earn-list">
        {tasks.map((task) => (
          <EarnItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}