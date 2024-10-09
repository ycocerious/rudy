import { categoryColors } from "@/constants/uiConstants";
import { type Task } from "@/types/task";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";
import { useRef } from "react";

interface SwipeableTaskProps {
  task: Task;
  onComplete: () => void;
}

export const SwipeableTodaysTask: React.FC<SwipeableTaskProps> = ({
  task,
  onComplete,
}) => {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const borderColor = useTransform(
    x,
    [0, 50, 250],
    [
      categoryColors[task.category],
      "rgba(74, 222, 128, 1)",
      "rgba(74, 222, 128, 1)",
    ],
  );

  const iconOpacity = useTransform(x, [0, 50, 300], [0, 1, 1]);

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
        className="flex h-full w-full cursor-grab items-center justify-between p-4"
      >
        <span className="text-md z-10 max-w-[60%] break-words text-white">
          {task.text}
        </span>
        <div className="z-10 flex items-center space-x-2">
          <span
            className="text-xs"
            style={{ color: categoryColors[task.category] }}
          >
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </span>
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: categoryColors[task.category] }}
          ></div>
        </div>
      </motion.div>
      <motion.div
        className="absolute right-4 z-20 ml-2"
        style={{ opacity: iconOpacity }}
      >
        <Check className="text-green-400" size={24} />
      </motion.div>
    </motion.div>
  );
};
