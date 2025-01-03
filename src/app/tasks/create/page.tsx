'use server'

import { fetchActions, fetchServices } from "@/db/sql";
import CreateTaskForm from "@/components/TasksPage/CreateTaskForm";

export default async function CreateTaskPage() {
  const servicesPromise = fetchServices();
  const actionsPromise = fetchActions();
  const [services, actions] = await Promise.all([servicesPromise, actionsPromise]);

  return (
    <div className="create-task-page py-5">
      <CreateTaskForm services={services} actions={actions} />
    </div>
  )
}