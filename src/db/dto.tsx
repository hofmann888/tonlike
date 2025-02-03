import { TaskStatus } from "@/lib/definitions";
import * as schema from "./schema";

// export type ServiceSelectDTO = typeof schema.services.$inferSelect

export type UserInsertDTO = typeof schema.users.$inferInsert; 
export type UserUpdateDto = {
  referrerId?: number,
  balance?: number,
  tgUsername?: string,
  tgPhotoUrl?: string,
}

export type TaskInsertDTO = typeof schema.tasks.$inferInsert; // TODO?: custom dto?
export type TaskSelectDTO = typeof schema.tasks.$inferSelect;
export type TaskUpdateDTO = {
  link?: string,
  price?: number,
  count?: number,
  done?: number,
  status?: TaskStatus,
}

export type TaskEarningInsertDTO = typeof schema.taskEarnings.$inferInsert;

export type QuestEarningInsertDTO = typeof schema.questEarnings.$inferInsert;

export type ReportInsertDTO = typeof schema.reports.$inferInsert;

export type BlackListInsertDTO = typeof schema.blackList.$inferInsert;