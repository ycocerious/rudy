"use client";

import { Card, CardContent } from "@/components/ui/card";
import Confetti from "@/components/ui/confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { exampleTasks } from "@/constants/mockData";
import { theOnlyToastId } from "@/constants/uiConstants";
import { useSortedByCategoryTasks } from "@/hooks/useSortedTasks";
import { cn } from "@/lib/utils";
import { getGridPosition } from "@/lib/utils/get-grid-position";
import {
  type taskCategoryType,
  type dailyCountFinishedType,
} from "@/types/form-types";
import { type Task } from "@/types/task";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SwipeableTodaysTask } from "./swipeable-todays-task";

export const categoryMapping = {
  monthly: "Monthly Tasks",
  weekly: "Weekly Tasks",
  xdays: "X-day Tasks",
  daily: "Daily Tasks",
} satisfies Record<taskCategoryType, string>;

export const TodayTasksList = () => {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const sortedTasks = useSortedByCategoryTasks(tasks);

  const [returnToPosition, setReturnToPosition] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const dialogOpenChange = useCallback(() => {
    setIsDialogOpen(!isDialogOpen);
    setSelectedCategory("");
  }, [isDialogOpen]);

  useEffect(() => {
    if (
      sortedTasks[selectedCategory as keyof typeof sortedTasks] &&
      sortedTasks[selectedCategory as keyof typeof sortedTasks].length === 0
    ) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      dialogOpenChange();
    }
  }, [dialogOpenChange, selectedCategory, sortedTasks]);

  const completeTask = (id: string) => {
    const taskToComplete = tasks.find((task) => task.id === id);
    if (!taskToComplete) return;

    setTasks((prevTasks) => {
      const isDaily = taskToComplete.category === "daily";
      const canIncrementDaily =
        isDaily &&
        taskToComplete.dailyCountFinished !== undefined &&
        taskToComplete.dailyCountFinished !== null &&
        taskToComplete.dailyCountTotal !== undefined &&
        taskToComplete.dailyCountTotal !== null &&
        taskToComplete.dailyCountFinished < taskToComplete.dailyCountTotal;

      if (canIncrementDaily) {
        const newDailyCountFinished =
          (taskToComplete.dailyCountFinished as number) + 1;
        const shouldRemove =
          newDailyCountFinished === taskToComplete.dailyCountTotal;

        if (shouldRemove) {
          setReturnToPosition(false);
          return prevTasks.filter((task) => task.id !== taskToComplete.id);
        } else {
          setReturnToPosition(true);
          return prevTasks.map((task) =>
            task.id === taskToComplete.id
              ? {
                  ...task,
                  dailyCountFinished:
                    newDailyCountFinished as dailyCountFinishedType,
                }
              : task,
          );
        }
      } else {
        setReturnToPosition(false);
        return prevTasks.filter((task) => task.id !== taskToComplete.id);
      }
    });

    toast("Hooray! Well done!", {
      id: theOnlyToastId,
      icon: "🎉👏",
    });
  };

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="z-10 h-full w-full">
        {tasks.length !== 0 ? (
          <div className="grid h-full grid-cols-2 grid-rows-2 gap-6 overflow-auto px-2 pb-4">
            {Object.entries(sortedTasks)
              .filter(([_, tasks]) => tasks.length > 0)
              .map(([category, tasks], index) => (
                <Card
                  key={category}
                  className={cn(
                    "flex max-h-[27vh] cursor-pointer items-center justify-center border-primary",
                    getGridPosition(index),
                  )}
                  onClick={() => handleCardClick(category)}
                >
                  <CardContent className="p-6 text-center">
                    <p className="text-lg text-primary">
                      {
                        categoryMapping[
                          category as keyof typeof categoryMapping
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
        ) : (
          <div className="flex flex-grow items-center justify-center text-center text-foreground">
            No more tasks left for today! 🙆‍♀️
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={dialogOpenChange}>
        <DialogContent className="flex h-auto max-h-[75vh] min-h-[25vh] w-[90vw] max-w-none flex-col items-center justify-center overflow-y-auto rounded-md border-border bg-card px-0 pb-10 pt-14 text-accent-foreground sm:max-w-sm">
          <DialogTitle className="sr-only">
            {categoryMapping[selectedCategory as keyof typeof categoryMapping]}{" "}
            Tasks
          </DialogTitle>

          <DialogDescription className="sr-only">
            List of tasks for{" "}
            {categoryMapping[selectedCategory as keyof typeof categoryMapping]}
          </DialogDescription>

          <p className="text-md mb-1 px-2 pb-2 text-center">
            <span className="text-foreground">Swipe to complete a task, </span>
            <span className="text-primary">
              {`Only ${sortedTasks[selectedCategory as keyof typeof sortedTasks]?.length || 0} task${sortedTasks[selectedCategory as keyof typeof sortedTasks]?.length > 1 ? "s" : ""} left!`}
            </span>
          </p>

          <div className="w-full px-6">
            {sortedTasks[selectedCategory as keyof typeof sortedTasks]?.map(
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
