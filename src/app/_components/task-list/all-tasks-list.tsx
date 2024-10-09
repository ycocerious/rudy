"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { exampleTasks } from "@/constants/mockData";
import { type Task } from "@/types/task";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { AddOrEditTaskDialog } from "./add-or-edit-task-dialog";
import { SwipeableAllTask } from "./swipeable-all-task";

export const AllTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
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
                  onComplete={() => deleteTask(task.id)}
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
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus size={24} className="text-white" />
      </Button>

      <AddOrEditTaskDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setTasks={setTasks}
        taskType="add"
      />
    </>
  );
};
