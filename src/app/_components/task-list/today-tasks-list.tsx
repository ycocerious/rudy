"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { exampleTasks } from "@/constants/mockData";
import { theOnlyToastId } from "@/constants/uiConstants";
import { type Task } from "@/types/task";
import { useState } from "react";
import toast from "react-hot-toast";
import { SwipeableTodaysTask } from "./swipeable-todays-task";
import { useSortedTasks } from "@/hooks/useSortedTasks";

export const TodayTasksList = () => {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const sortedTasks = useSortedTasks(tasks);

  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const handleSwipe = (id: string) => {
    const taskToComplete = sortedTasks.find((task) => task.id === id);
    if (taskToComplete) setTaskToComplete(taskToComplete);
  };

  const handleCancelSwipe = () => {
    setIsCancelled(false);
  };

  const confirmCompleteTask = () => {
    if (taskToComplete) {
      setTasks(sortedTasks.filter((task) => task.id !== taskToComplete.id));
      setTaskToComplete(null);
      setIsCancelled(false);
      toast("Hooray! Well done!", {
        id: theOnlyToastId,
        icon: "🎉👏",
      });
    }
  };

  const cancelCompleteTask = () => {
    setTaskToComplete(null);
    setIsCancelled(true);
  };

  if (sortedTasks.length === 0) {
    return null;
  }

  return (
    <>
      <p className="mb-1 px-2 text-center text-xs">
        <span className="text-[#A1A1AA]">Swipe to complete a task, </span>
        <span className="text-[#5ce1e6]">
          {`Only ${sortedTasks.length} tasks left!`}
        </span>
      </p>

      <Card className="mx-auto w-full min-w-[240px] max-w-lg border-none bg-gray-950 text-white">
        <CardContent className="p-2 pb-[1px]">
          {sortedTasks.map((task) => (
            <SwipeableTodaysTask
              key={task.id}
              task={task}
              isCancelled={isCancelled}
              onSwipe={() => handleSwipe(task.id)}
              onCancelSwipe={handleCancelSwipe}
            />
          ))}
        </CardContent>
      </Card>
      <AlertDialog
        open={taskToComplete !== null}
        onOpenChange={() => setTaskToComplete(null)}
      >
        <AlertDialogContent className="max-w-[calc(100%-3rem)] rounded-xl border-none bg-white sm:max-w-[24rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>{`Finished ${taskToComplete?.name}?`}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelCompleteTask}>
              No I swiped by mistake
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCompleteTask}
              className="bg-[#00a3a3]"
            >
              Yessir!!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
