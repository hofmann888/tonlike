import { IconType } from "react-icons"

export type NavLink = {
  name: string,
  href: string,
  icon: IconType,
}


////========== Forms

export type DepostitFormState = {
  errors?: {
    amount?: string[];
  };
  message?: string | null;
};

export type WithdrawFormState = {
  errors?: {
    amount?: string[];
    address?: string[];
  };
  message?: string | null;
};

export type CreateTaskFormState = {
  errors?: {
    actionId?: string[];
    serviceId?: string[];
    link?: string[];
    price?: string[];
    count?: string[];
  };
  message?: string | null;
};


//========== DB

export type User = {
  id: number,
  tg_id: number,
  address: string,
  balance: number,
  reward: number,
}

export type Service = {
  id: number,
  name: string,
  img: string,
}

export type Action = {
  id: number,
  name: string,
  reward: number,
}

export type Task = {
  id: number,
  link: string,
  price: number,
  count: number,
  done: number,
  status: TaskStatus,
	created_at: number,
	updated_at: number,
	deleted_at: number,
  user_id: number,
  action: Action,
  service: Service,
}

export type TaskDTO = {
  id: number,
  link: string,
  price: number,
  count: number,
  done: number,
  status: TaskStatus,
	created_at: number,
	updated_at: number,
	deleted_at: number,
  user_id: number,
  action_id: number,
  action_name: string,
  action_reward: number,
  service_id: number,
  service_name: string,
  service_img: string,
}

export enum TaskStatusEnum {
  ACTIVE = 'active',
  STOP = 'stop', // TODO: pause?
  DONE = 'done',
  DELETED = 'deleted', // TODO: archive?
}
export type TaskStatus = TaskStatusEnum.ACTIVE | TaskStatusEnum.STOP | TaskStatusEnum.DONE | TaskStatusEnum.DELETED

export enum TaskStatusTitleEnum {
  ACTIVE = 'Active',
  STOP = 'Stopped',
  DONE = 'Done',
  DELETED = 'Deleted',
}
export type TaskStatusTitle = TaskStatusTitleEnum.ACTIVE | TaskStatusTitleEnum.STOP | TaskStatusTitleEnum.DONE | TaskStatusTitleEnum.DELETED;

export type TaskStatusMapItem = {
  key: TaskStatus,
  title: TaskStatusTitle,
  icon: IconType,
  // count: number,
}

export enum TaskSortEnum {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
}
export type TaskSort = TaskSortEnum.PRICE_ASC | TaskSortEnum.PRICE_DESC | TaskSortEnum.DATE_ASC | TaskSortEnum.DATE_DESC;

export enum TaskSortTitleEnum {
  PRICE_ASC = 'Price: Low to High',
  PRICE_DESC = 'Price High to Low',
  DATE_ASC = 'Date: Low to High',
  DATE_DESC = 'Date: High to Low',
}
export type TaskSortTitle = TaskSortTitleEnum.PRICE_ASC | TaskSortTitleEnum.PRICE_DESC | TaskSortTitleEnum.DATE_ASC | TaskSortTitleEnum.DATE_DESC;

export type TaskSortMapItem = {
  key: TaskSort,
  title: TaskSortTitle,
}

export enum TasksFilterParamEnum {
  ACTIONS = 'actions',
  SERVICES = 'services',
  STATUS = 'status',
}
export type TasksFilterParam = TasksFilterParamEnum.ACTIONS | TasksFilterParamEnum.SERVICES | TasksFilterParamEnum.STATUS;

export type TaskFilterItem = {
  key: TasksFilterParam,
  values: string | string[]
}