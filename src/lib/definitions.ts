import { IconType } from "react-icons";

// TODO?: decompose? enums and types in seperate files?

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
    serviceActionId?: string[];
    link?: string[];
    price?: string[];
    count?: string[];
    // serviceId?: string[];
    // actionId?: string[];
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

export type EarnTaskReportFormState = {
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
  tgUsername: string | null,
  tgPhotoUrl: string | null,
  balance: number,
  claimed: number,
  createdAt?: Date,
	updatedAt?: Date,
}

export type Referral = {
  id: number,
  profit: number,
  tgUsername: string | null,
  tgPhotoUrl: string | null,
  createdAt: Date,
}

export type Action = {
  id: number,
  name: string,
  title: string,
  icon: string,
  active: boolean,
}

export type Service = { // TODO?: timestamps
  id: number,
  name: ServiceName,
  title: string,
  icon: string,
  active: boolean,
  actions?: Action[],
  serviceActions?: ServiceAction[],
}

export enum ServiceNameEnum {
  APP = 'app',
  TELEGRAM = 'tg',
  X = 'x',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  YOUTUBE = 'youtube',
  VK = 'vk',
  FARCASTER = 'farcaster',
  LINK = 'link',
}
export type ServiceName = 
  ServiceNameEnum.APP | 
  ServiceNameEnum.TELEGRAM | 
  ServiceNameEnum.X | 
  ServiceNameEnum.INSTAGRAM | 
  ServiceNameEnum.TIKTOK | 
  ServiceNameEnum.YOUTUBE | 
  ServiceNameEnum.VK | 
  ServiceNameEnum.FARCASTER | 
  ServiceNameEnum.LINK
;

export type ServiceAction = {
  id: number,
  serviceId: number,
  actionId: number,
  name?: string, // TODO: type ServiceActionName
  title?: string,
  active: boolean,
  service?: Service,
  action?: Action,
}

export enum ServiceActionNameEnum {
  APP_CHECK_IN = 'app_check_in',
  APP_AD = 'app_ad',
  APP_INVITE = 'app_invite',
  APP_TASK_CREATE = 'app_task_create',
  APP_TASK_DONE = 'app_task_done',
  APP_QUEST_DONE = 'app_quest_done',
  APP_KYC = 'app_kyc',
  TELEGRAM_VIEW = 'tg_view',
  TELEGRAM_REACTION = 'tg_react',
  TELEGRAM_COMMENT = 'tg_comment',
  TELEGRAM_VOTE = 'tg_vote',
  TELEGRAM_SUBSCRIBE = 'tg_subscribe',
  TELEGRAM_BOOST = 'tg_boost',
}

export type Task = {
  id: number,
  userId: number,
  serviceActionId: number,
  link: string,
  price: number,
  count: number,
  doneCount?: number,
  doneSum?: number,
  status: TaskStatus,
	createdAt: Date, // TODO?: undefined?
	updatedAt?: Date,
	deletedAt?: Date,
  service?: Service,
  action?: Action,
  serviceAction?: ServiceAction,
}

export enum TaskStatusEnum { // TODO?: scheduled? blocked | banned?
  ACTIVE = 'active',
  PAUSED = 'paused',
  DONE = 'done',
  DELETED = 'deleted', // TODO?: archive?
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
  serviceActionId: number
  link?: string,
  title?: string,
  price: number,
  countPerUser: number,
  daily: boolean,
  priority: number,
  active: boolean,
  doneLastAt?: Date, // TODO?: doneLastDate
	createdAt: Date, // TODO?: undefined?
	updatedAt?: Date,
	deletedAt?: Date,
  service?: Service,
  action?: Action,
  serviceAction: ServiceAction,
  // doneCount?: number, 
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
  tgUsername: string | null,
  tgPhotoUrl: string | null,
  profit: number,
  isBlocked: boolean,
  doneAt: Date, // TODO?: createdAt?
}

export type BlackListItem = {
  id: number,
  userId: number,
  blockedUserId: number,
  reasons: BlackListReason[],
  comment: string | null,
  createdAt: Date,
  blockedUser?: User,
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

export type LeaderboardItem = { // TODO?: id?
  position: number,
  balance: number,
  tgPhotoUrl: string | null,
  tgUsername: string | null,
}