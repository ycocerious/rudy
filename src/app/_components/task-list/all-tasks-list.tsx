"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";
import { TaskItem } from "./swipeable-all-task";

const CATEGORY_PRIORITY = {
  exercise: 0,
  nutrition: 1,
  sleep: 2,
} as const;

export const AllTasksList = () => {
  const { data: tasks, isLoading } = api.task.getAllTasks.useQuery();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sortedTasks = tasks?.sort((a, b) => {
    const priorityA = CATEGORY_PRIORITY[a.category] ?? Number.MAX_SAFE_INTEGER;
    const priorityB = CATEGORY_PRIORITY[b.category] ?? Number.MAX_SAFE_INTEGER;
    return priorityA - priorityB;
  });

  return (
    <>
      <div className="mx-auto h-full w-full max-w-2xl">
        {sortedTasks?.length !== 0 ? (
          <div className="space-y-3 px-4">
            {sortedTasks?.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        ) : (
          <div className="flex flex-grow items-center justify-center text-center">
            {isLoading
              ? "Loading..."
              : "Click the + icon to add your first task!"}
          </div>
        )}
      </div>

      <Button
        className="fixed bottom-6 right-4 z-50 h-[3.5rem] w-[3.5rem] rounded-xl bg-accent"
        onClick={() => setIsSheetOpen(true)}
      >
        <Plus size={38} className="text-accent-foreground" />
      </Button>

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        taskType="add"
      />
    </>
  );
};
