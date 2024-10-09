"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { SwipeableTodaysTask } from "./swipeable-todays-task";
import { type Task } from "@/types/task";
import { exampleTasks } from "@/constants/mockData";
import { sortTasks } from "@/lib/utils/sort-tasks";

export const TodayTasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(sortTasks(exampleTasks));

  const completeTask = (id: string) => {
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
            <SwipeableTodaysTask
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
