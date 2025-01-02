import { getColorFromTailwindClass } from "@/lib/utils/get-tailwind-color";
import { type Task } from "@/types/task";
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Apple, Bed, Check, Dumbbell } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SwipeableTaskProps {
  task: Task;
  returnToPosition: boolean;
  handleSwipe: () => void;
  handleReturnToPosition: () => void;
}

const categoryConfig = {
  sleep: {
    icon: Bed,
    bgColor: "rgb(192, 61, 97)",
    iconColor: "text-gray-950",
    label: "Sleep",
  },
  exercise: {
    icon: Dumbbell,
    bgColor: "rgb(222, 133, 53)",
    iconColor: "text-gray-950",
    label: "Exercise",
  },
  nutrition: {
    icon: Apple,
    bgColor: "rgb(128, 116, 224)",
    iconColor: "text-gray-950",
    label: "Nutrition",
  },
} as const;

export const SwipeableTodaysTask: React.FC<SwipeableTaskProps> = ({
  task,
  returnToPosition,
  handleSwipe,
  handleReturnToPosition,
}) => {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const threshold = 250; // Full swipe threshold

  const borderColor = useTransform(
    x,
    [0, 50, threshold],
    isDragging
      ? [
          "transparent",
          getColorFromTailwindClass("primary"),
          getColorFromTailwindClass("primary"),
        ]
      : ["transparent", "transparent", "transparent"],
  );

  useEffect(() => {
    if (returnToPosition) {
      setIsSwiped(false);
      void controls.start({ x: 0 });
      handleReturnToPosition();
    }
  }, [returnToPosition, controls, handleReturnToPosition]);

  const iconOpacity = useTransform(x, [0, 50, 250], [0, 1, 1]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    setIsDragging(false);
    if (info.offset.x >= threshold) {
      setIsSwiped(true);
      void controls.start({ x: threshold });
      handleSwipe();
    } else {
      void controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      className="relative flex h-auto min-h-[3.25rem] w-full items-center justify-start overflow-hidden rounded-md bg-transparent focus:outline-none"
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor,
      }}
    >
      <motion.div
        style={{ x }}
        drag={!isSwiped ? "x" : false}
        dragConstraints={{ left: 0, right: 250 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={(_, info) => {
          if (info.point.x < 0) {
            void controls.start({ x: 0 });
          }
        }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="flex h-full w-full cursor-grab items-center justify-between p-2"
      >
        <div className="flex w-full items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: task.category
                ? categoryConfig[task.category].bgColor
                : "transparent",
            }}
          >
            {task.category &&
              categoryConfig[task.category] &&
              React.createElement(categoryConfig[task.category].icon, {
                size: 22,
                className: categoryConfig[task.category].iconColor,
                strokeWidth: 2.5,
              })}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="text-md z-10 ml-[2px] truncate">{task.name}</div>
            {task.category && (
              <div
                className="inline-flex w-fit rounded px-1 py-0.5 text-[10px]"
                style={{
                  backgroundColor: `${categoryConfig[task.category].bgColor.replace("rgb", "rgba").replace(")", ", 0.2)")}`,
                  color: categoryConfig[task.category].bgColor,
                }}
              >
                {categoryConfig[task.category].label}
              </div>
            )}
          </div>

          {task.frequency === "daily" && (
            <div className="mr-2 text-xs text-gray-300">
              {"(" + task.dailyCountFinished + "/" + task.dailyCountTotal + ")"}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="absolute right-4 z-20 ml-2"
        style={{ opacity: iconOpacity }}
      >
        <Check className="text-primary" size={32} />
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 mx-auto w-[95%] border-b-[1px] border-border" />
    </motion.div>
  );
};
