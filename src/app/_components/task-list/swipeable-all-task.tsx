import { CATEGORY_COLORS } from "@/constants/categoryColors";
import { getColorFromTailwindClass } from "@/lib/utils/get-tailwind-color";
import { type Task } from "@/types/task";
import { useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";

interface TaskProps {
  task: Task;
}

export const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const borderColor = task.category
    ? CATEGORY_COLORS[task.category]
    : getColorFromTailwindClass("primary");

  return (
    <>
      <button
        className="relative mb-2 flex h-auto min-h-[3.25rem] w-full items-center justify-start overflow-hidden rounded-md bg-transparent px-4 py-2 focus:outline-none"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor,
        }}
        onClick={() => setIsSheetOpen(true)}
      >
        <span className="text-md">{task.name}</span>
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
