'use server'

import { User, Task, TasksFilterParamEnum, TaskFilterItem, Quest } from "@/lib/definitions";
import { tasksRelations, tasksFilter, tasksSort } from "@/utils/task-filter";
import { fetchEarnTasksByUserId, fetchEarnQuestsByUserId } from "@/db/query";
import { getAuthUser } from "@/app/auth/session";
import EarnTabs from "@/components/Earn/EarnTabs";
import PageLoader from "@/components/Common/PageLoader";
import TasksFilter from "@/components/Tasks/TasksFilter";
import EarnTaskList from "@/components/Earn/EarnTaskList";
import EarnQuestList from "@/components/Earn/EarnQuestList";

export default async function EarnPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const tab = searchParams.tab as string ?? 'tasks'; // TODO?: pass as prop? # task filter removes it

  let quests: Quest[] = []; 
  let tasks: Task[] = [];

  // TODO?: move this logic to separate components to use Suspense?
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