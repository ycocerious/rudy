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
import { theOnlyToastId } from "@/constants/uiConstants";
import { api } from "@/trpc/react";
import {
  type taskCategoryType,
  type taskFrequencyType,
  type weekDaysType,
} from "@/types/form-types";
import { type Task } from "@/types/task";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { DailySelectContent } from "./daily-select-content";
import { MonthlySelectContent } from "./monthly-select-content";
import { WeeklySelectContent } from "./weekly-select-content";
import { XdaySelectContent } from "./xday-select-content";

type BaseAddOrEditTaskSheetProps = {
  isSheetOpen: boolean;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
};

type AddTaskSheetProps = BaseAddOrEditTaskSheetProps & {
  taskType: "add";
};

type EditTaskSheetProps = BaseAddOrEditTaskSheetProps & {
  taskType: "edit";
  task: Task;
};

type AddOrEditTaskSheetProps = AddTaskSheetProps | EditTaskSheetProps;

export type FormValues = {
  name: string;
  frequency: taskFrequencyType | null;
  category: taskCategoryType | null;
  dailyCountTotal: number | null;
  xValue: number | null;
  startDate: Date | null;
  weekDays: weekDaysType[] | null;
  monthDays: number[] | null;
};

export const AddOrEditTaskSheet = (props: AddOrEditTaskSheetProps) => {
  const { isSheetOpen, setIsSheetOpen, taskType } = props;
  const originalTask = taskType === "edit" ? props.task : null;
  const isFirstRender = useRef(true);
  const [isTaskOperationComplete, setIsTaskOperationComplete] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      name: originalTask?.name ?? "",
      category: originalTask?.category ?? null,
      frequency: originalTask?.frequency ?? null,
      dailyCountTotal: originalTask?.dailyCountTotal ?? null,
      xValue: originalTask?.xValue ?? null,
      startDate: originalTask?.startDate ?? null,
      monthDays: originalTask?.monthDays ?? null,
      weekDays: originalTask?.weekDays ?? null,
    },
  });

  const category = watch("category");

  const frequency = watch("frequency");

  const handleAddSheetClose = () => {
    setIsSheetOpen(false);
    reset();
  };

  const handleEditSheetClose = () => {
    setIsSheetOpen(false);
    reset({
      name: originalTask?.name ?? "",
      category: originalTask?.category ?? null,
      frequency: originalTask?.frequency ?? null,
      dailyCountTotal: originalTask?.dailyCountTotal ?? null,
      xValue: originalTask?.xValue ?? null,
      startDate: originalTask?.startDate ?? null,
      monthDays: originalTask?.monthDays ?? null,
      weekDays: originalTask?.weekDays ?? null,
    });
  };

  const utils = api.useUtils();
  const { mutateAsync: addTask } = api.task.addTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTodaysTasks.invalidate();
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (taskType === "add") {
      try {
        await addTask({
          name: data.name.trim(),
          frequency: data.frequency!,
          dailyCountTotal: data.dailyCountTotal,
          xValue: data.xValue,
          category: data.category!,
          startDate: data.startDate,
          monthDays: data.monthDays,
          weekDays: data.weekDays,
        });
        setIsTaskOperationComplete(true);
      } catch (error) {
        toast.error("Failed to add task", { id: theOnlyToastId });
      }
    } else {
      setIsTaskOperationComplete(true);
    }
  };

  const isTaskValid = isValid && (taskType === "add" || isDirty);

  useEffect(() => {
    if (isTaskOperationComplete) {
      if (taskType === "add") {
        handleAddSheetClose();
        toast.success("Added Task Successfully", { id: theOnlyToastId });
      } else {
        handleEditSheetClose();
        toast.success("Edited Task Successfully", { id: theOnlyToastId });
      }
      setIsTaskOperationComplete(false);
    }
  }, [isTaskOperationComplete, taskType]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only reset when frequency actually changes, not just when form becomes dirty
    if (frequency && frequency !== originalTask?.frequency) {
      setValue("xValue", null);
      setValue("startDate", null);
      setValue("weekDays", null);
      setValue("monthDays", null);
      setValue("dailyCountTotal", null);
    }
  }, [frequency, setValue, originalTask?.frequency]);

  return (
    <Dialog
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
      <DialogContent className="mx-auto max-w-[90%] space-y-4 rounded-xl border-none bg-card px-4 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {taskType === "add"
              ? "Add New Task"
              : `Edit Task: ${originalTask?.name}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
              maxLength: 15,
              validate: (value) => {
                if (value.trim().length === 0) return false;
                return /^[\x00-\x7F]*$/.test(value);
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Task name (max 15 chars)"
                maxLength={15}
                autoFocus={taskType === "edit"}
                onFocus={(e) => {
                  // Prevent the default focus behavior
                  e.preventDefault();
                  if (taskType === "edit") {
                    const input = e.target;
                    // Small delay to ensure DOM is ready
                    setTimeout(() => {
                      const length = input.value.length;
                      input.setSelectionRange(length, length);
                    }, 0);
                  }
                }}
                className="h-12"
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value ?? undefined}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select Task Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          {category && (
            <Controller
              name="frequency"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? undefined}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select Repetition frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Repeat daily</SelectItem>
                    <SelectItem value="weekly">Repeat weekly</SelectItem>
                    <SelectItem value="monthly">Repeat monthly</SelectItem>
                    <SelectItem value="xdays">Repeat x days once</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          )}

          {frequency === "monthly" && (
            <MonthlySelectContent control={control} />
          )}
          {frequency === "weekly" && <WeeklySelectContent control={control} />}
          {frequency === "xdays" && (
            <XdaySelectContent
              control={control}
              originalTask={originalTask ?? undefined}
            />
          )}
          {frequency === "daily" && <DailySelectContent control={control} />}

          <DialogFooter>
            <Button
              type="submit"
              className="bg-primary text-accent-foreground hover:bg-primary"
              disabled={!isTaskValid}
            >
              {taskType === "add" ? "Add Task" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
