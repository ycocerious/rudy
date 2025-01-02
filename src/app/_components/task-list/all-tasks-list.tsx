"use client";

import { api } from "@/trpc/react";
import { useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";
import { AddTaskButton } from "./add-task-button";
import { TaskItem } from "./swipeable-all-task";

const CATEGORY_PRIORITY = {
  exercise: 0,
  nutrition: 1,
  sleep: 2,
} as const;

export const AllTasksList = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { data: tasks, isLoading } = api.task.getAllTasks.useQuery(undefined, {
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  const sortedTasks = tasks?.sort((a, b) => {
    const priorityA = CATEGORY_PRIORITY[a.category] ?? Number.MAX_SAFE_INTEGER;
    const priorityB = CATEGORY_PRIORITY[b.category] ?? Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });

  if (isLoading) {
    return (
      <>
        <div className="mt-4 text-center">Loading...</div>
        <AddTaskButton setIsSheetOpen={setIsSheetOpen} />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto mt-4 h-full w-full max-w-2xl">
        {sortedTasks?.length !== 0 ? (
          <div className="space-y-3 px-4">
            {sortedTasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        ) : (
          <div className="mt-4 flex flex-grow items-center justify-center text-center">
            Click the + icon to add your first task!
          </div>
        )}
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
