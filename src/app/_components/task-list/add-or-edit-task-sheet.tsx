import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categoryDisplayText } from "@/constants/mappings";
import { theOnlyToastId } from "@/constants/uiConstants";
import { sortTasks } from "@/lib/utils/sort-tasks";
import { type Task } from "@/types/task";
import { type taskCateogry } from "@/types/task-category";
import { nanoid } from "nanoid";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MonthlySelectContent } from "./monthly-select-content";
import { WeeklySelectContent } from "./weekly-select-content";
import { XdaySelectContent } from "./xday-select-content";

type BaseAddOrEditTaskSheetProps = {
  isSheetOpen: boolean;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
};

type AddTaskSheetProps = BaseAddOrEditTaskSheetProps & {
  taskType: "add";
};

type EditTaskSheetProps = BaseAddOrEditTaskSheetProps & {
  taskType: "edit";
  task: Task;
};

type AddOrEditTaskSheetProps = AddTaskSheetProps | EditTaskSheetProps;

export const AddOrEditTaskSheet = (props: AddOrEditTaskSheetProps) => {
  console.log("Hi", props.taskType === "edit" ? props.task : "");
  const { isSheetOpen, setIsSheetOpen, setTasks, taskType } = props;

  const originalTask = taskType === "edit" ? props.task : null;
  const [newTaskText, setNewTaskText] = useState(originalTask?.text ?? "");
  const [newTaskCategory, setNewTaskCategory] = useState<taskCateogry | null>(
    originalTask?.category ?? null,
  );
  const [newTaskRepeatValue, setNewTaskRepeatValue] = useState<string | null>(
    originalTask?.repeatValue ?? null,
  );
  const [newTaskCustomMonthDate, setNewTaskCustomMonthDate] = useState<
    string | null
  >(originalTask?.customMonthDate ?? null);

  const handleSheetClose = () => {
    setNewTaskText("");
    setIsSheetOpen(false);
    setNewTaskCategory(null);
    setNewTaskRepeatValue(null);
    setNewTaskCustomMonthDate(null);
  };

  const hasChanges = useMemo(() => {
    if (taskType === "add") return true;
    if (!originalTask) return false;

    return (
      newTaskText !== originalTask.text ||
      newTaskCategory !== originalTask.category ||
      newTaskRepeatValue !== (originalTask.repeatValue ?? null) ||
      newTaskCustomMonthDate !== (originalTask.customMonthDate ?? null)
    );
  }, [
    taskType,
    originalTask,
    newTaskText,
    newTaskCategory,
    newTaskRepeatValue,
    newTaskCustomMonthDate,
  ]);

  const isTaskValid: boolean = useMemo<boolean>(() => {
    const isValidBasicTask = newTaskText.trim() && newTaskCategory;
    if (!isValidBasicTask) return false;
    if (taskType === "edit" && !hasChanges) return false;

    if (newTaskCategory === "daily") {
      return true;
    }

    if (!newTaskRepeatValue) {
      return false;
    }

    if (
      newTaskCategory === "monthly" &&
      newTaskRepeatValue === "custom" &&
      !newTaskCustomMonthDate
    ) {
      return false;
    }

    return true;
  }, [
    newTaskText,
    newTaskCategory,
    taskType,
    hasChanges,
    newTaskRepeatValue,
    newTaskCustomMonthDate,
  ]);

  const addTask = () => {
    if (!isTaskValid) return;

    const newTask: Task = {
      id: nanoid(),
      text: newTaskText.trim(),
      category: newTaskCategory!,
      repeatValue: newTaskRepeatValue!,
      customMonthDate: newTaskCustomMonthDate ?? undefined,
    };

    setTasks((prevTasks) => sortTasks([...prevTasks, newTask]));
    handleSheetClose();
    toast.success("Added Task Successfully", { id: theOnlyToastId });
  };

  const editTask = () => {
    if (!isTaskValid || taskType !== "edit") return;

    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((individualTask) =>
        individualTask.id === originalTask?.id
          ? {
              ...individualTask,
              text: newTaskText,
              category: newTaskCategory!,
              repeatValue: newTaskRepeatValue ?? undefined,
              customMonthDate: newTaskCustomMonthDate ?? undefined,
            }
          : individualTask,
      );
      return sortTasks(newTasks);
    });

    setIsSheetOpen(false);
    toast.success("Edited Task Successfully", { id: theOnlyToastId });
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (taskType === "add") {
            handleSheetClose();
          } else {
            setIsSheetOpen(false);
          }
        }
      }}
    >
      <SheetContent
        side="bottom"
        className="space-y-4 rounded-t-xl border-none bg-white sm:max-w-[24rem]"
      >
        <SheetHeader>
          <SheetTitle>
            {taskType === "add"
              ? "Add New Task"
              : `Edit Task: ${originalTask?.text}`}
          </SheetTitle>
        </SheetHeader>

        <div>
          <Input
            value={newTaskText}
            onChange={(e) => {
              const input = e.target.value;
              if (input.length <= 15) {
                setNewTaskText(input);
              }
            }}
            placeholder="Enter task name (max 15 chars)"
            maxLength={15}
            autoFocus={taskType === "edit"}
            onFocus={(e) => {
              if (taskType === "edit") {
                const value = e.target.value;
                e.target.value = "";
                e.target.value = value;
              }
            }}
          />
        </div>

        <Select
          value={newTaskCategory ?? undefined}
          onValueChange={(value: taskCateogry) => setNewTaskCategory(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Repetition duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">{categoryDisplayText.daily}</SelectItem>
            <SelectItem value="weekly">{categoryDisplayText.weekly}</SelectItem>
            <SelectItem value="monthly">
              {categoryDisplayText.monthly}
            </SelectItem>
            <SelectItem value="xdays">{categoryDisplayText.xdays}</SelectItem>
          </SelectContent>
        </Select>

        {newTaskCategory && newTaskCategory === "monthly" ? (
          <MonthlySelectContent
            newRepeatValue={newTaskRepeatValue}
            newCustomMonthDate={newTaskCustomMonthDate}
            setNewRepeatValue={setNewTaskRepeatValue}
            setNewCustomMonthDate={setNewTaskCustomMonthDate}
          />
        ) : newTaskCategory === "weekly" ? (
          <WeeklySelectContent
            newRepeatValue={newTaskRepeatValue}
            setNewRepeatValue={setNewTaskRepeatValue}
          />
        ) : newTaskCategory === "xdays" ? (
          <XdaySelectContent
            newRepeatValue={newTaskRepeatValue}
            setNewRepeatValue={setNewTaskRepeatValue}
          />
        ) : null}

        <SheetFooter>
          <Button
            onClick={taskType === "add" ? addTask : editTask}
            className="bg-[#00A3A3] hover:bg-[#00A3A3]"
            disabled={!isTaskValid}
          >
            {taskType === "add" ? "Add Task" : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
