// @/server/api/routers/task.ts
import { getTasksForToday } from "@/lib/utils/get-tasks-for-date";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { type NewDbTask, taskCompletions, tasks } from "@/server/db/schema";
import {
  taskCategoryEnum,
  taskFrequencyEnum,
  type weekDaysType,
} from "@/types/form-types";
import { type Task } from "@/types/task";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  getTodaysTasks: publicProcedure.query(async ({ ctx }) => {
    console.log("🔥 Get todays tasks was called");

    // Combine both queries into a single join operation
    const tasksWithCompletions = await ctx.db
      .select({
        // Task fields
        id: tasks.id,
        name: tasks.name, // Added missing field
        category: tasks.category, // Added missing field
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
          sql`DATE(${taskCompletions.completedDate}) = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
        ),
      )
      .where(and(eq(tasks.userId, ctx.userId), eq(tasks.isArchived, false)))
      .orderBy(desc(tasks.createdAt));

    // Transform the data to match Task type
    const usableTasks: Task[] = tasksWithCompletions.map((task) => ({
      id: task.id,
      name: task.name,
      category: task.category,
      frequency: task.frequency,
      weekDays: task.weekDays ? (task.weekDays as weekDaysType[]) : null,
      monthDays: task.monthDays,
      startDate: task.startDate ? new Date(task.startDate) : null,
      xValue: task.xValue,
      dailyCountTotal: task.dailyCountTotal,
      dailyCountFinished: task.completedCount ?? 0,
    }));

    return getTasksForToday(usableTasks).filter((task) =>
      task.frequency === "daily"
        ? task.dailyCountFinished < (task.dailyCountTotal ?? 1)
        : task.dailyCountFinished === 0,
    );
  }),

  getAllTasks: publicProcedure.query(async ({ ctx }) => {
    console.log("🔥 Get all tasks was called");

    // Select specific fields instead of using findMany
    const userTasks = await ctx.db
      .select({
        id: tasks.id,
        name: tasks.name,
        category: tasks.category,
        frequency: tasks.frequency,
        weekDays: tasks.weekDays,
        monthDays: tasks.monthDays,
        startDate: tasks.startDate,
        xValue: tasks.xValue,
        dailyCountTotal: tasks.dailyCountTotal,
        createdAt: tasks.createdAt,
      })
      .from(tasks)
      .where(and(eq(tasks.userId, ctx.userId), eq(tasks.isArchived, false)))
      .orderBy(desc(tasks.createdAt));

    // Early return if no tasks
    if (!userTasks.length) {
      return [];
    }

    // Transform data in a single pass without spreading
    return userTasks.map((task) => ({
      id: task.id,
      name: task.name,
      category: task.category,
      frequency: task.frequency,
      weekDays: task.weekDays ? (task.weekDays as weekDaysType[]) : null,
      monthDays: task.monthDays,
      startDate: task.startDate ? new Date(task.startDate) : null,
      xValue: task.xValue,
      dailyCountTotal: task.dailyCountTotal,
      createdAt: task.createdAt,
    }));
  }),

  finishTask: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: taskId }) => {
      // Get task and current completion in a single query
      const [taskWithCompletion] = await ctx.db
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
          currentCompletedCount: taskCompletions.completedCount,
        })
        .from(tasks)
        .leftJoin(
          taskCompletions,
          and(
            eq(taskCompletions.taskId, tasks.id),
            eq(taskCompletions.userId, ctx.userId),
            sql`DATE(${taskCompletions.completedDate}) = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
          ),
        )
        .where(
          and(
            eq(tasks.id, taskId),
            eq(tasks.userId, ctx.userId),
            eq(tasks.isArchived, false),
          ),
        )
        .limit(1);

      if (!taskWithCompletion) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      // Calculate new completion count
      const newCompletedCount =
        taskWithCompletion.frequency === "daily"
          ? Math.min(
              (taskWithCompletion.currentCompletedCount ?? 0) + 1,
              taskWithCompletion.dailyCountTotal,
            )
          : 1;

      // Update completion
      const [completion] = await ctx.db
        .insert(taskCompletions)
        .values({
          taskId,
          userId: ctx.userId,
          completedDate: sql`(CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date`,
          completedCount: newCompletedCount,
        })
        .onConflictDoUpdate({
          target: [
            taskCompletions.taskId,
            taskCompletions.userId,
            taskCompletions.completedDate,
          ],
          set: {
            completedCount: newCompletedCount,
          },
        })
        .returning();

      if (!completion) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update completion",
        });
      }

      // Return task with updated completion count
      return {
        ...taskWithCompletion,
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
      // Only perform date adjustment if startDate exists
      const startDateISOString = input.startDate
        ? new Date(
            Date.UTC(
              input.startDate.getFullYear(),
              input.startDate.getMonth(),
              input.startDate.getDate(),
              5, // IST offset hours
              30, // IST offset minutes
              0,
              0,
            ),
          ).toISOString()
        : null;

      console.log("🔥 Start date ISO string:", startDateISOString);

      // Create task values object directly to avoid unnecessary object spreading
      const taskValues = {
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
      } satisfies NewDbTask;

      // Use a specific column list in returning() to minimize data transfer
      const [newTask] = await ctx.db
        .insert(tasks)
        .values(taskValues)
        .returning({
          id: tasks.id,
          name: tasks.name,
          frequency: tasks.frequency,
          category: tasks.category,
          dailyCountTotal: tasks.dailyCountTotal,
          xValue: tasks.xValue,
          startDate: tasks.startDate,
          weekDays: tasks.weekDays,
          monthDays: tasks.monthDays,
        });

      return newTask;
    }),

  deleteTask: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: taskId }) => {
      // Select only needed fields in returning
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
        .returning({
          id: tasks.id,
          name: tasks.name,
          frequency: tasks.frequency,
          category: tasks.category,
          dailyCountTotal: tasks.dailyCountTotal,
          xValue: tasks.xValue,
          startDate: tasks.startDate,
          weekDays: tasks.weekDays,
          monthDays: tasks.monthDays,
          userId: tasks.userId,
          isArchived: tasks.isArchived,
        });

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
      // Prepare the date string once, outside the query
      const startDateISOString = input.startDate
        ? new Date(
            Date.UTC(
              input.startDate.getFullYear(),
              input.startDate.getMonth(),
              input.startDate.getDate(),
              5, // IST offset hours
              30, // IST offset minutes
              0,
              0,
            ),
          ).toISOString()
        : null;
      console.log("🔥 Start date ISO string:", startDateISOString);

      // Prepare update values object once
      const updateValues = {
        name: input.name,
        frequency: input.frequency,
        category: input.category,
        dailyCountTotal: input.dailyCountTotal ?? 1,
        xValue: input.xValue ?? null,
        startDate: startDateISOString,
        weekDays: input.weekDays ?? null,
        monthDays: input.monthDays ?? null,
      };

      // Select only needed fields in returning
      const [updatedTask] = await ctx.db
        .update(tasks)
        .set(updateValues)
        .where(
          and(
            eq(tasks.id, input.taskId),
            eq(tasks.userId, ctx.userId),
            eq(tasks.isArchived, false),
          ),
        )
        .returning({
          id: tasks.id,
          name: tasks.name,
          frequency: tasks.frequency,
          category: tasks.category,
          dailyCountTotal: tasks.dailyCountTotal,
          xValue: tasks.xValue,
          startDate: tasks.startDate,
          weekDays: tasks.weekDays,
          monthDays: tasks.monthDays,
          userId: tasks.userId,
          isArchived: tasks.isArchived,
        });

      if (!updatedTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found or unauthorized",
        });
      }

      return updatedTask;
    }),
});
