import { getTasksForToday } from "@/lib/utils/get-tasks-for-date";
import { dailyCompletions, taskCompletions, tasks } from "@/server/db/schema";
import { type weekDaysType } from "@/types/form-types";
import { type Task } from "@/types/task";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const consistencyRouter = createTRPCRouter({
  getCompletionData: publicProcedure
    .input(
      z.object({
        startDateString: z.string(),
        endDateString: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const dailyStats = await ctx.db
        .select({
          completionDate: dailyCompletions.completionDate,
          completionPercentage: dailyCompletions.completionPercentage,
        })
        .from(dailyCompletions)
        .where(
          and(
            eq(dailyCompletions.userId, ctx.userId),
            sql`${dailyCompletions.completionDate} BETWEEN ${input.startDateString}::date AND ${input.endDateString}::date`,
          ),
        )
        .orderBy(dailyCompletions.completionDate);

      return dailyStats;
    }),

  updateTodayCompletion: publicProcedure
    .input(z.object({ clientDateString: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get tasks and their completions in a single query
      const tasksWithCompletions = await ctx.db
        .select({
          // Task fields
          id: tasks.id,
          name: tasks.name,
          category: tasks.category,
          frequency: tasks.frequency,
          weekDays: tasks.weekDays,
          monthDays: tasks.monthDays,
          startDate: tasks.startDate,
          xValue: tasks.xValue,
          dailyCountTotal: tasks.dailyCountTotal,
          // Completion fields
          completedCount: taskCompletions.completedCount,
        })
        .from(tasks)
        .leftJoin(
          taskCompletions,
          and(
            eq(tasks.id, taskCompletions.taskId),
            eq(taskCompletions.userId, ctx.userId),
            sql`{taskCompletions.completedDate} = ${input.clientDateString}::date`,
          ),
        )
        .where(and(eq(tasks.userId, ctx.userId), eq(tasks.isArchived, false)));

      // Transform to Task type and prepare for getTasksForToday
      const usableTasks: Task[] = tasksWithCompletions.map((task) => ({
        id: task.id,
        name: task.name,
        category: task.category,
        frequency: task.frequency,
        weekDays: task.weekDays ? (task.weekDays as weekDaysType[]) : null,
        monthDays: task.monthDays,
        startDate: task.startDate ? new Date(task.startDate) : null,
        xValue: task.xValue,
        dailyCountTotal: task.dailyCountTotal ?? 1,
        dailyCountFinished: task.completedCount ?? 0,
      }));

      const todaysTasks = getTasksForToday(usableTasks, input.clientDateString);

      const { completedTasksCount, totalTasksCount } = todaysTasks.reduce(
        (acc, task) => {
          if (task.frequency === "daily") {
            acc.totalTasksCount += task.dailyCountTotal ?? 1;
            acc.completedTasksCount += Math.min(
              task.dailyCountFinished,
              task.dailyCountTotal ?? 1,
            );
          } else {
            acc.totalTasksCount += 1;
            acc.completedTasksCount += task.dailyCountFinished > 0 ? 1 : 0;
          }
          return acc;
        },
        { completedTasksCount: 0, totalTasksCount: 0 },
      );

      const completionPercentage =
        totalTasksCount === 0
          ? 0
          : Math.round((completedTasksCount / totalTasksCount) * 100);

      await ctx.db
        .insert(dailyCompletions)
        .values({
          userId: ctx.userId,
          completionDate: input.clientDateString,
          completionPercentage,
        })
        .onConflictDoUpdate({
          target: [dailyCompletions.userId, dailyCompletions.completionDate],
          set: { completionPercentage },
        });

      return completionPercentage;
    }),
});
