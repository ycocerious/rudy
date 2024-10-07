"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SwipeableTask } from "./swipeable-task";
import { Reorder } from "framer-motion";

interface Task {
  id: number;
  text: string;
  streak: number;
  type: "today" | "all";
}

export const AllTasksList: React.FC = () => {
  const exampleTasks: Task[] = [
    { id: 1, text: "Play", streak: 5, type: "all" },
    { id: 2, text: "Eat", streak: 10, type: "all" },
    { id: 3, text: "Code", streak: 8, type: "all" },
    { id: 4, text: "Repeat", streak: 2, type: "all" },
  ];
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const completeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTaskText.trim(),
          streak: 0,
          type: "all",
        },
      ]);
      setNewTaskText("");
      setIsDialogOpen(false);
    }
  };

  const renderAddTaskButton = () => (
    <Button
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-[#00A3A3]"
      onClick={() => setIsDialogOpen(true)}
    >
      <Plus size={24} />
    </Button>
  );

  const renderAddTaskDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogOverlay className="bg-gray-950/40" />
      <DialogContent className="max-w-[calc(100%-3rem)] rounded-xl border-none bg-gray-900 text-white sm:max-w-[24rem]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <Input
          value={newTaskText}
          onChange={(e) => {
            const input = e.target.value;
            if (input.length <= 20) {
              setNewTaskText(input);
            }
          }}
          placeholder="Enter task name (max 20 characters)"
          className="border-gray-600 bg-gray-800 text-white"
          maxLength={30}
        />
        <p className="mt-1 text-sm text-gray-400">
          {20 - newTaskText.length} characters remaining
        </p>
        <DialogFooter>
          <Button
            onClick={addTask}
            className="bg-[#00A3A3]"
            disabled={newTaskText.trim().length === 0}
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (tasks.length === 0) {
    return (
      <>
        {renderAddTaskButton()}
        {renderAddTaskDialog()}
      </>
    );
  }

  return (
    <>
      <p className="mb-1 px-2 text-center text-sm text-[#A1A1AA]">
        Swipe to delete a task, Hold and drag to reorder
      </p>
      <p className="mb-1 px-2 text-center text-sm text-[#A1A1AA]"></p>
      <Card className="mx-auto w-full min-w-[240px] max-w-lg border-none bg-gray-950 text-white">
        <CardContent className="p-2 pb-[1px]">
          <Reorder.Group axis="y" values={tasks} onReorder={setTasks}>
            {tasks.map((task) => (
              <SwipeableTask
                key={task.id}
                task={task}
                onComplete={() => completeTask(task.id)}
              />
            ))}
          </Reorder.Group>
        </CardContent>
        {renderAddTaskButton()}
        {renderAddTaskDialog()}
      </Card>
    </>
  );
};
