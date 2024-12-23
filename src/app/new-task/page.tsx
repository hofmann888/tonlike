import { fetchActions, fetchServices } from "@/db/sql";
import NewTaskForm from "@/components/TasksPage/NewTaskForm";

export default async function NewTaskPage() {
  const servicesPromise = fetchServices();
  const actionsPromise = fetchActions();
  const [services, actions] = await Promise.all([servicesPromise, actionsPromise]);

  return (
    <div className="new-task-page">
      <NewTaskForm services={services} actions={actions} />
    </div>
  )
}