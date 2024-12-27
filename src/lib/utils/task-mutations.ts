import { type api } from "@/trpc/react";
type Utils = ReturnType<typeof api.useUtils>;

export async function handleTaskStateChange(utils: Utils) {
  // Batch invalidations
  await Promise.all([
    utils.task.getTodaysTasks.invalidate(),
    utils.task.getAllTasks.invalidate(),
    utils.consistency.getCompletionData.invalidate(),
  ]);
}
