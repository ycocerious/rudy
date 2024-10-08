"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { SwipeableTask } from "./swipeable-task";

interface Task {
  id: number;
  text: string;
  streak: number;
  type: "today" | "all";
}

const exampleTasks: Task[] = [
  { id: 1, text: "Play", streak: 5, type: "today" },
  { id: 2, text: "Eat", streak: 10, type: "today" },
  { id: 3, text: "Code", streak: 8, type: "today" },
  { id: 4, text: "Repeat", streak: 2, type: "today" },
];

export const TodayTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(exampleTasks);

  const completeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <>
      <p className="mb-1 px-2 text-center text-xs text-[#A1A1AA]">
        Swipe to complete a task
      </p>
      <Card className="mx-auto w-full min-w-[240px] max-w-lg border-none bg-gray-950 text-white">
        <CardContent className="p-2 pb-[1px]">
          {tasks.map((task) => (
            <SwipeableTask
              key={task.id}
              task={task}
              onComplete={() => completeTask(task.id)}
            />
          ))}
        </CardContent>
      </Card>
    </>
  );
};
