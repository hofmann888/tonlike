import { fetchServicesWithActions } from "@/db/query";
import { getAuthUser } from "@/core/session";
import { User } from "@/lib/definitions";
import CreateTaskForm from "@/components/Tasks/CreateTaskForm";
import PageLoader from "@/components/Common/PageLoader";

export const revalidate = 3600;

export default async function CreateTaskPage() {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const services = await fetchServicesWithActions(true);

  return (
    <div className="create-task-page py-5 px-2 max-w-[500px] max-[500px]:max-w-[100vw]">
      <CreateTaskForm services={services} />
    </div>
  )
}