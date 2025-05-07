import { User, Task, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";
import { tasksRelations, tasksFilter, tasksSort } from "@/utils/task-filter";
import { fetchUserEarnTasks, fetchUserEarnTasksCount } from "@/db/query";
import { getAuthUser } from "@/core/session";
import { redirect } from 'next/navigation';
import PageLoader from "@/components/Common/PageLoader";
import TasksFilter from "@/components/Tasks/TasksFilter";
import EarnTaskList from "@/components/Earn/EarnTaskList";
import CreateTaskButton from "@/components/Tasks/CreateTaskButton";

export const revalidate = 60;

export default async function EarnTasksPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const user: User = await getAuthUser();
  if (!user) return (<PageLoader />);

  const page = searchParams?.page as any as number ?? 1;
  let pageTotal = 1;
  const pageItemsSize = 10;
  const offset = (page - 1) * pageItemsSize;

  let tasks: Task[] = [];
  let tasksCount = 0;

  // TODO?: move this logic to separate components to use Suspense?
  // TODO: remove await -> pass Promise -> use "use" hook in client
  [tasks, tasksCount] = await Promise.all([
    fetchUserEarnTasks(user.id, { limit: pageItemsSize, offset: offset }),
    fetchUserEarnTasksCount(user.id)
  ]);

  pageTotal = Math.ceil(tasksCount / pageItemsSize);
  if (page > pageTotal) {
    redirect(`/earn?page=${pageTotal}`);
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
  )
}