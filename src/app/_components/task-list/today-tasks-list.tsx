"use client";

import { theOnlyToastId } from "@/constants/uiConstants";
import { api } from "@/trpc/react";
import { type taskFrequencyType } from "@/types/form-types";
import { useState } from "react";
import toast from "react-hot-toast";
import { SwipeableTodaysTask } from "./swipeable-todays-task";

export const frequencyMapping = {
  monthly: "Monthly Tasks",
  weekly: "Weekly Tasks",
  xdays: "X-day Tasks",
  daily: "Daily Tasks",
} satisfies Record<taskFrequencyType, string>;

const CATEGORY_PRIORITY = {
  exercise: 0,
  nutrition: 1,
  sleep: 2,
} as const;

export const TodayTasksList = () => {
  //trpc related
  const { data: tasks, isLoading } = api.task.getTodaysTasks.useQuery();

  const utils = api.useUtils();
  const { mutateAsync: finishDbTask } = api.task.finishTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTodaysTasks.invalidate();
    },
  });

  //hooks

  const [returnToPosition, setReturnToPosition] = useState<boolean>(false);

  //possible states handling
  if (isLoading) return <div>Loading...</div>;
  if (!tasks || tasks.length === 0) return <div>No tasks left for today!</div>;

  //callback functions
  const completeTask = async (id: number) => {
    const taskToComplete = tasks.find((task) => task.id === id);
    if (!taskToComplete) return;

    const shouldIncrement =
      taskToComplete.frequency === "daily" &&
      taskToComplete.dailyCountFinished < taskToComplete.dailyCountTotal;

    if (shouldIncrement) {
      const newDailyCountFinished = taskToComplete.dailyCountFinished + 1;
      const shouldRemove =
        newDailyCountFinished === taskToComplete.dailyCountTotal;

      if (shouldRemove) {
        setReturnToPosition(false);
      } else {
        setReturnToPosition(true);
      }
    } else {
      setReturnToPosition(false);
    }

    await finishDbTask(taskToComplete.id);

    toast("Hooray! Well done!", {
      id: theOnlyToastId,
      icon: "🎉👏",
    });
  };

  const sortedTasks = tasks.sort((a, b) => {
    const priorityA = CATEGORY_PRIORITY[a.category] ?? Number.MAX_SAFE_INTEGER;
    const priorityB = CATEGORY_PRIORITY[b.category] ?? Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="space-y-2">
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
    </div>
  );
};
