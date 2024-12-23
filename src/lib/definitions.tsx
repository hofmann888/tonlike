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

export type NewTaskFormState = {
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
}

export type Action = {
  id: number,
  name: string,
  reward: number
}

export type Task = {
  id: number,
  action: number, // todo: action obj?
  service: number, // todo: service obj?
  link: string,
  price: number,
  count: number,
  done: number,
  status: TaskStatus.ACTIVE | TaskStatus.STOP | TaskStatus.DONE,
	created_at: number,
	updated_at: number,
	deleted_at: number,
}

export enum TaskStatus {
  ACTIVE = 'active',
  STOP = 'stop',
  DONE = 'done',
}