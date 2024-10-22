import { type taskCategoryType } from "@/types/form-types";
import { type Task } from "@/types/task";

export type SortedTasks = {
  monthly: Task[];
  weekly: Task[];
  xday: Task[];
  daily: Task[];
};

export function sortTasksByCategory(tasks: Task[]): SortedTasks {
  return tasks.reduce<SortedTasks>(
    (acc, task) => {
      switch (task.category) {
        case "monthly":
          acc.monthly.push(task);
          break;
        case "weekly":
          acc.weekly.push(task);
          break;
        case "xdays":
          acc.xday.push(task);
          break;
        case "daily":
          acc.daily.push(task);
          break;
        default:
          console.warn(`Unknown task category`);
      }
      return acc;
    },
    { monthly: [], weekly: [], xday: [], daily: [] },
  );
}
