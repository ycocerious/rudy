import { CATEGORY_COLORS } from "@/constants/categoryColors";
import { getColorFromTailwindClass } from "@/lib/utils/get-tailwind-color";
import { type Task } from "@/types/task";
import {
  motion,
  type PanInfo,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { AddOrEditTaskSheet } from "./add-or-edit-task-sheet";

interface SwipeableTaskProps {
  task: Task;
  handleSwipe: () => void;
}

export const SwipeableAllTask: React.FC<SwipeableTaskProps> = ({
  task,
  handleSwipe,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isSwiped, setIsSwiped] = useState(false);

  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();

  const threshold = 250;

  const borderColor = useTransform(
    x,
    [0, 50, threshold],
    [
      task.category
        ? CATEGORY_COLORS[task.category]
        : getColorFromTailwindClass("primary"),
      getColorFromTailwindClass("destructive"),
      getColorFromTailwindClass("destructive"),
    ],
  );

  const iconOpacity = useTransform(x, [0, 50, threshold], [0, 1, 1]);

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
    <>
      <motion.button
        ref={constraintsRef}
        className="relative mb-2 flex h-auto min-h-[3.25rem] w-full items-center justify-start overflow-hidden rounded-md bg-transparent focus:outline-none"
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor,
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
          className="flex h-full w-full items-center justify-between py-2 pl-4 pr-2"
        >
          <span className="text-md z-10">{task.name}</span>
        </motion.div>
        <motion.div
          className="30 absolute right-4 top-4 ml-2"
          style={{ opacity: iconOpacity }}
        >
          <Trash2 className="text-destructive" size={24} />
        </motion.div>
      </motion.button>

      <AddOrEditTaskSheet
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
        taskType="edit"
        task={task}
      />
    </>
  );
};
