"use client";

import { categoryColors } from "@/constants/uiConstants";
import { type Task } from "@/types/task";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { AddOrEditTaskDialog } from "./add-or-edit-task-dialog";

interface SwipeableTaskProps {
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onComplete: () => void;
}

export const SwipeableAllTask: React.FC<SwipeableTaskProps> = ({
  task,
  setTasks,
  onComplete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const borderColor = useTransform(
    x,
    [0, 50, 250],
    [
      categoryColors[task.category],
      "rgba(255, 36, 0, 1)",
      "rgba(255, 36, 0, 1)",
    ],
  );

  const iconOpacity = useTransform(x, [0, 50, 300], [0, 1, 1]);

  return (
    <>
      <motion.button
        ref={constraintsRef}
        className="relative mb-2 flex h-auto min-h-[3.25rem] w-full items-center justify-start overflow-hidden rounded-lg bg-[rgb(0,3,3)] focus:outline-none"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: borderColor,
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        <motion.div
          style={{ x }}
          drag="x"
          dragConstraints={{ left: 0, right: 250 }}
          dragElastic={0}
          onDrag={(_, info) => {
            if (info.point.x < 0) {
              void controls.start({ x: 0 });
            }
          }}
          onDragEnd={(_, info) => {
            const threshold = 200; // Full swipe threshold
            if (info.offset.x >= threshold) {
              void controls.start({ x: threshold });
              onComplete();
            } else {
              void controls.start({ x: 0 });
            }
          }}
          animate={controls}
          className="flex h-full w-full items-center justify-between py-2 pl-4 pr-1"
        >
          <span className="text-md z-10 text-white">{task.text}</span>
          <div
            className="max-w-[40%] text-right text-xs"
            style={{ color: categoryColors[task.category] }}
          >
            {task.category === "daily" && (
              <span className="mr-1">Repeats everyday</span>
            )}
            {task.category === "xdays" && (
              <span className="mr-1">{`Repeats every ${task.repeatValue} days`}</span>
            )}
            {task.category === "weekly" && (
              <span className="mr-1">{`Repeats every ${task.repeatValue}`}</span>
            )}
            {task.category === "monthly" &&
              (task.repeatValue !== "custom" ? (
                <span className="mr-1">{`Repeats every ${task.repeatValue} of month`}</span>
              ) : (
                <span className="mr-1">{`Repeats every ${task.customMonthDate} of month`}</span>
              ))}
          </div>
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 z-30 ml-2"
          style={{ opacity: iconOpacity }}
        >
          <Trash2 className="text-red-800" size={24} />
        </motion.div>
      </motion.button>

      <AddOrEditTaskDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        setTasks={setTasks}
        taskType="edit"
        task={task}
      />
    </>
  );
};
