import { pgTable, pgEnum, AnyPgColumn, boolean, smallint, integer, bigint, varchar, char, text, timestamp } from "drizzle-orm/pg-core";
import { TaskStatusEnum, ReportReasonEnum, BlackListReasonEnum, ProductTypeEnum } from "@/lib/definitions";
import { relations } from 'drizzle-orm';

// TODO: add indexes in db

// =============== Users ===============
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  referrerId: integer('referrer_id').references((): AnyPgColumn => users.id, {onDelete: 'cascade'}), // TODO: remove cascade!
  tgId: bigint('tg_id', { mode: 'number' }).notNull().unique(),
  tgUsername: varchar('tg_username', { length: 32 }),
  tgPhotoUrl: varchar('tg_photo_url', { length: 255 }),
  balance: bigint({ mode: 'number' }).notNull().default(0),
  claimed: bigint({ mode: 'number' }).notNull().default(0), // TODO?: referralProfit(Claimed)
  address: char({ length: 48 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  // isBlocked | status?
  // lastLogin?
}
// (table) => { // TODO
  // return {
    // slugIndex: t.uniqueIndex("slug_idx").on(table.slug),
    // titleIndex: t.index("title_idx").on(table.title),
  // };}
);

export const usersRelations = relations(users, ({ one, many }) => ({
	referrer: one(users, {
		fields: [users.referrerId],
		references: [users.id],
	}),
  referrals: many(users, { relationName: 'referrer' }) // TODO: check if correct...t.e. tipa i tam (inviter) i zdes must be "referrals"?....
  // TODO: ...
}));
// export const articleChildrenRelation = relations(articles, ({ many }) => ({ // TODO?
//   childarticles: many(articles, { relationName: 'childarticles' })
// }));
// export const childArticleRelation = relations(articles, ({ one }) => ({
//   parentArticle: one(articles, {
//      fields: [articles.parentArticleId],
//      references: [articles.id],
//      relationName: 'childarticles' // TODO: che? pochemu the same relationName to i tam and there? Huh blyat'?
//   })
// }));

// =============== Services ===============
export const services = pgTable('services', { // add order(priority)
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  icon: varchar({ length: 255 }), // TODO?: iconUrl? not null?
  active: boolean().notNull().default(true),
  // TODO?: hidden?
  // TODO?: timestamps?
});

export const servicesRelations = relations(services, ({ many }) => ({
  serviceActions: many(serviceActions),
}));

// =============== Actions ===============
export const actions = pgTable('actions', {
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  icon: varchar({ length: 255 }),
  active: boolean().notNull().default(true),
  // TODO?: timestamps?
});

export const actionsRelations = relations(actions, ({ many }) => ({
  serviceActions: many(serviceActions),
}));

// =============== Service actions ===============
export const serviceActions = pgTable('service_actions', {
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  serviceId: smallint('service_id').notNull().references(() => services.id),
  actionId: smallint('action_id').notNull().references(() => actions.id),
  name: varchar({ length: 255 }),
  title: varchar({ length: 255 }),
  active: boolean().notNull().default(true),
  // TODO?: timestamps?
});
// (t) => ([{ 
//   pk: primaryKey({ columns: [t.serviceId, t.actionId] })
// }]));

export const serviceActionsRelations = relations(serviceActions, ({ one }) => ({
  service: one(services, {
    fields: [serviceActions.serviceId],
    references: [services.id],
  }),
  action: one(actions, {
    fields: [serviceActions.actionId],
    references: [actions.id],
  }),
  // TODO?: tasks?
}));

export enum ServiceActionsRelationsEnum {
  SERVICE = 'service',
  ACTION = 'action',
}
export type ServiceActionsRelation = ServiceActionsRelationsEnum.SERVICE | ServiceActionsRelationsEnum.ACTION;


// =============== Tasks ===============
// TODO?: scheduled status? or better opredelyat po field?
// TODO?: deleted nuzhno vashe?
export const taskStatusEnum = pgEnum('task_status', [
  TaskStatusEnum.ACTIVE, TaskStatusEnum.PAUSED, TaskStatusEnum.DONE, TaskStatusEnum.DELETED
]);


export const tasks = pgTable('tasks', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  serviceActionId: smallint('service_action_id').notNull().references(() => serviceActions.id), // TODO?: vse taki serviceId and actionId? hzhz
  link: varchar({ length: 255 }).notNull(),
  price: bigint({ mode: 'number' }).notNull(), // TODO?: numeric?  // TODO?: reward?...vryd ly...hotya...
  count: integer().notNull(),
  status: taskStatusEnum().notNull().default(TaskStatusEnum.ACTIVE),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
  // done: integer().notNull().default(0), // TODO?: replace with count(task_earnings)?
  // serviceId: integer('service_id').notNull().references(() => services.id),
  // actionId: integer('action_id').notNull().references(() => actions.id),
  // currency: CurrencyEnum // TODO
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  serviceAction: one(serviceActions, { // TODO?: service, action
    fields: [tasks.serviceActionId],
    references: [serviceActions.id],
  }),
  earnings: many(taskEarnings),
  reports: many(reports),
  // service: one(services, {
  //   fields: [tasks.serviceId],
  //   references: [services.id],
  // }),
  // action: one(actions, {
  //   fields: [tasks.actionId],
  //   references: [actions.id],
  // }),
}));


export enum TaskRelationEnum {
  SERVICE_ACTION = 'serviceAction',
  EARNINGS = 'earnings',
  USER = 'user',
  REPORTS = 'reports',
}
export type TaskRelation = TaskRelationEnum.SERVICE_ACTION | TaskRelationEnum.EARNINGS | TaskRelationEnum.USER | TaskRelationEnum.REPORTS;


// =============== Tasks Earnings ===============
// TODO?: mozhet uzh naxui i prosto alya isHidden? raz uzh no reported status...
//        da i isHidden uzh nahui uzh raz uzh na t poshlo epta blyad - profit libo 0 or $...
//        hotya, mozhet nado budet hidden list pokazivat'?...sikasdjajdjfl....hotya tak 0 zhe
// export const taskEarningStatusEnum = pgEnum('task_earning_status', [
//   TaskEarningStatusEnum.DONE, TaskEarningStatusEnum.HIDDEN
// ]);
export const taskEarnings = pgTable('task_earnings', { // TODO?: task_performers?
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  profit: bigint({ mode: 'number' }).notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // status: taskEarningStatusEnum().notNull(), // TODO?: mb prigoditsya vse taki hui znaet poka...ili isHidden?
  // TODO?: reward?
});

export const taskEarningRelations = relations(taskEarnings, ({ one }) => ({
  user: one(users, {
    fields: [taskEarnings.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [taskEarnings.taskId],
    references: [tasks.id],
  }),
}));

// =============== Quests =============== 
// TODO?: blyad vse taki v odnu table s tasks???.................aaaaa.s.da,sdas,da;sfkadfad
//       mb one table tasks and split task_earnings and quest_earnings??...vryad li
export const quests = pgTable('quests', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  serviceActionId: smallint('service_action_id').notNull().references(() => serviceActions.id), // TODO?: vse taki serviceId and actionId? hzhz
  link: varchar({ length: 255 }),
  title: varchar({ length: 255 }),
  description: varchar({ length: 255 }),
  icon: varchar({ length: 255 }),
  price: bigint({ mode: 'number' }).notNull(), // TODO?: numeric?  // TODO?: reward?...vrayd ly...hotya...
  countPerUser: integer('count_per_user').notNull().default(1), // TODO: ne sovsem to...tipa earning tolko 1 budet
  daily: boolean().notNull().default(false),
  partner: boolean().notNull().default(false),
  active: boolean().notNull().default(true),
  priority: integer().notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
  // serviceId: integer('service_id').notNull().references(() => services.id),
  // actionId: integer('action_id').notNull().references(() => actions.id),
  // showLink TODO?
  // count TODO?: tipo limited quests?  
});

export const questsRelations = relations(quests, ({ one, many }) => ({
  serviceAction: one(serviceActions, {
    fields: [quests.serviceActionId],
    references: [serviceActions.id],
  }),
  earnings: many(questEarnings),
  // service: one(services, {
  //   fields: [quests.serviceId],
  //   references: [services.id],
  // }),
  // action: one(actions, {
  //   fields: [quests.actionId],
  //   references: [actions.id],
  // }),
}));

export enum QuestRelationEnum {
  SERVICE_ACTION = 'serviceAction',
  EARNINGS = 'earnings',
}
export type QuestRealation = QuestRelationEnum.SERVICE_ACTION | QuestRelationEnum.EARNINGS;

// =============== Quests Earnings ===============
export const questEarnings = pgTable('quest_earnings', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  questId: integer('quest_id').notNull().references(() => quests.id),
  profit: bigint({ mode: 'number' }).notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const questEarningRelations = relations(questEarnings, ({ one }) => ({
  user: one(users, {
    fields: [questEarnings.userId],
    references: [users.id],
  }),
  quest: one(quests, {
    fields: [questEarnings.questId],
    references: [quests.id],
  }),
}));

// =============== Reports ===============
export const reportReasonEnum = pgEnum('report_reason', [
  ReportReasonEnum.CONTENT, 
  ReportReasonEnum.COPYRIGHT, 
  ReportReasonEnum.OTHER, 
  ReportReasonEnum.SCAM, 
  ReportReasonEnum.SPAM, 
  ReportReasonEnum.UNAVAILABLE
]);

export const reports = pgTable('reports', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  taskId: integer('task_id').notNull().references(() => tasks.id),
  reasons: reportReasonEnum().array().notNull(),
  comment: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [reports.taskId],
    references: [tasks.id],
  }),
}));

// =============== Black list ===============
export const blackListReasonEnum = pgEnum('black_list_reason', [
  BlackListReasonEnum.ACCOUNT, 
  BlackListReasonEnum.BEHAVIOUR, 
  BlackListReasonEnum.OTHER, 
  BlackListReasonEnum.TASK,
]);

export const blackList = pgTable('black_list', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  blockedUserId: integer('blocked_user_id').notNull().references(() => users.id),
  reasons: blackListReasonEnum().array().notNull(),
  comment: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // taskId: integer('task_id').notNull().references(() => tasks.id), // TODO?: i naxer eto nuzhno voobshe?
});

export const blackListRelations = relations(blackList, ({ one }) => ({
  user: one(users, {
    fields: [blackList.userId],
    references: [users.id],
    relationName: 'user',
  }),
  blockedUser: one(users, {
    fields: [blackList.blockedUserId],
    references: [users.id],
    relationName: 'blockedUser',
  }),
  // task: one(tasks, {
  //   fields: [blackList.taskId],
  //   references: [tasks.id],
  // }),
}));


// =============== Shop ===============
export const productTypeEnum = pgEnum('product_type', [
  ProductTypeEnum.COIN,
  ProductTypeEnum.SUBSCRIPTION,
]);

export const products = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: productTypeEnum().notNull(),
  title: varchar({ length: 255 }),
  description: varchar({ length: 255 }),
  imgUrl: varchar('img_url', { length: 255 }),
  amount: integer().notNull().default(1),
  price: bigint({ mode: 'number' }).notNull(),
  discount: smallint().notNull().default(0),
  priority: integer().notNull().default(0),
  active: boolean().notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  // TODO: currency
});

export const payments = pgTable('payments', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => users.id),
  productId: integer('product_id').notNull().references(() => products.id),
  tgChargeId: varchar('tg_charge_id', { length: 255 }), // TODO?: txId?
  providerChargeId: varchar('provider_charge_id', { length: 255 }),
  price: bigint({ mode: 'number' }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // TODO: currency
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
    relationName: 'user',
  }),
  product: one(products, {
    fields: [payments.productId],
    references: [products.id],
    relationName: 'product',
  }),
}));