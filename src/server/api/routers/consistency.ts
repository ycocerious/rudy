import { getTasksForDate } from "@/lib/utils/get-tasks-for-date";
import { dailyCompletions, taskCompletions, tasks } from "@/server/db/schema";
import { type weekDaysType } from "@/types/form-types";
import { and, eq, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const consistencyRouter = createTRPCRouter({
  getCompletionData: publicProcedure.query(async ({ ctx }) => {
    // Get today in Indian timezone
    const today = sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`;

    // Get start date (Sunday of current week - 53 weeks)
    const startDate = sql`(
        ${today} - 
        CAST(EXTRACT(DOW FROM ${today}) AS INTEGER) - 
        (53 * 7)
      )::date`;
    const dailyStats = await ctx.db
      .select({
        completionDate: dailyCompletions.completionDate,
        completionPercentage: dailyCompletions.completionPercentage,
      })
      .from(dailyCompletions)
      .where(
        and(
          eq(dailyCompletions.userId, ctx.userId),
          sql`${dailyCompletions.completionDate} >= ${startDate}`,
          sql`${dailyCompletions.completionDate} <= ${today}`,
        ),
      );

    return dailyStats;
  }),

  updateTodayCompletion: publicProcedure.mutation(async ({ ctx }) => {
    console.log("🔥 Calculate today completion was called");

    // Get all tasks
    const allTasks = await ctx.db.query.tasks.findMany({
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
    const todaysCompletions = await ctx.db
      .select()
      .from(taskCompletions)
      .where(
        and(
          eq(taskCompletions.userId, ctx.userId),
          sql`DATE(${taskCompletions.completedDate}) = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
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
    await ctx.db
      .insert(dailyCompletions)
      .values({
        userId: ctx.userId,
        completionDate: sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
        completionPercentage,
      })
      .onConflictDoUpdate({
        target: [dailyCompletions.userId, dailyCompletions.completionDate],
        set: {
          completionPercentage,
        },
      });

    return completionPercentage;
  }),
});
