import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  Reorder,
} from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { useRef } from "react";

interface Task {
  id: number;
  text: string;
  streak: number;
  type: "today" | "all";
}

interface SwipeableTaskProps {
  task: Task;
  onComplete: () => void;
}

export const SwipeableTask: React.FC<SwipeableTaskProps> = ({
  task,
  onComplete,
}) => {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  // const background = useTransform(
  //   x,
  //   [0, 350],
  //   task.type === "today"
  //     ? ["rgba(0, 0, 0, 0)", "rgba(74, 222, 128, 0.5)"]
  //     : ["rgba(0, 0, 0, 0)", "rgba(255, 36, 0, 1)"],
  // );

  const borderColor = useTransform(
    x,
    [0, 50, 250],
    [
      "rgb(127, 233, 238)", // Original border color
      task.type === "today" ? "rgba(74, 222, 128, 1)" : "rgba(255, 36, 0, 1)",
      task.type === "today" ? "rgba(74, 222, 128, 1)" : "rgba(255, 36, 0, 1)",
    ],
  );

  const iconOpacity = useTransform(x, [0, 50, 300], [0, 1, 1]);

  function TaskContent() {
    return (
      <motion.div
        ref={constraintsRef}
        className="relative mb-2 flex items-center overflow-hidden rounded-lg bg-[rgb(0,3,3)]"
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
          {/* <motion.div className="absolute inset-0 z-0" style={{ background }} /> */}
          <span className="z-10 max-w-[60%] break-words text-lg text-white">
            {task.text}
          </span>
          {/* <div className="z-10 flex items-center space-x-2">
          <span className="whitespace-nowrap text-orange-500">
            {task.type === "today" ? "Current:" : "Highest: "}
          </span>
          <Flame className="text-orange-500" size={20} />
          <span className="text-orange-500">{task.streak}</span>
        </div> */}
        </motion.div>
        <motion.div
          className="absolute right-4 z-20 ml-2"
          style={{ opacity: iconOpacity }}
        >
          {task.type === "today" ? (
            <Check className="text-green-400" size={24} />
          ) : (
            <Trash2 className="text-red-800" size={24} />
          )}
        </motion.div>
      </motion.div>
    );
  }

  return task.type === "all" ? (
    <Reorder.Item value={task} id={task.id.toString()}>
      <TaskContent />
    </Reorder.Item>
  ) : (
    <TaskContent />
  );
};
