"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exampleTasks } from "@/constants/mockData";
import { type Task } from "@/types/task";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";
import { SwipeableAllTask } from "./swipeable-all-task";
import { sortTasks } from "@/lib/utils/sort-tasks";
import { theOnlyToastId } from "@/constants/uiConstants";
import toast from "react-hot-toast";
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

export const AllTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sortTasks(exampleTasks));
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const initiateDeleteTask = (id: string) => {
    setTaskToDelete(id);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== taskToDelete);
      setTasks(updatedTasks);
      setTaskToDelete(null);
      toast.success("Task deleted successfully!", { id: theOnlyToastId });
    }
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
                  onComplete={() => initiateDeleteTask(task.id)}
                  deleteTask={!!taskToDelete}
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
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>
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
