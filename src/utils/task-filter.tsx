import { Action, Service, Task, TaskStatusEnum, TaskSortEnum, TasksFilterParamEnum, TaskFilterItem } from "@/lib/definitions";

export function tasksFilter(tasks: Task[], filters: TaskFilterItem[]) {
  const setFilter = (task: Task) => {
    let result = true;
    filters.every((filter: TaskFilterItem) => {
      if (filter.values.length) {
        if (typeof filter.values === 'string') {
          filter.values = filter.values.split(',');
        }
        if (filter.key === TasksFilterParamEnum.ACTIONS && !filter.values.includes(`${task.action.id}`)
        || filter.key === TasksFilterParamEnum.SERVICES && !filter.values.includes(`${task.service.id}`)) {
          result = false;
          return false;
        }
      }
      return true;
    });
    return result;
  }

  return tasks.filter(setFilter);
}

export function tasksSort(tasks: Task[], sort: string) {
  if (!sort.length) {
    return tasks;
  }

  const setSort = (a: Task, b: Task) => {
    switch (sort) {
      case TaskSortEnum.PRICE_ASC:
        if (a.price === b.price) return 0;
        return a.price < b.price ? -1 : 1;
      case TaskSortEnum.PRICE_DESC: 
        if (a.price === b.price) return 0;
        return a.price > b.price ? -1 : 1;
      case TaskSortEnum.DATE_ASC: 
        if (a.created_at === b.created_at) return 0;
        return a.created_at < b.created_at ? -1 : 1;
      case TaskSortEnum.DATE_DESC: 
        if (a.created_at === b.created_at) return 0;
        return a.created_at > b.created_at ? -1 : 1;
      default:
        return 0;
    }
  }

  return tasks.sort(setSort); 
}

export function tasksRelations(tasks: Task[]) {
  const actions: Action[] = [];
  const services: Service[] = [];

  tasks.map((task) => {
    if (!(task.action.id in actions)) {
      actions[task.action.id] = task.action;
    }
    if (!(task.service.id in services)) {
      services[task.service.id] = task.service;
    }
  });

  return { actions, services };
}

export function tasksStatusCount(tasks: Task[]) {
  const statusCount = {
    [TaskStatusEnum.ACTIVE]: 0,
    [TaskStatusEnum.PAUSED]: 0,
    [TaskStatusEnum.DONE]: 0,
    [TaskStatusEnum.DELETED]: 0,
  }

  if (tasks) {
    tasks.map((task) => {
      statusCount[task.status]++;
    })
  }

  return statusCount;
}