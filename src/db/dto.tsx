import { TaskStatus } from "@/lib/definitions";
import * as schema from "./schema";
import { SQL } from "drizzle-orm";

// export type ServiceSelectDTO = typeof schema.services.$inferSelect

export type UserInsertDTO = typeof schema.users.$inferInsert; 
export type UserUpdateDto = {
  referrerId?: number | null,
  tgUsername?: string | null,
  tgPhotoUrl?: string | null,
  balance?: number,
  claimed?: number,
}

export type TaskInsertDTO = typeof schema.tasks.$inferInsert; // TODO?: custom dto?
export type TaskSelectDTO = typeof schema.tasks.$inferSelect;
export type TaskUpdateDTO = {
  link?: string,
  price?: number,
  count?: number,
  done?: number,
  status?: TaskStatus,
  deletedAt?: Date | SQL
}

export type TaskEarningInsertDTO = typeof schema.taskEarnings.$inferInsert;

export type QuestEarningInsertDTO = typeof schema.questEarnings.$inferInsert;

export type ReportInsertDTO = typeof schema.reports.$inferInsert;

export type BlackListInsertDTO = typeof schema.blackList.$inferInsert;

export type PaymentInsertDTO = typeof schema.payments.$inferInsert;