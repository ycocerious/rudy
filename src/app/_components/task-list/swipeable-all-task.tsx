"use client";

import { categoryColors } from "@/constants/uiConstants";
import { type Task } from "@/types/task";
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";

interface SwipeableTaskProps {
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  isCancelled: boolean;
  onSwipe: () => void;
  onCancelSwipe: () => void;
}

export const SwipeableAllTask: React.FC<SwipeableTaskProps> = ({
  task,
  setTasks,
  isCancelled,
  onSwipe,
  onCancelSwipe,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isSwiped, setIsSwiped] = useState(false);

  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const threshold = 200;

  useEffect(() => {
    if (isCancelled) {
      setIsSwiped(false);
      void controls.start({ x: 0 });
      onCancelSwipe();
    }
  }, [isCancelled, controls, onCancelSwipe]);

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

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x >= threshold) {
      setIsSwiped(true);
      void controls.start({ x: threshold });
      onSwipe(); // Trigger the swipe action
    } else {
      void controls.start({ x: 0 });
    }
  };

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
        onClick={() => setIsSheetOpen(true)}
      >
        <motion.div
          style={{ x }}
          drag={!isSwiped ? "x" : false}
          dragConstraints={{ left: 0, right: 250 }}
          dragElastic={0}
          onDrag={(_, info) => {
            if (info.point.x < 0) {
              void controls.start({ x: 0 });
            }
          }}
          onDragEnd={handleDragEnd}
          animate={controls}
          className="flex h-full w-full items-center justify-between py-2 pl-4 pr-1"
        >
          <span className="text-md z-10 text-white">{task.name}</span>
          <div
            className="max-w-[40%] text-right text-xs"
            style={{ color: categoryColors[task.category] }}
          >
            {task.category === "daily" && (
              <span className="mr-1">
                {"Everyday" +
                  " " +
                  `${task.dailyCountTotal && task.dailyCountTotal === 1 ? "once" : `${task.dailyCountTotal} times`}`}
              </span>
            )}
            {task.category === "xdays" && (
              <span className="mr-1">{`Every ${task.xValue} days`}</span>
            )}
            {task.category === "weekly" && (
              <span className="mr-1">{`Every ${task.repeatDays!.map((day) => day.slice(0, 3)).join(", ")}`}</span>
            )}
            {task.category === "monthly" && (
              <span className="mr-1">{`Every ${task.repeatDays!.map((day) => day.replace("-", " ")).join(", ")}`}</span>
            )}
          </div>
        </motion.div>
        <motion.div
          className="absolute right-4 top-4 z-30 ml-2"
          style={{ opacity: iconOpacity }}
        >
          <Trash2 className="text-red-800" size={24} />
        </motion.div>
      </motion.button>

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        setTasks={setTasks}
        taskType="edit"
        task={task}
      />
    </>
  );
};
