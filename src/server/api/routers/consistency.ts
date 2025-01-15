import { getTasksForToday } from "@/lib/utils/get-tasks-for-date";
import { dailyCompletions, taskCompletions, tasks } from "@/server/db/schema";
import { type weekDaysType } from "@/types/form-types";
import { type Task } from "@/types/task";
import { and, eq, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const consistencyRouter = createTRPCRouter({
  getCompletionData: publicProcedure.query(async ({ ctx }) => {
    // Combine the date calculations into a single SQL expression
    const dailyStats = await ctx.db
      .select({
        completionDate: dailyCompletions.completionDate,
        completionPercentage: dailyCompletions.completionPercentage,
      })
      .from(dailyCompletions)
      .where(
        and(
          eq(dailyCompletions.userId, ctx.userId),
          sql`${dailyCompletions.completionDate} BETWEEN 
              (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date - 
              CAST(EXTRACT(DOW FROM (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date) AS INTEGER) - 
              (53 * 7)
              AND
              (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
        ),
      )
      // Add index hint if you have an index on completionDate
      .orderBy(dailyCompletions.completionDate);

    return dailyStats;
  }),

  updateTodayCompletion: publicProcedure.mutation(async ({ ctx }) => {
    // Get tasks and their completions in a single query
    const tasksWithCompletions = await ctx.db
      .select({
        // Task fields
        id: tasks.id,
        name: tasks.name,
        category: tasks.category, // Added missing category field
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
          sql`DATE(${taskCompletions.completedDate}) = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
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

    // Rest of the function remains the same...
    const todaysTasks = getTasksForToday(usableTasks);

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
        completionDate: sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
        completionPercentage,
      })
      .onConflictDoUpdate({
        target: [dailyCompletions.userId, dailyCompletions.completionDate],
        set: { completionPercentage },
      });

    return completionPercentage;
  }),
});
