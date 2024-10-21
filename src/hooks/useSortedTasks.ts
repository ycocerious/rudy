import { useMemo, useRef } from "react";
import { type Task } from "@/types/task";
import { sortTasks } from "@/lib/utils/sort-tasks";
import { areArraysEqual } from "@/lib/utils/are-arrays-equal";

function areTasksEqual(prev: Task[], next: Task[]): boolean {
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    if (
      prev[i]?.id !== next[i]?.id ||
      prev[i]?.name !== next[i]?.name ||
      prev[i]?.category !== next[i]?.category ||
      prev[i]?.dailyCountTotal !== next[i]?.dailyCountTotal ||
      prev[i]?.dailyCountFinished !== next[i]?.dailyCountFinished ||
      prev[i]?.xValue !== next[i]?.xValue ||
      prev[i]?.startDate !== next[i]?.startDate ||
      prev[i]?.repeatFrequency !== next[i]?.repeatFrequency ||
      (prev[i]?.repeatDays &&
        next[i]?.repeatDays &&
        !areArraysEqual(prev[i]?.repeatDays, next[i]?.repeatDays))
    ) {
      return false;
    }
  }
  return true;
}

type SortedTasks = {
  monthly: Task[];
  weekly: Task[];
  xday: Task[];
  daily: Task[];
};

function sortTasksByCategory(tasks: Task[]): SortedTasks {
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

export function useSortedTasks(tasks: Task[]) {
  const tasksRef = useRef<Task[]>([]);
  const sortedTasksRef = useRef<Task[]>([]);

  return useMemo(() => {
    if (!areTasksEqual(tasks, tasksRef.current)) {
      tasksRef.current = tasks;
      sortedTasksRef.current = sortTasks(tasks);
    }
    return sortedTasksRef.current;
  }, [tasks]);
}

export function useSortedByCategoryTasks(tasks: Task[]): SortedTasks {
  const tasksRef = useRef<Task[]>([]);
  const sortedTasksRef = useRef<SortedTasks>({
    monthly: [],
    weekly: [],
    xday: [],
    daily: [],
  });

  return useMemo(() => {
    if (!areTasksEqual(tasks, tasksRef.current)) {
      tasksRef.current = tasks;
      sortedTasksRef.current = sortTasksByCategory(tasks);
    }
    return sortedTasksRef.current;
  }, [tasks]);
}
