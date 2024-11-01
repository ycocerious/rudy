// @/server/api/routers/task.ts
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { tasks } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Use userId from context instead of input
    const whereConditions = [eq(tasks.userId, ctx.userId)];

    const userTasks = await ctx.db.query.tasks.findMany({
      where: and(...whereConditions),
      orderBy: [desc(tasks.createdAt)],
    });

    return userTasks.map((task) => ({
      ...task,
      startDate: task.startDate ? new Date(task.startDate) : null,
    }));
  }),
});
