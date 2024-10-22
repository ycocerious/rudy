import { type Task } from "@/types/task";
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check, Flame, Trophy } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SwipeableTaskProps {
  task: Task;
  returnToPosition: boolean;
  handleSwipe: () => void;
  handleReturnToPosition: () => void;
}

export const SwipeableTodaysTask: React.FC<SwipeableTaskProps> = ({
  task,
  returnToPosition: returnToPosition,
  handleSwipe,
  handleReturnToPosition,
}) => {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isSwiped, setIsSwiped] = useState(false);

  const threshold = 200; // Full swipe threshold

  useEffect(() => {
    if (returnToPosition) {
      setIsSwiped(false);
      void controls.start({ x: 0 });
      handleReturnToPosition();
    }
  }, [returnToPosition, controls, handleReturnToPosition]);

  const borderColor = useTransform(
    x,
    [0, 50, 250],
    ["#5ce1e6", "#00A3A3", "#00A3A3"],
  );

  const iconOpacity = useTransform(x, [0, 50, 300], [0, 1, 1]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x >= threshold) {
      setIsSwiped(true);
      void controls.start({ x: threshold });
      handleSwipe(); // Trigger the swipe action
    } else {
      void controls.start({ x: 0 });
    }
  };

  return (
    <motion.div
      ref={constraintsRef}
      className="relative mb-2 flex h-auto min-h-[3.25rem] w-full items-center justify-start overflow-hidden rounded-md bg-transparent focus:outline-none"
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
        onDrag={(_, info) => {
          if (info.point.x < 0) {
            void controls.start({ x: 0 });
          }
        }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="flex h-full w-full cursor-grab items-center justify-between py-2 pl-4 pr-1"
      >
        <div>
          <span className="text-md z-10 mr-2 max-w-[60%] break-words text-white">
            {task.name}
          </span>
          {task.category === "daily" && (
            <span className="text-xs text-[#00A3A3]">
              {"(" + task.dailyCountFinished + "/" + task.dailyCountTotal + ")"}
            </span>
          )}
        </div>

        {/* Updated this part */}
        <div className="max-w-[40%] text-right">
          <div className="flex flex-wrap justify-end">
            {(task.currentStreak ?? 0) > 0 && (
              <div className="mr-2 flex items-center gap-1">
                <Flame size={20} className="text-orange-500" />
                <span className="text-sm text-orange-500">
                  {task.currentStreak}
                </span>
              </div>
            )}
            {(task.highestStreak ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Trophy size={20} className="text-yellow-500" />
                <span className="text-sm text-yellow-500">
                  {task.highestStreak}
                </span>
              </div>
            )}
          </div>
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
