'use server'

import { User, Task, TasksFilterParamEnum, TaskFilterItem, Quest, QuestSection, QuestSectionEnum } from "@/lib/definitions";
import { fetchUserEarnTasks, fetchEarnQuestsByUserId, fetchUserEarnTasksCount } from "@/db/query";
import { tasksRelations, tasksFilter, tasksSort } from "@/utils/task-filter";
import { getAuthUser } from "@/core/session";
import { cookies } from "next/headers";
import EarnTabs from "@/components/Earn/EarnTabs";
import PageLoader from "@/components/Common/PageLoader";
import TasksFilter from "@/components/Tasks/TasksFilter";
import EarnTaskList from "@/components/Earn/EarnTaskList";
import EarnQuestList from "@/components/Earn/EarnQuestList";
import EarnWaringModal from "@/components/Earn/EarnWarningModal";
import CreateTaskButton from "@/components/Tasks/CreateTaskButton";

export default async function EarnPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const tab = searchParams?.tab as string ?? 'tasks'; // TODO?: pass as prop? # task filter removes it
  const questSection = searchParams?.section as QuestSection ?? QuestSectionEnum.APP;
  
  const page = searchParams?.page as any as number ?? 1;
  let pageTotal = 1;
  const pageItemsSize = 10;
  const offset = (page - 1) * pageItemsSize;

  let quests: Quest[] = []; 
  let tasks: Task[] = [];
  let tasksCount = 0;

  // TODO?: move this logic to separate components to use Suspense?
  // TODO: remove await -> pass Promise -> use "use" hook in client
  if (tab === 'tasks') {
    [tasks, tasksCount] = await Promise.all([
      fetchUserEarnTasks(user.id, { limit: pageItemsSize, offset: offset }),
      fetchUserEarnTasksCount(user.id)
    ]);
    pageTotal = Math.ceil(tasksCount / pageItemsSize);
  } else {
    quests = await fetchEarnQuestsByUserId(user.id);
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

  const earnWarningShow = !cookies().get('earnWarningHide')?.value;

  return (
    <div className="flex flex-col h-full max-w-[500px] max-[500px]:max-w-[100vw]">

      <EarnTabs activeTab={tab} />

      {tab === 'quests' 
        ? <EarnQuestList quests={quests} section={questSection} />
        : 
        <div className="flex flex-col justify-between h-full">
          <div>
            {!!tasks.length && <TasksFilter actions={actions} services={services} />}

            <EarnTaskList 
              tasks={tasksFiltered} 
              page={page} 
              pageTotal={pageTotal}
              pageItemsSize={pageItemsSize} 
              itemsTotal={tasksCount} 
            />
          </div>

          <div className="sticky bottom-[60px] z-40 bg-background px-2">
            <CreateTaskButton />
          </div>
        </div>
      }

      {earnWarningShow && <EarnWaringModal />}
    </div>
  )
}