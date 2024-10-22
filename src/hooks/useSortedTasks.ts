import { areArraysEqual } from "@/lib/utils/referential-equality-checks";
import { type SortedTasks, sortTasksByCategory } from "@/lib/utils/sort-tasks";
import { type Task } from "@/types/task";
import { useMemo, useRef } from "react";

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

export function useSortedByCategoryTasks(tasks: Task[]): SortedTasks {
  const tasksRef = useRef<Task[]>([]);
  const sortedTasksRef = useRef<SortedTasks>({
    monthly: [],
    weekly: [],
    xdays: [],
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
