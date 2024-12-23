"use client";

import { Card, CardContent } from "@/components/ui/card";
import Confetti from "@/components/ui/confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { theOnlyToastId } from "@/constants/uiConstants";
import { useSortedByFrequencyTasks } from "@/hooks/useSortedTasks";
import { cn } from "@/lib/utils";
import { getGridPosition } from "@/lib/utils/get-grid-position";
import { api } from "@/trpc/react";
import { type taskFrequencyType } from "@/types/form-types";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SwipeableTodaysTask } from "./swipeable-todays-task";

export const frequencyMapping = {
  monthly: "Monthly Tasks",
  weekly: "Weekly Tasks",
  xdays: "X-day Tasks",
  daily: "Daily Tasks",
} satisfies Record<taskFrequencyType, string>;

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
  const sortedTasks = useSortedByFrequencyTasks(tasks ?? []);

  const [returnToPosition, setReturnToPosition] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const dialogOpenChange = useCallback(() => {
    setIsDialogOpen(!isDialogOpen);
    setSelectedFrequency("");
  }, [isDialogOpen]);

  useEffect(() => {
    if (
      sortedTasks[selectedFrequency as keyof typeof sortedTasks] &&
      sortedTasks[selectedFrequency as keyof typeof sortedTasks].length === 0
    ) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      dialogOpenChange();
    }
  }, [dialogOpenChange, selectedFrequency, sortedTasks]);

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

  const handleCardClick = (frequency: string) => {
    setSelectedFrequency(frequency);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="z-10 h-full w-full">
        <div className="grid h-full grid-cols-2 grid-rows-2 gap-6 overflow-auto px-2 pb-4">
          {Object.entries(sortedTasks)
            .filter(([_, tasks]) => tasks.length > 0)
            .map(([frequency, tasks], index) => (
              <Card
                key={frequency}
                className={cn(
                  "flex max-h-[27vh] cursor-pointer items-center justify-center border-primary",
                  getGridPosition(index),
                )}
                onClick={() => handleCardClick(frequency)}
              >
                <CardContent className="p-6 text-center">
                  <p className="text-lg text-primary">
                    {
                      frequencyMapping[
                        frequency as keyof typeof frequencyMapping
                      ]
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({tasks.length} task{tasks.length > 1 ? "s" : ""} left)
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={dialogOpenChange}>
        <DialogContent className="flex h-auto max-h-[75vh] min-h-[25vh] w-[90vw] max-w-none flex-col items-center justify-center overflow-y-auto rounded-md border-border bg-card px-0 pb-10 pt-14 sm:max-w-sm">
          <DialogTitle className="sr-only">
            {
              frequencyMapping[
                selectedFrequency as keyof typeof frequencyMapping
              ]
            }{" "}
            Tasks
          </DialogTitle>

          <DialogDescription className="sr-only">
            List of tasks for{" "}
            {
              frequencyMapping[
                selectedFrequency as keyof typeof frequencyMapping
              ]
            }
          </DialogDescription>

          <p className="text-md mb-1 px-2 pb-2 text-center">
            Swipe to complete a task!
          </p>

          <div className="w-full px-6">
            {sortedTasks[selectedFrequency as keyof typeof sortedTasks]?.map(
              (task) => (
                <SwipeableTodaysTask
                  key={task.id}
                  task={task}
                  returnToPosition={returnToPosition}
                  handleSwipe={() => completeTask(task.id)}
                  handleReturnToPosition={() => setReturnToPosition(false)}
                />
              ),
            )}
          </div>
        </DialogContent>
      </Dialog>

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <Confetti className="absolute left-0 top-0 size-full" />
        </div>
      )}
    </>
  );
};
