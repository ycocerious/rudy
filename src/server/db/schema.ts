import {
  type taskCategoryEnum,
  type taskFrequencyEnum,
} from "@/types/form-types";
import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
const commonIdSchema = (columnName: string) => serial(columnName).primaryKey();

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
    dailyCountFinished: integer("daily_count_finished").notNull(),
    xValue: integer("x_value"),
    startDate: date("start_date"),
    weekDays: varchar("week_days").array(),
    monthDays: integer("month_days").array(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
    taskId: integer("task_id")
      .references(() => tasks.id)
      .notNull(),
    userId: varchar("user_id").notNull(),
    completedDate: date("completed_date").notNull(),
    completedCount: integer("completed_count").default(1).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    taskDateIdx: index("task_date_idx").on(
      table.taskId,
      table.userId,
      table.completedDate,
    ),
    userDateIdx: index("user_date_idx").on(table.userId, table.completedDate),
  }),
);

export const feedbacks = pgTable(
  "feedbacks",
  {
    id: commonIdSchema("feedback_id"),
    userId: varchar("user_id").notNull(),
    rating: integer("rating").notNull(),
    feedback: text("feedback"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
