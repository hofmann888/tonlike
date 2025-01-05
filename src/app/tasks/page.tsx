'use server'

import { User, Task, TaskStatusEnum, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";
import { tasksRelations, tasksStatusCount, tasksFilter, tasksSort } from "@/utils/task-filter";
import { getAuthUser } from "@/app/auth/session";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { fetchUserTasks } from "@/db/sql";
import TasksFilter from "@/components/TasksPage/TasksFilter";
import TaskItem from "@/components/TasksPage/TaskItem";
import "@/css/tasks.scss";

// TODO: optimize: prefetch, cache, pagination...
// TODO: suspend, skeletons...
export default async function TasksPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser(false);
  const tasks: Task[] = await fetchUserTasks(user.id);
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

        <div className="task-list">
          {tasksFiltered.length ? tasksFiltered.map((task) => (
            <TaskItem key={task.id} task={task} />
          )) : <p className="text-center">No tasks found.</p>}
        </div>
      </div>

      <div className="tasks-create sticky">
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