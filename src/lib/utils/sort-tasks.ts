import { type Task } from "@/types/task";

export type SortedTasks = {
  monthly: Task[];
  weekly: Task[];
  xdays: Task[];
  daily: Task[];
};

export function sortTasksByFrequency(tasks: Task[]): SortedTasks {
  return tasks.reduce<SortedTasks>(
    (acc, task) => {
      switch (task.frequency) {
        case "monthly":
          acc.monthly.push(task);
          break;
        case "weekly":
          acc.weekly.push(task);
          break;
        case "xdays":
          acc.xdays.push(task);
          break;
        case "daily":
          acc.daily.push(task);
          break;
        default:
          console.warn(`Unknown task frequency`);
      }
      return acc;
    },
    { monthly: [], weekly: [], xdays: [], daily: [] },
  );
}
