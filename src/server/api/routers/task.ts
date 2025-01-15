// @/server/api/routers/task.ts
import { getTasksForToday } from "@/lib/utils/get-tasks-for-date";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type NewDbTask, taskCompletions, tasks } from "@/server/db/schema";
import {
  taskCategoryEnum,
  taskFrequencyEnum,
  type weekDaysType,
} from "@/types/form-types";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  getTodaysTasks: publicProcedure.query(async ({ ctx }) => {
    console.log("🔥 Get todays tasks was called");
    const whereConditions = [
      eq(tasks.userId, ctx.userId),
      eq(tasks.isArchived, false),
    ];

    const userTasks = await ctx.db.query.tasks.findMany({
      where: and(...whereConditions),
      orderBy: [desc(tasks.createdAt)],
    });

    if (!userTasks) return [];

    const usableUserTasks = userTasks.map((task) => ({
      ...task,
      weekDays: task.weekDays ? (task.weekDays as weekDaysType[]) : null,
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));

    const todaysCompletions = await ctx.db
      .select({
        taskId: taskCompletions.taskId,
        completedCount: taskCompletions.completedCount,
      })
      .from(taskCompletions)
      .where(
        and(
          eq(taskCompletions.userId, ctx.userId),
          sql`DATE(${taskCompletions.completedDate}) = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
        ),
      );

    const completionsMap = new Map(
      todaysCompletions.map((c) => [c.taskId, c.completedCount ?? 0]),
    );

    const todaysTasks = getTasksForToday(usableUserTasks).map((task) => {
      const completedCount = completionsMap.get(task.id) ?? 0;
      return {
        ...task,
        dailyCountFinished: completedCount,
      };
    });

    return todaysTasks.filter((task) => {
      const completedCount = completionsMap.get(task.id) ?? 0;

      return task.frequency === "daily"
        ? completedCount < (task.dailyCountTotal ?? 1)
        : completedCount === 0;
    });
  }),

  getAllTasks: publicProcedure.query(async ({ ctx }) => {
    console.log("🔥 Get all tasks was called");
    const whereConditions = [
      eq(tasks.userId, ctx.userId),
      eq(tasks.isArchived, false),
    ];

    const userTasks = await ctx.db.query.tasks.findMany({
      where: and(...whereConditions),
      orderBy: [desc(tasks.createdAt)],
    });

    if (!userTasks) {
      return [];
    }

    const usableUserTasks = userTasks.map((task) => ({
      ...task,
      weekDays: task.weekDays ? (task.weekDays as weekDaysType[]) : null,
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));

    return usableUserTasks;
  }),

  finishTask: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: taskId }) => {
      // Get the task
      const [task] = await ctx.db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.id, taskId),
            eq(tasks.userId, ctx.userId),
            eq(tasks.isArchived, false),
          ),
        )
        .limit(1);

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      // Use upsert instead of separate select + insert/update
      const [completion] = await ctx.db
        .insert(taskCompletions)
        .values({
          taskId,
          userId: ctx.userId,
          completedDate: sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
          completedCount: 1,
        })
        .onConflictDoUpdate({
          target: [
            taskCompletions.taskId,
            taskCompletions.userId,
            taskCompletions.completedDate,
          ],
          set: {
            completedCount: sql`
              CASE 
                WHEN ${taskCompletions.completedCount} < ${task.dailyCountTotal} 
                  AND ${task.frequency} = 'daily' 
                THEN ${taskCompletions.completedCount} + 1 
                ELSE ${taskCompletions.completedCount}
              END
            `,
          },
        })
        .returning();

      if (!completion) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update completion",
        });
      }

      return {
        ...task,
        dailyCountFinished: completion.completedCount,
      };
    }),

  addTask: publicProcedure
    .input(
      z.object({
        name: z.string(),
        frequency: z.enum(taskFrequencyEnum),
        category: z.enum(taskCategoryEnum),
        dailyCountTotal: z.number().nullable(),
        xValue: z.number().nullable(),
        startDate: z.date().nullable(),
        weekDays: z.array(z.string()).nullable(),
        monthDays: z.array(z.number()).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("🔥 Add task was called");
      const startDateISOString = input.startDate
        ? new Date(
            Date.UTC(
              input.startDate.getFullYear(),
              input.startDate.getMonth(),
              input.startDate.getDate(),
            ),
          ).toISOString()
        : null;
      const [newTask] = await ctx.db
        .insert(tasks)
        .values({
          name: input.name,
          frequency: input.frequency,
          category: input.category,
          dailyCountTotal: input.dailyCountTotal ?? 1,
          xValue: input.xValue ?? null,
          startDate: startDateISOString,
          weekDays: input.weekDays ?? null,
          monthDays: input.monthDays ?? null,
          userId: ctx.userId,
          isArchived: false,
        } satisfies NewDbTask)
        .returning();

      return newTask;
    }),

  deleteTask: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: taskId }) => {
      console.log("🔥 Delete task was called");
      const [deletedTask] = await ctx.db
        .update(tasks)
        .set({
          isArchived: true,
        })
        .where(
          and(
            eq(tasks.id, taskId),
            eq(tasks.userId, ctx.userId),
            eq(tasks.isArchived, false),
          ),
        )
        .returning();

      if (!deletedTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found or already deleted",
        });
      }

      return deletedTask;
    }),

  editTask: publicProcedure
    .input(
      z.object({
        taskId: z.string(),
        name: z.string(),
        frequency: z.enum(taskFrequencyEnum),
        category: z.enum(taskCategoryEnum),
        dailyCountTotal: z.number().nullable(),
        xValue: z.number().nullable(),
        startDate: z.date().nullable(),
        weekDays: z.array(z.string()).nullable(),
        monthDays: z.array(z.number()).nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("🔥 Edit task was called");
      const startDateISOString = input.startDate
        ? new Date(
            Date.UTC(
              input.startDate.getFullYear(),
              input.startDate.getMonth(),
              input.startDate.getDate(),
            ),
          ).toISOString()
        : null;

      const [updatedTask] = await ctx.db
        .update(tasks)
        .set({
          name: input.name,
          frequency: input.frequency,
          category: input.category,
          dailyCountTotal: input.dailyCountTotal ?? 1,
          xValue: input.xValue ?? null,
          startDate: startDateISOString,
          weekDays: input.weekDays ?? null,
          monthDays: input.monthDays ?? null,
        })
        .where(
          and(
            eq(tasks.id, input.taskId),
            eq(tasks.userId, ctx.userId),
            eq(tasks.isArchived, false),
          ),
        )
        .returning();

      if (!updatedTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found or unauthorized",
        });
      }

      return updatedTask;
    }),
});
