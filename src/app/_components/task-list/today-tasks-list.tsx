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
import { sortTasks } from "@/lib/utils/sort-tasks";
import { type Task } from "@/types/task";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { SwipeableTodaysTask } from "./swipeable-todays-task";

export const TodayTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sortTasks(exampleTasks));
  const [taskToComplete, setTaskToComplete] = useState<Task | null>(null);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const handleSwipe = (id: string) => {
    const taskToComplete = tasks.find((task) => task.id === id);
    if (taskToComplete) setTaskToComplete(taskToComplete);
  };

  const handleCancelSwipe = () => {
    setIsCancelled(false);
  };

  const confirmCompleteTask = () => {
    if (taskToComplete) {
      setTasks(tasks.filter((task) => task.id !== taskToComplete.id));
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

  if (tasks.length === 0) {
    return null;
  }

  return (
    <>
      <p className="mb-1 px-2 text-center text-xs">
        <span className="text-[#A1A1AA]">Swipe to complete a task, </span>
        <span className="text-[#00a3a3]">
          {`Only ${tasks.length} tasks left!`}
        </span>
      </p>

      <Card className="mx-auto w-full min-w-[240px] max-w-lg border-none bg-gray-950 text-white">
        <CardContent className="p-2 pb-[1px]">
          {tasks.map((task) => (
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
