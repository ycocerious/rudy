import { getTasksForDate } from "@/lib/utils/get-tasks-for-date";
import { dailyCompletions, taskCompletions, tasks } from "@/server/db/schema";
import { type weekDaysType } from "@/types/form-types";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const consistencyRouter = createTRPCRouter({
  getCompletionData: publicProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      console.log("🔥 Get completion data was called");
      const { startDate, endDate } = input;

      const dailyStats = await ctx.db
        .select({
          completionDate: dailyCompletions.completionDate,
          completionPercentage: dailyCompletions.completionPercentage,
        })
        .from(dailyCompletions)
        .where(
          and(
            eq(dailyCompletions.userId, ctx.userId),
            sql`${dailyCompletions.completionDate} >= ${startDate.toDateString()}::date`,
            sql`${dailyCompletions.completionDate} <= ${endDate.toDateString()}::date`,
          ),
        );

      return dailyStats;
    }),

  calculateTodayCompletion: publicProcedure.mutation(async ({ ctx }) => {
    console.log("🔥 Calculate today completion was called");
    return await ctx.db.transaction(async (tx) => {
      // Get all tasks
      const allTasks = await tx.query.tasks.findMany({
        where: and(eq(tasks.userId, ctx.userId), eq(tasks.isArchived, false)),
      });

      // Convert tasks to the format expected by getTasksForDate
      const usableTasks = allTasks.map((task) => ({
        ...task,
        weekDays: task.weekDays ? (task.weekDays as weekDaysType[]) : null,
        startDate: task.startDate ? new Date(task.startDate) : null,
      }));

      // Filter for today's tasks
      const todaysTasks = getTasksForDate(usableTasks);

      // Get all completions for today
      const todaysCompletions = await tx
        .select()
        .from(taskCompletions)
        .where(
          and(
            eq(taskCompletions.userId, ctx.userId),
            sql`DATE(${taskCompletions.completedDate}) = CURRENT_DATE`,
          ),
        );

      // Create a map of task completions
      const completionsMap = new Map(
        todaysCompletions.map((c) => [c.taskId, c.completedCount ?? 0]),
      );

      // Calculate total completed tasks
      let completedTasksCount = 0;
      let totalTasksCount = 0;

      todaysTasks.forEach((task) => {
        const completedCount = completionsMap.get(task.id) ?? 0;

        if (task.frequency === "daily") {
          totalTasksCount += task.dailyCountTotal;
          completedTasksCount += Math.min(completedCount, task.dailyCountTotal);
        } else {
          totalTasksCount += 1;
          completedTasksCount += completedCount > 0 ? 1 : 0;
        }
      });

      const completionPercentage =
        totalTasksCount === 0
          ? 0
          : Math.round((completedTasksCount / totalTasksCount) * 100);

      // Update or insert the daily completion record
      await tx
        .insert(dailyCompletions)
        .values({
          userId: ctx.userId,
          completionDate: sql`CURRENT_DATE`,
          completionPercentage,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [dailyCompletions.userId, dailyCompletions.completionDate],
          set: {
            completionPercentage,
            updatedAt: new Date(),
          },
        });

      return completionPercentage;
    });
  }),
});
