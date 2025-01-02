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
  status: TaskStatus.ACTIVE | TaskStatus.STOP | TaskStatus.DONE | TaskStatus.DELETED,
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
  status: TaskStatus.ACTIVE | TaskStatus.STOP | TaskStatus.DONE | TaskStatus.DELETED,
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

export enum TaskStatus {
  ACTIVE = 'active',
  STOP = 'stop',
  DONE = 'done',
  DELETED = 'deleted', // TODO: archive?
}

export enum TaskStatusTitle {
  ACTIVE = 'Active',
  STOP = 'Stopped',
  DONE = 'Done',
  DELETED = 'Deleted',
}

export type TaskStatusMapItem = {
  key: TaskStatus.ACTIVE | TaskStatus.STOP | TaskStatus.DONE | TaskStatus.DELETED,
  title: TaskStatusTitle.ACTIVE | TaskStatusTitle.STOP | TaskStatusTitle.DONE | TaskStatusTitle.DELETED,
  icon: IconType,
  // count: number,
}

export enum TaskSort {
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  DATE_ASC = 'date_asc',
  DATE_DESC = 'date_desc',
}

export enum TaskSortTitle {
  PRICE_ASC = 'Price: Low to High',
  PRICE_DESC = 'Price High to Low',
  DATE_ASC = 'Date: Low to High',
  DATE_DESC = 'Date: High to Low',
}

export type TaskSortMapItem = {
  key: TaskSort.PRICE_ASC | TaskSort.PRICE_DESC | TaskSort.DATE_ASC | TaskSort.DATE_DESC,
  title: TaskSortTitle.PRICE_ASC | TaskSortTitle.PRICE_DESC | TaskSortTitle.DATE_ASC | TaskSortTitle.DATE_DESC,
}