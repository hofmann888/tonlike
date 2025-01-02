'use server'

import { Action, Service, User, Task, TaskStatus, TaskSort } from "@/lib/definitions";
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
  const actions: Action[] = [];
  const services: Service[] = [];

  const statusCount = {
    [TaskStatus.ACTIVE]: 0,
    [TaskStatus.STOP]: 0,
    [TaskStatus.DONE]: 0,
    [TaskStatus.DELETED]: 0,
  }

  if (tasks) {
    tasks.map((task) => {
      statusCount[task.status]++;
    })
  }

  let actionsFilter = searchParams.actions || [];
  let servicesFilter = searchParams.services || [];
  const statusFilter = searchParams.status || TaskStatus.ACTIVE;
  const sortFilter = searchParams.sort;

  const tasksFilteredByStatus = tasks.filter((task) => task.status === statusFilter);

  tasksFilteredByStatus.map((task) => {
    if (!(task.action.id in actions)) {
      actions[task.action.id] = task.action;
    }
    if (!(task.service.id in services)) {
      services[task.service.id] = task.service;
    }
  });

  const setFilter = (task: Task) => {
    if (typeof actionsFilter === 'string') {
      actionsFilter = actionsFilter.split(',');
    }
    if (typeof servicesFilter === 'string') {
      servicesFilter = servicesFilter.split(',');
    }
    return (!actionsFilter?.length || actionsFilter.includes(`${task.action.id}`))
        && (!servicesFilter?.length || servicesFilter.includes(`${task.service.id}`));
  }

  const setSort = (a: Task, b: Task) => {
    switch (sortFilter) {
      case TaskSort.PRICE_ASC:
        if (a.price === b.price) return 0;
        return a.price < b.price ? -1 : 1;
      case TaskSort.PRICE_DESC: 
        if (a.price === b.price) return 0;
        return a.price > b.price ? -1 : 1;
      case TaskSort.DATE_ASC: 
        if (a.created_at === b.created_at) return 0;
        return a.created_at < b.created_at ? -1 : 1;
      case TaskSort.DATE_DESC: 
        if (a.created_at === b.created_at) return 0;
        return a.created_at > b.created_at ? -1 : 1;
      default:
        return 0;
    }
  }

  const tasksFiltered = tasksFilteredByStatus.filter(setFilter);
  tasksFiltered.sort(setSort); 

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