import {
  type taskCategoryEnum,
  type taskFrequencyEnum,
} from "@/types/form-types";
import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const commonIdSchema = (columnName: string) =>
  text(columnName)
    .primaryKey()
    .$defaultFn(() => nanoid());

export const tasks = pgTable(
  "tasks",
  {
    id: commonIdSchema("task_id"),
    userId: varchar("user_id").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    frequency: varchar("frequency", { length: 20 })
      .$type<(typeof taskFrequencyEnum)[number]>()
      .notNull(),
    category: varchar("category", { length: 20 })
      .$type<(typeof taskCategoryEnum)[number]>()
      .notNull(),
    dailyCountTotal: integer("daily_count_total").notNull(),
    xValue: integer("x_value"),
    startDate: date("start_date"),
    weekDays: varchar("week_days").array(),
    monthDays: integer("month_days").array(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`)
      .notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
  },
  (table) => ({
    userIdIdx: index("task_user_id_idx").on(table.userId),
  }),
);

export const taskCompletions = pgTable(
  "task_completions",
  {
    id: commonIdSchema("completion_id"),
    taskId: varchar("task_id")
      .references(() => tasks.id)
      .notNull(),
    userId: varchar("user_id").notNull(),
    completedDate: date("completed_date").notNull(),
    completedCount: integer("completed_count").default(1).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`)
      .notNull(),
  },
  (table) => ({
    taskDateIdx: index("task_date_idx").on(
      table.taskId,
      table.userId,
      table.completedDate,
    ),
    userDateIdx: index("user_date_idx").on(table.userId, table.completedDate),
    uniqueCompletion: uniqueIndex("unique_task_completion").on(
      table.taskId,
      table.userId,
      sql`DATE(${table.completedDate})`,
    ),
  }),
);

export const feedbacks = pgTable(
  "feedbacks",
  {
    id: commonIdSchema("feedback_id"),
    userId: varchar("user_id").notNull(),
    rating: integer("rating").notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`)
      .notNull(),
  },
  (table) => ({
    userIdIdx: index("feedback_user_id_idx").on(table.userId),
  }),
);

export const dailyCompletions = pgTable(
  "daily_completions",
  {
    id: commonIdSchema("daily_completion_id"),
    userId: varchar("user_id").notNull(),
    completionDate: date("completion_date").notNull(),
    completionPercentage: integer("completion_percentage").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')`)
      .notNull(),
  },
  (table) => ({
    dailyCompletionsUserDateIdx: index("daily_completions_user_date_idx").on(
      table.userId,
      table.completionDate,
    ),
    unq: unique("daily_completions_user_date_unique").on(
      table.userId,
      table.completionDate,
    ),
  }),
);

// Types for TypeScript
export type DbTask = typeof tasks.$inferSelect;
export type NewDbTask = typeof tasks.$inferInsert;
