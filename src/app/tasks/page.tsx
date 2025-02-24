'use server'

import { User, Task, TaskStatusEnum, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";
import { tasksRelations, tasksStatusCount, tasksFilter, tasksSort } from "@/utils/task-filter";
import { getAuthUser } from "@/app/auth/session";
import { fetchTasksByUserId } from "@/db/query";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import TasksFilter from "@/components/Tasks/TasksFilter";
import PageLoader from "@/components/Common/PageLoader";
import TaskList from "@/components/Tasks/TaskList";

// TODO: optimize: prefetch, cache, pagination...
// TODO: suspend, skeletons...
export default async function TasksPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser(); // TODO?: move to layout?
  if (!user) return (<PageLoader />);

  const tasks: Task[] = await fetchTasksByUserId(user.id);
  const statusCount = tasksStatusCount(tasks);

  const actionsFilter: TaskFilterItem = { 
    key: TasksFilterParamEnum.ACTIONS, 
    values: searchParams.actions ?? []
  };
  const servicesFilter: TaskFilterItem = { 
    key: TasksFilterParamEnum.SERVICES, 
    values: searchParams.services ?? []
  };
  const sortParam = searchParams.sort;
  const statusParam = searchParams.status || TaskStatusEnum.ACTIVE;

  const tasksFilteredByStatus = tasks.filter((task) => task.status === statusParam);

  const { actions, services } = tasksRelations(tasksFilteredByStatus);

  let tasksFiltered = tasksFilter(tasksFilteredByStatus, [actionsFilter, servicesFilter]);
  if (sortParam?.length) {
    tasksFiltered = tasksSort(tasksFiltered, sortParam as string);
  }

  return (
    <div className="tasks-page h-full flex flex-col justify-between">
      <div>
        <TasksFilter actions={actions} services={services} statusCount={statusCount} />

        <TaskList tasks={tasksFiltered} />
      </div>

      <div className="sticky bottom-[60px] z-50 bg-background px-2">
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