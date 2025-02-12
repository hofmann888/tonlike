'use server'

import { User, Task, TasksFilterParamEnum, TaskFilterItem, Quest, Service, Action } from "@/lib/definitions";
import { tasksRelations, tasksFilter, tasksSort } from "@/utils/task-filter";
import { fetchEarnTasksByUserId, fetchEarnQuestsByUserId } from "@/db/query";
import { getAuthUser } from "@/app/auth/session";
import TasksFilter from "@/components/TasksPage/TasksFilter";
import EarnTabs from "@/components/EarnPage/EarnTabs";
import EarnTaskList from "@/components/EarnPage/EarnTaskList";
import EarnQuestList from "@/components/EarnPage/EarnQuestList";

export default async function EarnPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser(false);

  const tab = searchParams.tab as string ?? 'tasks'; // TODO?: pass as prop? # task filter removes it

  let quests: Quest[] = []; 
  let tasks: Task[] = [];

  if (tab === 'tasks') {
    tasks = await fetchEarnTasksByUserId(user.id);
  } else {
    quests = await fetchEarnQuestsByUserId(user.id) 
  }

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
    <div className="earn-page pb-5">

      <EarnTabs activeTab={tab} />

      {tab === 'quests' 
        ? <EarnQuestList quests={quests} />
        : 
          <>
            {!!tasks.length && <TasksFilter actions={actions} services={services} />}
            <EarnTaskList tasks={tasksFiltered} />
          </>
      }
    </div>
  )
}