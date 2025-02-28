'use server'

import { fetchServicesWithActions } from "@/db/query";
import { getAuthUser } from "@/app/auth/session";
import { User } from "@/lib/definitions";
import CreateTaskForm from "@/components/Tasks/CreateTaskForm";
import PageLoader from "@/components/Common/PageLoader";

export default async function CreateTaskPage() {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const services = await fetchServicesWithActions(true);

  return (
    <div className="create-task-page py-5 px-2">
      <CreateTaskForm services={services} />
    </div>
  )
}