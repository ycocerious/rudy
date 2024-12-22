import { areArraysEqual } from "@/lib/utils/referential-equality-checks";
import { type SortedTasks, sortTasksByFrequency } from "@/lib/utils/sort-tasks";
import { type Task } from "@/types/task";
import { useMemo, useRef } from "react";

function areTasksEqual(prev: Task[], next: Task[]): boolean {
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    if (
      prev[i]?.id !== next[i]?.id ||
      prev[i]?.name !== next[i]?.name ||
      prev[i]?.frequency !== next[i]?.frequency ||
      prev[i]?.dailyCountTotal !== next[i]?.dailyCountTotal ||
      prev[i]?.xValue !== next[i]?.xValue ||
      prev[i]?.startDate !== next[i]?.startDate ||
      (prev[i]?.monthDays &&
        next[i]?.monthDays &&
        !areArraysEqual(prev[i]?.monthDays, next[i]?.monthDays)) ||
      (prev[i]?.weekDays &&
        next[i]?.weekDays &&
        !areArraysEqual(prev[i]?.weekDays, next[i]?.weekDays))
    ) {
      return false;
    }
  }
  return true;
}

export function useSortedByFrequencyTasks(tasks: Task[]): SortedTasks {
  const tasksRef = useRef<Task[]>([]);
  const sortedTasksRef = useRef<SortedTasks>({
    monthly: [],
    weekly: [],
    xdays: [],
    daily: [],
  });

  return useMemo(() => {
    if (!tasks) {
      return { monthly: [], weekly: [], xdays: [], daily: [] };
    }
    if (!areTasksEqual(tasks, tasksRef.current)) {
      tasksRef.current = tasks;
      sortedTasksRef.current = sortTasksByFrequency(tasks);
    }
    return sortedTasksRef.current;
  }, [tasks]);
}
