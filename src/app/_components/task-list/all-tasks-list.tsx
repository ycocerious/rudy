"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exampleTasks } from "@/constants/mockData";
import { theOnlyToastId } from "@/constants/uiConstants";
import { sortTasks } from "@/lib/utils/sort-tasks";
import { type Task } from "@/types/task";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";
import { SwipeableAllTask } from "./swipeable-all-task";

export const AllTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sortTasks(exampleTasks));
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const handleSwipe = (id: string) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete) setTaskToDelete(taskToDelete.id);
  };

  const handleCancelSwipe = () => {
    setIsCancelled(false);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete);
      setTasks(updatedTasks);
      setTaskToDelete(null);
      setIsCancelled(false);
      toast.success("Task deleted successfully!", { id: theOnlyToastId });
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
    setIsCancelled(true);
  };

  return (
    <>
      {tasks.length !== 0 ? (
        <>
          <p className="mb-1 px-2 text-center text-xs text-[#A1A1AA]">
            Tap to edit a task, Swipe to delete
          </p>
          <Card className="mx-auto w-full min-w-[240px] max-w-lg border-none bg-gray-950 text-white">
            <CardContent className="p-2 pb-[1px]">
              {tasks.map((task) => (
                <SwipeableAllTask
                  key={task.id}
                  setTasks={setTasks}
                  task={task}
                  isCancelled={isCancelled}
                  onSwipe={() => handleSwipe(task.id)}
                  onCancelSwipe={handleCancelSwipe}
                />
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="mb-1 px-2 text-center text-xs text-[#A1A1AA]">
          Click the + icon to add your first task!
        </p>
      )}

      <Button
        className="fixed bottom-4 left-1/2 z-50 h-14 w-14 -translate-x-1/2 rounded-full bg-[#00A3A3]"
        onClick={() => setIsSheetOpen(true)}
      >
        <Plus size={24} className="text-white" />
      </Button>

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        setTasks={setTasks}
        taskType="add"
      />

      <AlertDialog
        open={taskToDelete !== null}
        onOpenChange={() => setTaskToDelete(null)}
      >
        <AlertDialogContent className="max-w-[calc(100%-3rem)] rounded-xl border-none bg-white sm:max-w-[24rem]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteTask}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTask}
              className="bg-[#c72626]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
