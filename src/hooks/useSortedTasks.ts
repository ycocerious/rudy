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
