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
import { theOnlyToastId } from "@/constants/uiConstants";
import { sortTasks } from "@/lib/utils/sort-tasks";
import {
  repeatFrequencyType,
  xValueType,
  type monthDaysType,
  type taskCategoryType,
  type weekDaysType,
} from "@/types/form-types";
import { type Task } from "@/types/task";
import { nanoid } from "nanoid";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
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
  const { isSheetOpen, setIsSheetOpen, setTasks, taskType } = props;

  const originalTask = taskType === "edit" ? props.task : null;
  const [newTaskName, setNewTaskName] = useState(originalTask?.name ?? "");
  const [newTaskCategory, setNewTaskCategory] =
    useState<taskCategoryType | null>(originalTask?.category ?? null);

  const [newTaskXValue, setNewTaskXValue] = useState<xValueType | null>(
    originalTask?.xValue ?? null,
  );
  const [newTaskStartDate, setNewTaskStartDate] = useState<Date | null>(
    originalTask?.startDate ?? null,
  );

  const [newTaskRepeatFrequency, setNewTaskRepeatFrequency] =
    useState<repeatFrequencyType | null>(originalTask?.repeatFrequency ?? null);
  const [newTaskRepeatDays, setNewTaskRepeatDays] = useState<
    weekDaysType[] | monthDaysType[] | null
  >(originalTask?.repeatDays ?? null);

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setNewTaskName("");
    setNewTaskCategory(null);
    setNewTaskXValue(null);
    setNewTaskStartDate(null);
    setNewTaskRepeatFrequency(null);
    setNewTaskRepeatDays(null);
  };

  const hasChanges = useMemo(() => {
    if (taskType === "add") return true;
    if (!originalTask) return false;

    return (
      newTaskName !== originalTask.name ||
      newTaskCategory !== originalTask.category ||
      newTaskXValue !== originalTask.xValue ||
      newTaskStartDate !== originalTask.startDate ||
      newTaskRepeatFrequency !== originalTask.repeatFrequency ||
      newTaskRepeatDays !== originalTask.repeatDays
    );
  }, [
    taskType,
    originalTask,
    newTaskName,
    newTaskCategory,
    newTaskXValue,
    newTaskStartDate,
    newTaskRepeatFrequency,
    newTaskRepeatDays,
  ]);

  const isTaskValid: boolean = useMemo<boolean>(() => {
    const isValidBasicTask = newTaskName.trim() && newTaskCategory;
    if (!isValidBasicTask) return false;
    if (taskType === "edit" && !hasChanges) return false;

    if (newTaskCategory === "daily") {
      return true;
    }

    if (newTaskCategory === "xdays" && (!newTaskXValue || !newTaskStartDate)) {
      return false;
    }

    if (
      (newTaskCategory === "weekly" || newTaskCategory === "monthly") &&
      (!newTaskRepeatFrequency ||
        newTaskRepeatDays?.length !== newTaskRepeatFrequency)
    ) {
      return false;
    }

    return true;
  }, [
    newTaskName,
    newTaskCategory,
    taskType,
    hasChanges,
    newTaskXValue,
    newTaskStartDate,
    newTaskRepeatFrequency,
    newTaskRepeatDays,
  ]);

  const addTask = () => {
    if (!isTaskValid) return;

    const newTask: Task = {
      id: nanoid(),
      name: newTaskName.trim(),
      category: newTaskCategory!,
      xValue: newTaskXValue ?? undefined,
      startDate: newTaskStartDate ?? undefined,
      repeatFrequency: newTaskRepeatFrequency ?? undefined,
      repeatDays: newTaskRepeatDays ?? undefined,
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
              name: newTaskName,
              category: newTaskCategory!,
              xValue: newTaskXValue ?? undefined,
              startDate: newTaskStartDate ?? undefined,
              repeatFrequency: newTaskRepeatFrequency ?? undefined,
              repeatDays: newTaskRepeatDays ?? undefined,
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
            setNewTaskName(originalTask?.name ?? "");
            setNewTaskCategory(originalTask?.category ?? null);
            setNewTaskXValue(originalTask?.xValue ?? null);
            setNewTaskStartDate(originalTask?.startDate ?? null);
            setNewTaskRepeatFrequency(originalTask?.repeatFrequency ?? null);
            setNewTaskRepeatDays(originalTask?.repeatDays ?? null);
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
              : `Edit Task: ${originalTask?.name}`}
          </SheetTitle>
        </SheetHeader>

        <div>
          <Input
            value={newTaskName}
            onChange={(e) => {
              const input = e.target.value;
              if (input.length <= 15) {
                setNewTaskName(input);
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
            className="placeholder:text-black"
          />
        </div>

        <Select
          value={newTaskCategory ?? undefined}
          onValueChange={(value: taskCategoryType) => {
            setNewTaskCategory(value);
            setNewTaskXValue(null);
            setNewTaskStartDate(null);
            setNewTaskRepeatFrequency(null);
            setNewTaskRepeatDays(null);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Repetition duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Repeat daily</SelectItem>
            <SelectItem value="weekly">Repeat weekly</SelectItem>
            <SelectItem value="monthly">Repeat monthly</SelectItem>
            <SelectItem value="xdays">Repeat x days once</SelectItem>
          </SelectContent>
        </Select>

        {newTaskCategory && newTaskCategory === "monthly" ? (
          <MonthlySelectContent
            newTaskRepeatFrequency={newTaskRepeatFrequency}
            newTaskRepeatDays={newTaskRepeatDays as monthDaysType[]}
            setNewTaskRepeatFrequency={setNewTaskRepeatFrequency}
            setNewTaskRepeatDays={
              setNewTaskRepeatDays as Dispatch<
                SetStateAction<monthDaysType[] | null>
              >
            }
          />
        ) : newTaskCategory === "weekly" ? (
          <WeeklySelectContent
            newTaskRepeatFrequency={newTaskRepeatFrequency}
            newTaskRepeatDays={newTaskRepeatDays as weekDaysType[]}
            setNewTaskRepeatFrequency={setNewTaskRepeatFrequency}
            setNewTaskRepeatDays={
              setNewTaskRepeatDays as Dispatch<
                SetStateAction<weekDaysType[] | null>
              >
            }
          />
        ) : newTaskCategory === "xdays" ? (
          <XdaySelectContent
            newTaskXValue={newTaskXValue}
            newTaskStartDate={newTaskStartDate}
            setNewTaskXValue={setNewTaskXValue}
            setNewTaskStartDate={setNewTaskStartDate}
          />
        ) : null}
        {/* // ) : newTaskCategory === "weekly" ? (
        //   <WeeklySelectContent
        //     newRepeatValue={newTaskRepeatValue}
        //     setNewRepeatValue={setNewTaskRepeatValue}
        //   />
        // ) : newTaskCategory === "xdays" ? (
        //   <XdaySelectContent
        //     newRepeatValue={newTaskRepeatValue}
        //     setNewRepeatValue={setNewTaskRepeatValue}
        //   />
        // ) : null} */}

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
