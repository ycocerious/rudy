import { TASK_CATEGORIES } from "@/constants/categories";
import { CATEGORY_COLORS } from "@/constants/categoryColors";
import { getColorFromTailwindClass } from "@/lib/utils/get-tailwind-color";
import { type Task } from "@/types/task";
import React, { useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";

interface TaskProps {
  task: Task;
}

export const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const borderColor = task.category
    ? CATEGORY_COLORS[task.category]
    : getColorFromTailwindClass("primary");

  const getFrequencyText = () => {
    switch (task.frequency) {
      case "daily":
        return "Every day";
      case "xdays":
        return `Every ${task.xValue} days`;
      case "weekly":
        if (!task.weekDays) return "";
        return task.weekDays.length > 3
          ? "Days of week"
          : task.weekDays.join(", ");
      case "monthly":
        if (!task.monthDays) return "";
        return task.monthDays.length > 4
          ? "Days of month"
          : task.monthDays.join(", ");
      default:
        return "";
    }
  };

  return (
    <>
      <button
        className="relative mb-2 flex h-auto min-h-[3.25rem] w-full flex-col items-start justify-center overflow-hidden rounded-md bg-transparent px-4 py-2 focus:outline-none"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor,
        }}
        onClick={() => setIsSheetOpen(true)}
      >
        {task.category && (
          <div
            className="absolute right-2 top-2 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: CATEGORY_COLORS[task.category],
            }}
          >
            {React.createElement(TASK_CATEGORIES[task.category].icon, {
              size: 22,
              className: "text-gray-950",
              strokeWidth: 2.5,
            })}
          </div>
        )}
        <span className="text-md ml-[2px] mr-10">{task.name}</span>
        <div
          className="inline-flex w-fit rounded px-1 py-0.5 text-[10px] font-medium"
          style={{
            backgroundColor: `${borderColor.replace("rgb", "rgba").replace(")", ", 0.2)")}`,
            color: borderColor,
          }}
        >
          {getFrequencyText()}
        </div>
      </button>

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        taskType="edit"
        task={task}
      />
    </>
  );
};
