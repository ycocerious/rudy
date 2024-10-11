import { type Task } from "@/types/task";
import { type taskCategoryType } from "@/types/form-types";

export const categoryOrder: Record<taskCategoryType, number> = {
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
