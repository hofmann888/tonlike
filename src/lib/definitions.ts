import { IconType } from "react-icons"

export type NavLink = {
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

export type EditTaskFormState = {
  errors?: {
    price?: string[];
    count?: string[];
  };
  message?: string | null;
};

export type EarnItemReportFormState = {
  errors?: {
    reasons?: string[];
    comment?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export type PerformerBlockFormState = {
  errors?: {
    reasons?: string[];
    comment?: string[];
  };
  message?: string | null;
  success?: boolean;
};


//========== DB

export type User = {
  id: number,
  address: string,
  balance: number, // TODO: bigint?
  tg_id: number,
  tg_username: string,
  tg_photo_url: string,
}

export type Service = {
  id: number,
  name: string,
  img: string,
  active: boolean,
  actionIds?: number[]
}

export type Action = {
  id: number,
  name: string,
  active: boolean,
}

export type Task = {
  id: number,
  link: string,
  price: number,
  // currency: Currency,
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
  // currency: Currency,
  count: number,
  done: number,
  status: TaskStatus,
	created_at: number,
	updated_at: number,
	deleted_at: number,
  user_id: number,
  action_id: number,
  action_name: string,
  service_id: number,
  service_name: string,
  service_img: string,
}

export enum TaskStatusEnum {
  ACTIVE = 'active',
  PAUSED = 'paused',
  SCHEDULED = 'scheduled',
  DONE = 'done',
  DELETED = 'deleted', // TODO: archive?
}
export type TaskStatus = TaskStatusEnum.ACTIVE | TaskStatusEnum.PAUSED | TaskStatusEnum.SCHEDULED | TaskStatusEnum.DONE | TaskStatusEnum.DELETED

export enum TaskStatusTitleEnum {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  SCHEDULED = 'Scheduled',
  DONE = 'Done',
  DELETED = 'Deleted',
}
export type TaskStatusTitle = TaskStatusTitleEnum.ACTIVE | TaskStatusTitleEnum.PAUSED | TaskStatusTitleEnum.SCHEDULED | TaskStatusTitleEnum.DONE | TaskStatusTitleEnum.DELETED;

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

export enum UserEarningStatusEnum {
  DONE = 'done',
  HIDDEN = 'hidden',
}
export type UserEarningStatus = UserEarningStatusEnum.DONE | UserEarningStatusEnum.HIDDEN;

export type UserEarning = {
  id: number,
  task_id: number,
  user_id: number,
  profit: number,
  status: UserEarningStatus,
  created_at: number,
}

export type Report = {
  id: number,
  user_id: number,
  task_id: number,
  reasons: ReportReason[],
  comment: string,
  created_at: number,
} 

export enum ReportReasonEnum {
  UNAVAILABLE = 'unavailable',
  SCAM = 'scam',
  SPAM = 'spam',
  COPYRIGHT = 'copyright',
  CONTENT = 'content',
  OTHER = 'other'
}
export type ReportReason = ReportReasonEnum.UNAVAILABLE | ReportReasonEnum.SCAM | ReportReasonEnum.SPAM | ReportReasonEnum.COPYRIGHT | ReportReasonEnum.CONTENT | ReportReasonEnum.OTHER;

export type ReportReasonsMapItem = {
  key: ReportReason,
  title: string,
}

export type Performer = {
  id: number,
  tg_username: string,
  tg_photo_url: string,
  created_at: number,
  is_blocked: boolean,
}

export enum BlackListReasonEnum {
  TASK = 'task',
  ACCOUNT = 'account',
  BEHAVIOUR = 'behavior',
  OTHER = 'other'
}
export type BlackListReason = BlackListReasonEnum.TASK | BlackListReasonEnum.ACCOUNT | BlackListReasonEnum.BEHAVIOUR | BlackListReasonEnum.OTHER;

export type BlackListReasonsMapItem = {
  key: BlackListReason,
  title: string,
}

// export type CurrencyMapItem = {
//   key: Currency,
//   title: string,
//   icon: IconType,
// }
// export enum CurrencyEnum {
//   COIN = 'coin',
//   USDT = 'usdt',
// }
// export type Currency = CurrencyEnum.COIN | CurrencyEnum.USDT;