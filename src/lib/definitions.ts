import { IconType } from "react-icons";

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
  referrerId: number | null,
  tgId: number,
  tgUsername: string,
  tgPhotoUrl: string,
  balance: number,
  createdAt?: Date,
	updatedAt?: Date,
}

export type Service = { // TODO?: timestamps
  id: number,
  name: string,
  title: string,
  icon: string,
  active: boolean,
  actions?: Action[]
}

export type Action = {
  id: number,
  name: string,
  title: string,
  icon: string,
  active: boolean,
}

export type Task = {
  id: number,
  userId: number,
  serviceId: number,
  actionId: number,
  link: string,
  price: number,
  count: number,
  done: number,
  status: TaskStatus,
	createdAt: Date, // TODO?: undefined?
	updatedAt?: Date,
	deletedAt?: Date,
  service?: Service,
  action?: Action,
}

export enum TaskStatusEnum { // TODO?: scheduled? blocked | banned?
  ACTIVE = 'active',
  PAUSED = 'paused',
  DONE = 'done',
  DELETED = 'deleted', // TODO: archive?
}
export type TaskStatus = TaskStatusEnum.ACTIVE | TaskStatusEnum.PAUSED | TaskStatusEnum.DONE | TaskStatusEnum.DELETED

export enum TaskStatusTitleEnum {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  DONE = 'Done',
  DELETED = 'Deleted',
}
export type TaskStatusTitle = TaskStatusTitleEnum.ACTIVE | TaskStatusTitleEnum.PAUSED | TaskStatusTitleEnum.DONE | TaskStatusTitleEnum.DELETED;

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

// export enum TaskEarningStatusEnum {
//   DONE = 'done',
//   HIDDEN = 'hidden',
// }
// export type TaskEarningStatus = TaskEarningStatusEnum.DONE | TaskEarningStatusEnum.HIDDEN;

export type TaskEarning = {
  id: number,
  taskId: number,
  userId: number,
  profit: number,
  createdAt: Date,
  // status: TaskEarningStatus,
}

export type Quest = { // TODO?: EarnQuest?
  id: number,
  serviceId: number,
  actionId: number,
  link?: string,
  title?: string,
  price: number,
  countPerUser: number,
  daily: boolean,
  priority: number,
  active: boolean,
  doneCount?: number, 
  doneLastAt?: Date, // TODO?: doneLastDate
	createdAt: Date, // TODO?: undefined?
	updatedAt?: Date,
	deletedAt?: Date,
  service?: Service,
  action?: Action,
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
  tgUsername: string,
  tgPhotoUrl: string,
  isBlocked: boolean,
  doneAt: Date, // TODO?: createdAt?
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