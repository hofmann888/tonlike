'use server'

import { User, Task, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";
import { tasksRelations, tasksFilter, tasksSort } from "@/utils/task-filter";
import { getAuthUser } from "@/app/auth/session";
import { fetchUserEarnTasks } from "@/db/sql";
import TasksFilter from "@/components/TasksPage/TasksFilter";
import EarnItem from "@/components/EarnPage/EarnItem";
import "@/css/earn.scss";


export default async function EarnPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser(false);
  const tasks: Task[] = await fetchUserEarnTasks(user.id);
  const { actions, services } = tasksRelations(tasks);

  const actionsFilter: TaskFilterItem = { 
    key: TasksFilterParamEnum.ACTIONS, 
    values: searchParams.actions ?? []
  };
  const servicesFilter: TaskFilterItem = { 
    key: TasksFilterParamEnum.SERVICES, 
    values: searchParams.services ?? []
  };
  const sortParam = searchParams.sort;

  let tasksFiltered = tasksFilter(tasks, [actionsFilter, servicesFilter]);
  if (sortParam?.length) {
    tasksFiltered = tasksSort(tasksFiltered, sortParam as string);
  }

  return (
    <div className="earn-page py-5">

      <TasksFilter actions={actions} services={services} />

      <div className="earn-list">
          {tasksFiltered.length ? tasksFiltered.map((task) => (
            <EarnItem key={task.id} task={task} />
          )) : <p className="text-center">No tasks found.</p>}
        </div>
    </div>
  )
}