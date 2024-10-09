import { type Task } from "@/types/task";
import { type taskCateogry } from "@/types/task-category";

export const categoryOrder: Record<taskCateogry, number> = {
  monthly: 0,
  weekly: 1,
  xdays: 2,
  daily: 3,
};

export const sortTasks = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    const orderA = categoryOrder[a.category];
    const orderB = categoryOrder[b.category];
    return orderA - orderB;
  });
};
