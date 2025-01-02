'use server'

import { Action, Service, TaskStatus, Task, User } from "@/lib/definitions";
import { getAuthUser } from "@/app/auth/session";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { fetchUserTasks } from "@/db/sql";
import TasksFilter from "@/components/TasksPage/TasksFilter";
import TaskItem from "@/components/TasksPage/TaskItem";
import "@/css/tasks.scss";

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

  const statusFilter = searchParams.status || TaskStatus.ACTIVE;
  let servicesFilter = searchParams.services || [];
  let actionsFilter = searchParams.actions || [];

  const tasksFilteredByStatus = tasks.filter((task) => task.status === statusFilter);

  tasksFilteredByStatus.map((task) => {
    if (!(task.action.id in actions)) {
      actions[task.action.id] = task.action;
    }
    if (!(task.service.id in services)) {
      services[task.service.id] = task.service;
    }
  });

  const tasksFiltered = tasksFilteredByStatus.filter(setFilter);

  function setFilter(task: Task) {
    if (typeof actionsFilter === 'string') {
      actionsFilter = actionsFilter.split(',');
    }
    if (typeof servicesFilter === 'string') {
      servicesFilter = servicesFilter.split(',');
    }
    return (!actionsFilter?.length || actionsFilter.includes(`${task.action.id}`))
        && (!servicesFilter?.length || servicesFilter.includes(`${task.service.id}`));
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