'use server'

import { User, Task, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";
import { tasksRelations, tasksFilter, tasksSort } from "@/utils/task-filter";
import { getAuthUser } from "@/app/auth/session";
import { fetchUserEarnTasks } from "@/db/sql";
import TasksFilter from "@/components/TasksPage/TasksFilter";
import EarnList from "@/components/EarnPage/EarnList";
import EarnTabs from "@/components/EarnPage/EatnTabs";
import EarnQuestList from "@/components/EarnPage/EarnQuestList";

export default async function EarnPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser(false);
  const tasks: Task[] = await fetchUserEarnTasks(user.id);
  const { actions, services } = tasksRelations(tasks);

  const tab = searchParams.tab as string ?? 'tasks'; // TODO?: pass as prop? # task filter removes it

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
    <div className="earn-page pb-5">

      <EarnTabs activeTab={tab} />

      {tab === 'quests' && <EarnQuestList />}

      {tab === 'tasks' && !!tasks.length && <TasksFilter actions={actions} services={services} />}

      {tab === 'tasks' && <EarnList tasks={tasksFiltered} />}
    </div>
  )
}