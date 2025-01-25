import { TaskStatusEnum, TaskEarningStatusEnum, ReportReasonEnum, BlackListReasonEnum } from "@/lib/definitions";
import { pgTable, pgEnum, AnyPgColumn, boolean, smallint, integer, bigint, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

// TODO: add indexes in db

// =============== Users ===============
export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  referrerId: integer('referrer_id').references((): AnyPgColumn => usersTable.id, {onDelete: 'cascade'}), // TODO: remove cascade!
  balance: bigint({ mode: 'number' }).notNull().default(0),
  tgId: bigint('tg_id', { mode: 'number' }).notNull().unique(),
  tgUsername: varchar('tg_username', { length: 32 }).notNull(),
  tgPhotoUrl: varchar('tg_photo_url', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  // address: char({ length: 48 })
  // isBlocked | status?
  // lastLogin?
}
// (table) => { // TODO
  // return {
    // slugIndex: t.uniqueIndex("slug_idx").on(table.slug),
    // titleIndex: t.index("title_idx").on(table.title),
  // };}
);

export const usersRelations = relations(usersTable, ({ one, many }) => ({
	referrer: one(usersTable, {
		fields: [usersTable.referrerId],
		references: [usersTable.id],
	}),
  referrals: many(usersTable, { relationName: 'referrer' }) // TODO: check if correct...t.e. tipa i tam (inviter) i zdes must be "referrals"?....
  // TODO: ...
}));

// export const articleChildrenRelation = relations(articles, ({ many }) => ({
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
export const servicesTable = pgTable('services', {
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  icon: varchar({ length: 255 }), // TODO?: iconUrl? not null?
  active: boolean().default(true),
});

export const servicesRelations = relations(servicesTable, ({ many }) => ({
  serviceActions: many(serviceActionsTable),
}));

// =============== Actions ===============
export const actionsTable = pgTable('actions', {
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  icon: varchar({ length: 255 }),
  active: boolean().default(true),
});

export const actionsRelations = relations(actionsTable, ({ many }) => ({
  serviceActions: many(serviceActionsTable),
}));

// =============== Service actions ===============
export const serviceActionsTable = pgTable('service_actions', {
  id: smallint().primaryKey().generatedByDefaultAsIdentity(),
  serviceId: smallint('service_id').notNull().references(() => servicesTable.id),
  actionId: smallint('action_id').notNull().references(() => actionsTable.id),
  active: boolean().default(true),
}); // (t) => ({ pk: primaryKey({ columns: [t.userId, t.groupId] })}) // TODO?

export const serviceActionsRelations = relations(serviceActionsTable, ({ one }) => ({
  service: one(servicesTable, {
    fields: [serviceActionsTable.serviceId],
    references: [servicesTable.id],
  }),
  action: one(actionsTable, {
    fields: [serviceActionsTable.actionId],
    references: [actionsTable.id],
  }),
  // TODO?: tasks?
}));


// =============== Tasks ===============
// TODO?: scheduled status? or better opredelyat po field?
// TODO?: deleted nuzhno vashe?
export const taskStatusEnum = pgEnum('task_status', [
  TaskStatusEnum.ACTIVE, TaskStatusEnum.PAUSED, TaskStatusEnum.DONE, TaskStatusEnum.DELETED
]);

// TODO: currency
export const tasksTable = pgTable('tasks', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  serviceActionId: smallint('service_action_id').notNull().references(() => serviceActionsTable.id), // TODO?: vse taki serviceId and actionId? hzhz
  link: varchar({ length: 255 }).notNull(),
  price: bigint({ mode: 'number' }).notNull(), // TODO?: numeric?  // TODO?: reward?...vryd ly...hotya...
  count: integer().notNull(),
  done: integer().notNull().default(0),
  status: taskStatusEnum().notNull().default(TaskStatusEnum.ACTIVE),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
});

export const tasksRelations = relations(tasksTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [tasksTable.userId],
    references: [usersTable.id],
  }),
  serviceAction: one(serviceActionsTable, { // TODO: service, action
    fields: [tasksTable.serviceActionId],
    references: [serviceActionsTable.id],
  }),
  earnings: many(taskEarningsTable),
  reports: many(reportsTable),
}));

// =============== Tasks Earnings ===============
// TODO?: mozhet uzh naxui i prosto alya isHidden? raz uzh no reported status...
export const taskEarningStatusEnum = pgEnum('task_earning_status', [
  TaskEarningStatusEnum.DONE, TaskEarningStatusEnum.HIDDEN
]);

export const taskEarningsTable = pgTable('task_earnings', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  taskId: integer('task_id').notNull().references(() => tasksTable.id),
  profit: bigint({ mode: 'number' }).notNull().default(0),
  status: taskEarningStatusEnum().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  // TODO?: reward?
});

export const taskEarningRelations = relations(taskEarningsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [taskEarningsTable.userId],
    references: [usersTable.id],
  }),
  task: one(tasksTable, {
    fields: [taskEarningsTable.taskId],
    references: [tasksTable.id],
  }),
}));

// =============== Quests =============== // TODO: blyad vse taki v odnu table s tasks???.................aaaaa.s.da,sdas,da;sfkadfad
export const questsTable = pgTable('quests', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  serviceActionId: smallint('service_action_id').notNull().references(() => serviceActionsTable.id), // TODO?: vse taki serviceId and actionId? hzhz
  link: varchar({ length: 255 }).notNull(),
  price: bigint({ mode: 'number' }).notNull(), // TODO?: numeric?  // TODO?: reward?...vrayd ly...hotya...
  count: integer().notNull().default(1), // TODO?: countPerUser
  daily: boolean().notNull().default(false),
  active: boolean().notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
});

export const questsRelations = relations(questsTable, ({ one, many }) => ({
  serviceAction: one(serviceActionsTable, { // TODO: service, action
    fields: [questsTable.serviceActionId],
    references: [serviceActionsTable.id],
  }),
  earnings: many(questEarningsTable),
}));

// =============== Quests Earnings ===============
export const questEarningsTable = pgTable('quest_earnings', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  questId: integer('quest_id').notNull().references(() => questsTable.id),
  profit: bigint({ mode: 'number' }).notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const questEarningRelations = relations(questEarningsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [questEarningsTable.userId],
    references: [usersTable.id],
  }),
  quest: one(questsTable, {
    fields: [questEarningsTable.questId],
    references: [questsTable.id],
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

export const reportsTable = pgTable('reports', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  taskId: integer('task_id').notNull().references(() => tasksTable.id),
  reasons: reportReasonEnum().array().notNull(),
  comment: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const reportsRelations = relations(reportsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [reportsTable.userId],
    references: [usersTable.id],
  }),
  task: one(tasksTable, {
    fields: [reportsTable.taskId],
    references: [tasksTable.id],
  }),
}));

// =============== Black list ===============
export const blackListReasonEnum = pgEnum('black_list_reason', [
  BlackListReasonEnum.ACCOUNT, 
  BlackListReasonEnum.BEHAVIOUR, 
  BlackListReasonEnum.OTHER, 
  BlackListReasonEnum.TASK,
]);

export const blackListTable = pgTable('black_list', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id').notNull().references(() => usersTable.id),
  blockedUserId: integer('blocked_user_id').notNull().references(() => usersTable.id),
  taskId: integer('task_id').notNull().references(() => tasksTable.id),
  reasons: blackListReasonEnum().array().notNull(),
  comment: text(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const blackListRelations = relations(blackListTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [blackListTable.userId],
    references: [usersTable.id],
    relationName: 'user',
  }),
  blockedUser: one(usersTable, {
    fields: [blackListTable.blockedUserId],
    references: [usersTable.id],
    relationName: 'blockedUser',
  }),
  task: one(tasksTable, {
    fields: [blackListTable.taskId],
    references: [tasksTable.id],
  }),
}));


//   await sql(`DROP TABLE IF EXISTS black_list, reports, user_earnings, tasks, user_refs, users, service_actions, services, actions;`);
//   await sql(`DROP TYPE IF EXISTS task_status, user_earning_status, report_reason, black_list_reason;`);
