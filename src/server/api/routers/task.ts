// @/server/api/routers/task.ts
import { getTasksForDate } from "@/lib/utils/get-tasks-for-date";
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
    console.log("This is called");
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

    const todaysCompletions = await ctx.db
      .select({
        taskId: taskCompletions.taskId,
        completedCount: taskCompletions.completedCount,
      })
      .from(taskCompletions)
      .where(
        and(
          eq(taskCompletions.userId, ctx.userId),
          sql`DATE(${taskCompletions.completedDate}) = CURRENT_DATE`,
        ),
      );

    const completionsMap = new Map(
      todaysCompletions.map((c) => [c.taskId, c.completedCount ?? 0]),
    );

    const todaysTasks = getTasksForDate(usableUserTasks).map((task) => {
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
    .input(z.number())
    .mutation(async ({ ctx, input: taskId }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return await ctx.db.transaction(async (tx) => {
        // Get the task
        const [task] = await tx
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

        // Get or create today's completion record
        const [existingCompletion] = await tx
          .select()
          .from(taskCompletions)
          .where(
            and(
              eq(taskCompletions.taskId, taskId),
              eq(taskCompletions.userId, ctx.userId),
              sql`DATE(${taskCompletions.completedDate}) = CURRENT_DATE`,
            ),
          )
          .limit(1);

        if (existingCompletion) {
          // For daily tasks with count
          if (
            task.frequency === "daily" &&
            task.dailyCountTotal &&
            existingCompletion.completedCount &&
            existingCompletion.completedCount < task.dailyCountTotal
          ) {
            // Increment completion count
            await tx
              .update(taskCompletions)
              .set({
                completedCount: sql`${taskCompletions.completedCount} + 1`,
              })
              .where(eq(taskCompletions.id, existingCompletion.id));

            return {
              ...task,
              dailyCountFinished: existingCompletion.completedCount + 1,
            };
          }
        } else {
          // Create new completion record
          await tx.insert(taskCompletions).values({
            taskId,
            userId: ctx.userId,
            completedDate: sql`CURRENT_DATE`,
          });
        }

        return task;
      });
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
      const [newTask] = await ctx.db
        .insert(tasks)
        .values({
          name: input.name,
          frequency: input.frequency,
          category: input.category,
          dailyCountTotal: input.dailyCountTotal ?? 1,
          dailyCountFinished: 0,
          xValue: input.xValue ?? null,
          startDate: input.startDate?.toISOString() ?? null,
          weekDays: input.weekDays ?? null,
          monthDays: input.monthDays ?? null,
          userId: ctx.userId,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(), // Add this since it's notNull in schema
        } satisfies NewDbTask)
        .returning();

      return newTask;
    }),
});
