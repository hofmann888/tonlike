'use server'

import { fetchServicesWithActions } from "@/db/query";
import CreateTaskForm from "@/components/Tasks/CreateTaskForm";

export default async function CreateTaskPage() {
  const services = await fetchServicesWithActions(true);
  // const servicesPromise = fetchServicesWithActionIds();
  // const actionsPromise = fetchActions();
  // const [services, actions] = await Promise.all([servicesPromise, actionsPromise]);

  return (
    <div className="create-task-page py-5 px-2">
      <CreateTaskForm services={services} />
    </div>
  )
}