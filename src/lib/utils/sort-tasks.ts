import { type taskCategoryType } from "@/types/form-types";
import { type Task } from "@/types/task";

export const sortTasks = (tasks: Task[]): Task[] => {
  const categoryOrder: Record<taskCategoryType, number> = {
    monthly: 0,
    weekly: 1,
    xdays: 2,
    daily: 3,
  };

  return [...tasks].sort((a, b) => {
    const orderA = categoryOrder[a.category];
    const orderB = categoryOrder[b.category];
    return orderA - orderB;
  });
};
