// @/server/api/routers/task.ts
import { getTasksForDate } from "@/lib/utils/get-tasks-for-date";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { taskCompletions, tasks } from "@/server/db/schema";
import { type Task } from "@/types/task";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  getTodaysTasks: publicProcedure.query(async ({ ctx }) => {
    // Use userId from context instead of input
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
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));

    const todaysTasks = getTasksForDate(usableUserTasks as Task[]);

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

    // Create completion lookup map
    const completionsMap = new Map(
      todaysCompletions.map((c) => [c.taskId, c.completedCount ?? 0]),
    );

    return todaysTasks.filter((task) => {
      const completedCount = completionsMap.get(task.id) ?? 0;

      return task.category === "daily"
        ? completedCount < (task.dailyCountTotal ?? 1)
        : completedCount === 0;
    });
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
            task.category === "daily" &&
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

          // TODO: Handle current streak logic
          await tx
            .update(tasks)
            .set({
              currentStreak: sql`${tasks.currentStreak} + 1`,
              highestStreak: sql`GREATEST(${tasks.highestStreak}, ${tasks.currentStreak} + 1)`,
              updatedAt: new Date(),
            })
            .where(eq(tasks.id, taskId));

          return {
            ...task,
            dailyCountFinished: 1,
          };
        }

        return task;
      });
    }),
});
