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
  const [newName, setNewName] = useState(originalTask?.name ?? "");
  const [newCategory, setNewCategory] = useState<taskCategoryType | null>(
    originalTask?.category ?? null,
  );

  const [newXValue, setNewXValue] = useState<xValueType | null>(
    originalTask?.xValue ?? null,
  );
  const [newStartDate, setNewStartDate] = useState<Date | null>(
    originalTask?.startDate ?? null,
  );

  const [newRepeatFrequency, setNewRepeatFrequency] =
    useState<repeatFrequencyType | null>(originalTask?.repeatFrequency ?? null);
  const [newRepeatDays, setNewRepeatDays] = useState<
    weekDaysType[] | monthDaysType[] | null
  >(originalTask?.repeatDays ?? null);

  const handleAddSheetClose = () => {
    setIsSheetOpen(false);
    setNewName("");
    setNewCategory(null);
    setNewXValue(null);
    setNewStartDate(null);
    setNewRepeatFrequency(null);
    setNewRepeatDays(null);
  };

  const handleEditSheetClose = () => {
    setIsSheetOpen(false);
    setNewName(originalTask?.name ?? "");
    setNewCategory(originalTask?.category ?? null);
    setNewXValue(originalTask?.xValue ?? null);
    setNewStartDate(originalTask?.startDate ?? null);
    setNewRepeatFrequency(originalTask?.repeatFrequency ?? null);
    setNewRepeatDays(originalTask?.repeatDays ?? null);
  };

  const hasChanges = useMemo(() => {
    if (taskType === "add") return true;
    if (!originalTask) return false;

    return (
      newName !== originalTask.name ||
      newCategory !== originalTask.category ||
      newXValue !== originalTask.xValue ||
      newStartDate !== originalTask.startDate ||
      newRepeatFrequency !== originalTask.repeatFrequency ||
      newRepeatDays !== originalTask.repeatDays
    );
  }, [
    taskType,
    originalTask,
    newName,
    newCategory,
    newXValue,
    newStartDate,
    newRepeatFrequency,
    newRepeatDays,
  ]);

  const isTaskValid: boolean = useMemo<boolean>(() => {
    const isValidBasicTask = newName.trim() && newCategory;
    if (!isValidBasicTask) return false;
    if (taskType === "edit" && !hasChanges) return false;

    if (newCategory === "daily") {
      return true;
    }

    if (newCategory === "xdays" && (!newXValue || !newStartDate)) {
      return false;
    }

    if (
      (newCategory === "weekly" || newCategory === "monthly") &&
      (!newRepeatFrequency || newRepeatDays?.length !== newRepeatFrequency)
    ) {
      return false;
    }

    return true;
  }, [
    newName,
    newCategory,
    taskType,
    hasChanges,
    newXValue,
    newStartDate,
    newRepeatFrequency,
    newRepeatDays,
  ]);

  const addTask = () => {
    if (!isTaskValid) return;

    const newTask: Task = {
      id: nanoid(),
      name: newName.trim(),
      category: newCategory!,
      xValue: newXValue ?? undefined,
      startDate: newStartDate ?? undefined,
      repeatFrequency: newRepeatFrequency ?? undefined,
      repeatDays: newRepeatDays ?? undefined,
    };

    setTasks((prevTasks) => sortTasks([...prevTasks, newTask]));
    handleAddSheetClose();
    toast.success("Added Task Successfully", { id: theOnlyToastId });
  };

  const editTask = () => {
    if (!isTaskValid || taskType !== "edit") return;

    setTasks((prevTasks) => {
      const newTasks = prevTasks.map((individualTask) =>
        individualTask.id === originalTask?.id
          ? {
              ...individualTask,
              name: newName,
              category: newCategory!,
              xValue: newXValue ?? undefined,
              startDate: newStartDate ?? undefined,
              repeatFrequency: newRepeatFrequency ?? undefined,
              repeatDays: newRepeatDays ?? undefined,
            }
          : individualTask,
      );
      return sortTasks(newTasks);
    });

    handleEditSheetClose();
    toast.success("Edited Task Successfully", { id: theOnlyToastId });
  };

  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (taskType === "add") {
            handleAddSheetClose();
          } else {
            handleEditSheetClose();
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
            value={newName}
            onChange={(e) => {
              const input = e.target.value;
              if (input.length <= 15) {
                setNewName(input);
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
          value={newCategory ?? undefined}
          onValueChange={(value: taskCategoryType) => {
            setNewCategory(value);
            setNewXValue(null);
            setNewStartDate(null);
            setNewRepeatFrequency(null);
            setNewRepeatDays(null);
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

        {newCategory && newCategory === "monthly" ? (
          <MonthlySelectContent
            newRepeatFrequency={newRepeatFrequency}
            newRepeatDays={newRepeatDays as monthDaysType[]}
            setNewRepeatFrequency={setNewRepeatFrequency}
            setNewRepeatDays={
              setNewRepeatDays as Dispatch<
                SetStateAction<monthDaysType[] | null>
              >
            }
          />
        ) : newCategory === "weekly" ? (
          <WeeklySelectContent
            newRepeatFrequency={newRepeatFrequency}
            newRepeatDays={newRepeatDays as weekDaysType[]}
            setNewRepeatFrequency={setNewRepeatFrequency}
            setNewRepeatDays={
              setNewRepeatDays as Dispatch<
                SetStateAction<weekDaysType[] | null>
              >
            }
          />
        ) : newCategory === "xdays" ? (
          <XdaySelectContent
            newXValue={newXValue}
            newStartDate={newStartDate}
            setNewXValue={setNewXValue}
            setNewStartDate={setNewStartDate}
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
