"use client";

import { theOnlyToastId } from "@/constants/uiConstants";
import { handleTaskStateChange } from "@/lib/utils/task-mutations";
import { api } from "@/trpc/react";
import { type Task } from "@/types/task";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";
import { AddTaskButton } from "./add-task-button";
import { SwipeableTodaysTask } from "./swipeable-todays-task";
const CATEGORY_PRIORITY = {
  exercise: 0,
  nutrition: 1,
  sleep: 2,
} as const;

export const TodayTasksList = () => {
  //hooks
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [returnToPosition, setReturnToPosition] = useState<boolean>(false);

  //trpc related
  const { data: tasks, isLoading } = api.task.getTodaysTasks.useQuery(
    undefined,
    {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (tasks) setLocalTasks(tasks);
  }, [tasks]);

  const utils = api.useUtils();

  const { mutateAsync: calculateCompletion } =
    api.consistency.calculateTodayCompletion.useMutation();

  const { mutateAsync: finishDbTask } = api.task.finishTask.useMutation({
    onSuccess: async () => {
      await calculateCompletion();
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await handleTaskStateChange(utils);
    },
    onError: (_, taskId) => {
      toast.error("Failed to complete task. Please try again.", {
        id: theOnlyToastId,
      });
      // Restore the specific task from server state
      if (tasks) {
        const originalTask = tasks.find((t) => t.id === taskId);
        if (originalTask) {
          setLocalTasks((prev) => {
            const existing = prev.find((t) => t.id === taskId);
            if (!existing) {
              return [...prev, originalTask];
            }
            return prev.map((t) => (t.id === taskId ? originalTask : t));
          });
        }
      }
    },
  });

  //possible states handling
  if (isLoading)
    return (
      <>
        <div className="mt-2 text-center">Loading...</div>
        <AddTaskButton setIsSheetOpen={setIsSheetOpen} />
      </>
    );

  if (!tasks || tasks.length === 0)
    return (
      <>
        <div className="mx-auto mt-2 h-full w-full max-w-2xl">
          <div className="flex flex-grow items-center justify-center text-center">
            No tasks left for today!
          </div>
        </div>

        <AddTaskButton setIsSheetOpen={setIsSheetOpen} />

        <AddOrEditTaskSheet
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          taskType="add"
        />
      </>
    );

  //callback functions
  const completeTask = async (id: number) => {
    const taskToComplete = localTasks.find((task) => task.id === id);
    if (!taskToComplete) return;

    const shouldIncrement =
      taskToComplete.frequency === "daily" &&
      taskToComplete.dailyCountFinished < taskToComplete.dailyCountTotal;

    // Optimistically update local state
    if (shouldIncrement) {
      const newDailyCountFinished = taskToComplete.dailyCountFinished + 1;
      const shouldRemove =
        newDailyCountFinished === taskToComplete.dailyCountTotal;

      if (shouldRemove) {
        setLocalTasks((prev) => prev.filter((task) => task.id !== id));
        setReturnToPosition(false);
      } else {
        setLocalTasks((prev) =>
          prev.map((task) =>
            task.id === id
              ? { ...task, dailyCountFinished: newDailyCountFinished }
              : task,
          ),
        );
        setReturnToPosition(true);
      }
    } else {
      setLocalTasks((prev) => prev.filter((task) => task.id !== id));
      setReturnToPosition(false);
    }
    // Update database in background
    toast("Hooray! Well done!", {
      id: theOnlyToastId,
      icon: "🎉👏",
    });
    await finishDbTask(taskToComplete.id);
  };

  const sortedTasks = localTasks.sort((a, b) => {
    const priorityA = CATEGORY_PRIORITY[a.category] ?? Number.MAX_SAFE_INTEGER;
    const priorityB = CATEGORY_PRIORITY[b.category] ?? Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });

  return (
    <>
      <div className="mx-auto mt-2 w-full max-w-2xl">
        {sortedTasks.map((task) => (
          <SwipeableTodaysTask
            key={task.id}
            task={task}
            returnToPosition={returnToPosition}
            handleSwipe={() => completeTask(task.id)}
            handleReturnToPosition={() => setReturnToPosition(false)}
          />
        ))}
      </div>

      <AddTaskButton setIsSheetOpen={setIsSheetOpen} />

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        taskType="add"
      />
    </>
  );
};
