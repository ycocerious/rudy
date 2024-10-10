import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryDisplayText } from "@/constants/mappings";
import { theOnlyToastId } from "@/constants/uiConstants";
import { sortTasks } from "@/lib/utils/sort-tasks";
import { type Task } from "@/types/task";
import { type taskCateogry } from "@/types/task-category";
import { nanoid } from "nanoid";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MonthlyDialogContent } from "./monthly-dialog-content";
import { WeeklyDialogContent } from "./weekly-dialog-content";
import { XdayDialogContent } from "./xday-dialog-content";

type BaseAddOrEditTaskDialogProps = {
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
};

type AddTaskDialogProps = BaseAddOrEditTaskDialogProps & {
  taskType: "add";
};

type EditTaskDialogProps = BaseAddOrEditTaskDialogProps & {
  taskType: "edit";
  task: Task;
};

type AddOrEditTaskDialogProps = AddTaskDialogProps | EditTaskDialogProps;

export const AddOrEditTaskDialog = (props: AddOrEditTaskDialogProps) => {
  console.log("Hi", props.taskType === "edit" ? props.task : "");
  const { isDialogOpen, setIsDialogOpen, setTasks, taskType } = props;

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

  const handleDialogClose = () => {
    setNewTaskText("");
    setIsDialogOpen(false);
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
    handleDialogClose();
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

    setIsDialogOpen(false);
    toast.success("Edited Task Successfully", { id: theOnlyToastId });
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (taskType === "add") {
            handleDialogClose();
          } else {
            setIsDialogOpen(false);
          }
        }
      }}
    >
      <DialogContent
        className="max-w-[calc(100%-3rem)] rounded-xl border-none bg-white sm:max-w-[24rem]"
        aria-describedby="add task dialog"
      >
        <DialogHeader>
          <DialogTitle>
            {taskType === "add"
              ? "Add New Task"
              : `Edit Task: ${originalTask?.text}`}
          </DialogTitle>
        </DialogHeader>
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
          <MonthlyDialogContent
            newRepeatValue={newTaskRepeatValue}
            newCustomMonthDate={newTaskCustomMonthDate}
            setNewRepeatValue={setNewTaskRepeatValue}
            setNewCustomMonthDate={setNewTaskCustomMonthDate}
          />
        ) : newTaskCategory === "weekly" ? (
          <WeeklyDialogContent
            newRepeatValue={newTaskRepeatValue}
            setNewRepeatValue={setNewTaskRepeatValue}
          />
        ) : newTaskCategory === "xdays" ? (
          <XdayDialogContent
            newRepeatValue={newTaskRepeatValue}
            setNewRepeatValue={setNewTaskRepeatValue}
          />
        ) : null}

        <DialogFooter>
          <Button
            onClick={taskType === "add" ? addTask : editTask}
            className="bg-[#00A3A3] hover:bg-[#00A3A3]"
            disabled={!isTaskValid}
          >
            {taskType === "add" ? "Add Task" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
