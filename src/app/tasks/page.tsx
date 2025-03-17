'use server'

import { User, Task, TaskStatusEnum, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";
import { tasksRelations, tasksStatusCount, tasksFilter, tasksSort } from "@/utils/task-filter";
import { fetchTasksByUserId } from "@/db/query";
import { getAuthUser } from "@/core/session";
import TaskList from "@/components/Tasks/TaskList";
import PageLoader from "@/components/Common/PageLoader";
import TasksFilter from "@/components/Tasks/TasksFilter";
import CreateTaskButton from "@/components/Tasks/CreateTaskButton";

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
    <div className="tasks-page h-full flex flex-col justify-between max-w-[500px] max-[500px]:max-w-[100vw]">
      <div>
        <TasksFilter actions={actions} services={services} statusCount={statusCount} />

        <TaskList tasks={tasksFiltered} />
      </div>

      <div className="sticky bottom-[60px] z-50 bg-background px-2">
        <CreateTaskButton />
      </div>
    </div>
  )
}