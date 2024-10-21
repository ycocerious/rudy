"use client";

import { Card, CardContent } from "@/components/ui/card";
import Confetti from "@/components/ui/confetti";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { exampleTasks } from "@/constants/mockData";
import { theOnlyToastId } from "@/constants/uiConstants";
import { useSortedByCategoryTasks } from "@/hooks/useSortedTasks";
import { type dailyCountFinishedType } from "@/types/form-types";
import { type Task } from "@/types/task";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SwipeableTodaysTask } from "./swipeable-todays-task";

export const TodayTasksList = () => {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const sortedTasks = useSortedByCategoryTasks(tasks);

  const [returnToPosition, setReturnToPosition] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    console.log(sortedTasks[selectedCategory as keyof typeof sortedTasks]);
    if (
      sortedTasks[selectedCategory as keyof typeof sortedTasks] &&
      sortedTasks[selectedCategory as keyof typeof sortedTasks].length === 0
    ) {
      setIsDialogOpen(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [selectedCategory, sortedTasks]);

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

  const categoryMapping = {
    monthly: "Monthly Tasks",
    weekly: "Weekly Tasks",
    xday: "X-day Tasks",
    daily: "Daily Tasks",
  };

  return (
    <>
      <div className="w-full">
        {tasks.length !== 0 ? (
          <div className="grid h-full grid-cols-2 gap-6 overflow-auto px-2 pb-12 pt-6">
            {Object.entries(sortedTasks).map(([category, tasks]) =>
              tasks.length > 0 ? (
                <Card
                  key={category}
                  className="flex max-h-[25vh] cursor-pointer items-center justify-center border-[#5ce1e6] bg-gray-800 text-white"
                  onClick={() => handleCardClick(category)}
                >
                  <CardContent className="p-6 text-center">
                    <p className="text-lg text-[#5ce1e6]">
                      {
                        categoryMapping[
                          category as keyof typeof categoryMapping
                        ]
                      }
                    </p>
                    <p className="text-xs text-gray-300">
                      ({tasks.length} task{tasks.length > 1 ? "s" : ""} left)
                    </p>
                  </CardContent>
                </Card>
              ) : null,
            )}
          </div>
        ) : (
          <div className="mt-2 flex flex-grow items-center justify-center text-center text-white">
            No more tasks left for today! 🙆‍♀️
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="flex h-auto max-h-[75vh] min-h-[25vh] w-[85vw] max-w-none items-center justify-center overflow-y-auto rounded-md border-[#00A3A3] bg-gray-200 px-0 pb-6 pt-0 text-black">
          <div className="p-2 pb-[1px] pt-10">
            <p className="mb-1 px-2 pb-2 text-center text-sm">
              <span className="text-black">Swipe to complete a task, </span>
              <span className="text-[#00A3A3]">
                {`Only ${sortedTasks[selectedCategory as keyof typeof sortedTasks]?.length || 0} task${sortedTasks[selectedCategory as keyof typeof sortedTasks]?.length > 1 ? "s" : ""} left!`}
              </span>
            </p>
            <div className="px-1">
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
          </div>
        </DialogContent>
      </Dialog>

      {showConfetti && (
        <Confetti className="absolute left-0 top-0 z-0 size-full" />
      )}
    </>
  );
};
