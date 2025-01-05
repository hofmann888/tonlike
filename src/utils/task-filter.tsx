import { Action, Service, Task, TaskStatus, TaskSort, TasksFilterParam, TaskFilterItem } from "@/lib/definitions";

export function tasksFilter(tasks: Task[], filters: TaskFilterItem[]) {
  const setFilter = (task: Task) => {
    let result = true;
    filters.some((filter: TaskFilterItem) => {
      if (filter.values.length) {
        if (typeof filter.values === 'string') {
          filter.values = filter.values.split(',');
        }
        if (filter.key === TasksFilterParam.ACTIONS && !filter.values.includes(`${task.action.id}`)
        || filter.key === TasksFilterParam.SERVICES && !filter.values.includes(`${task.service.id}`)) {
          result = false;
          return false;
        }
      }
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

  return statusCount;
}