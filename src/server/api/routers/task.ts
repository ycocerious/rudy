// @/server/api/routers/task.ts
import { getTasksForDate } from "@/lib/utils/get-tasks-for-date";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tasks } from "@/server/db/schema";
import { type Task } from "@/types/task";
import { and, desc, eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  getTodaysTasks: publicProcedure.query(async ({ ctx }) => {
    // Use userId from context instead of input
    const whereConditions = [eq(tasks.userId, ctx.userId)];

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

    return todaysTasks;
  }),
});
