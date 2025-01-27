'use server'

import { fetchServicesWithActions } from "@/db/query";
import CreateTaskForm from "@/components/TasksPage/CreateTaskForm";

export default async function CreateTaskPage() {
  const services = await fetchServicesWithActions();
  // const servicesPromise = fetchServicesWithActionIds();
  // const actionsPromise = fetchActions();
  // const [services, actions] = await Promise.all([servicesPromise, actionsPromise]);

  return (
    <div className="create-task-page py-5">
      <CreateTaskForm services={services} />
    </div>
  )
}