import { useMemo, useRef } from "react";
import { type Task } from "@/types/task";
import { sortTasks } from "@/lib/utils/sort-tasks";

function areTasksEqual(prev: Task[], next: Task[]): boolean {
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    if (
      prev[i]?.id !== next[i]?.id ||
      prev[i]?.name !== next[i]?.name ||
      prev[i]?.category !== next[i]?.category
    ) {
      return false;
    }
  }
  return true;
}

export function useSortedTasks(tasks: Task[]) {
  const tasksRef = useRef(tasks); //persists across rerenders

  return useMemo(() => {
    if (!areTasksEqual(tasks, tasksRef.current)) {
      tasksRef.current = tasks;
      return sortTasks(tasks);
    }
    return tasksRef.current;
  }, [tasks]);
}
