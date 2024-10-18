import { categoryColors } from "@/constants/uiConstants";
import { type Task } from "@/types/task";
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SwipeableTaskProps {
  task: Task;
  isCancelled: boolean;
  onSwipe: () => void;
  onCancelSwipe: () => void;
}

export const SwipeableTodaysTask: React.FC<SwipeableTaskProps> = ({
  task,
  isCancelled,
  onSwipe,
  onCancelSwipe,
}) => {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);

  const threshold = 200; // Full swipe threshold

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
    [categoryColors[task.category], "#00A3A3", "#00A3A3"],
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
    <motion.div
      ref={constraintsRef}
      className="relative mb-2 flex h-[3.25rem] items-center overflow-hidden rounded-lg bg-[rgb(0,3,3)]"
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: borderColor,
      }}
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
        className="flex h-full w-full cursor-grab items-center justify-between p-4"
      >
        <span className="text-md z-10 max-w-[60%] break-words text-white">
          {task.name}
        </span>
        <div className="z-10 flex items-center space-x-2">
          <span
            className="text-xs"
            style={{ color: categoryColors[task.category] }}
          >
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </span>
          {task.category === "daily" && (
            <span
              className="text-xs"
              style={{ color: categoryColors[task.category] }}
            >
              {"(" + task.dailyCountFinished + "/" + task.dailyCountTotal + ")"}
            </span>
          )}
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: categoryColors[task.category] }}
          />
        </div>
      </motion.div>
      <motion.div
        className="absolute right-4 z-20 ml-2"
        style={{ opacity: iconOpacity }}
      >
        <Check className="text-[#00A3A3]" size={24} />
      </motion.div>
    </motion.div>
  );
};
