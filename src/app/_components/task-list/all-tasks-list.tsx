"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, Save } from "lucide-react";
import { SwipeableTask } from "./swipeable-task";
import { Reorder } from "framer-motion";

interface Task {
  id: number;
  text: string;
  streak: number;
  type: "today" | "all";
}

const STORAGE_KEY = "allTasks";

export const AllTasksList: React.FC = () => {
  const exampleTasks: Task[] = [
    { id: 1, text: "Play", streak: 5, type: "all" },
    { id: 2, text: "Eat", streak: 10, type: "all" },
    { id: 3, text: "Code", streak: 8, type: "all" },
    { id: 4, text: "Repeat", streak: 2, type: "all" },
  ];

  // Initialize state from localStorage or fallback to exampleTasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      return savedTasks ? (JSON.parse(savedTasks) as Task[]) : exampleTasks;
    }
    return exampleTasks;
  });

  const [originalOrder, setOriginalOrder] = useState<Task[]>(tasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [isReordered, setIsReordered] = useState(false);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completeTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setOriginalOrder(updatedTasks);
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask = {
        id: Date.now(),
        text: newTaskText.trim(),
        streak: 0,
        type: "all" as const,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setOriginalOrder(updatedTasks);
      setNewTaskText("");
      setIsDialogOpen(false);
    }
  };

  const handleReorder = (newOrder: Task[]) => {
    setTasks(newOrder);
    setIsReordered(JSON.stringify(newOrder) !== JSON.stringify(originalOrder));
  };

  const saveNewOrder = () => {
    setOriginalOrder(tasks);
    setIsReordered(false);
    // Order is automatically saved to localStorage via useEffect
  };

  // Rest of the component remains the same
  const renderActionButton = () => {
    if (isReordered) {
      return (
        <Button
          className="fixed bottom-4 right-4 h-14 w-auto bg-[#00A3A3] hover:bg-[#00A3A3]"
          onClick={saveNewOrder}
        >
          <Save size={24} className="mr-2" />
          Save Order
        </Button>
      );
    }
    return (
      <Button
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-[#00A3A3]"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus size={24} />
      </Button>
    );
  };

  // Rest of the render logic remains the same
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
        {renderActionButton()}
        {renderAddTaskDialog()}
      </>
    );
  }

  return (
    <>
      <p className="mb-1 px-2 text-center text-sm text-[#A1A1AA]">
        Swipe to delete a task, Hold and drag to reorder
      </p>
      <Card className="mx-auto w-full min-w-[240px] max-w-lg border-none bg-gray-950 text-white">
        <CardContent className="p-2 pb-[1px]">
          <Reorder.Group axis="y" values={tasks} onReorder={handleReorder}>
            {tasks.map((task) => (
              <SwipeableTask
                key={task.id}
                task={task}
                onComplete={() => completeTask(task.id)}
              />
            ))}
          </Reorder.Group>
        </CardContent>
        {renderActionButton()}
        {renderAddTaskDialog()}
      </Card>
    </>
  );
};
