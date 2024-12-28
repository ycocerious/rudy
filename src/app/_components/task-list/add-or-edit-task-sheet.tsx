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
import { handleTaskStateChange } from "@/lib/utils/task-mutations";
import { api } from "@/trpc/react";
import {
  type taskCategoryType,
  type taskFrequencyType,
  type weekDaysType,
} from "@/types/form-types";
import { type Task } from "@/types/task";
import { Trash2 } from "lucide-react";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const { mutateAsync: calculateCompletion } =
    api.consistency.calculateTodayCompletion.useMutation();

  const { mutateAsync: addTask } = api.task.addTask.useMutation({
    onSuccess: async () => {
      await calculateCompletion();
      await handleTaskStateChange(utils);
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await utils.task.getAllTasks.invalidate();
      handleAddSheetClose();
      toast.success("Added Task Successfully", { id: theOnlyToastId });
    },
  });

  const { mutateAsync: editTask } = api.task.editTask.useMutation({
    onSuccess: async () => {
      await calculateCompletion();
      await handleTaskStateChange(utils);
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await utils.task.getAllTasks.invalidate();
      handleEditSheetClose();
      toast.success("Edited Task Successfully", { id: theOnlyToastId });
    },
  });

  const { mutateAsync: deleteTask } = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      await calculateCompletion();
      await handleTaskStateChange(utils);
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await utils.task.getAllTasks.invalidate();
      setIsSheetOpen(false);
      toast.success("Task Deleted Successfully", { id: theOnlyToastId });
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (taskType === "add") {
      toast.loading("Adding task...", { id: theOnlyToastId });
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
      } catch (error) {
        console.error(error);
        toast.error("Failed to add task", { id: theOnlyToastId });
      }
    } else {
      toast.loading("Saving changes...", { id: theOnlyToastId });
      try {
        await editTask({
          taskId: originalTask!.id,
          name: data.name.trim(),
          frequency: data.frequency!,
          dailyCountTotal: data.dailyCountTotal,
          xValue: data.xValue,
          category: data.category!,
          startDate: data.startDate,
          monthDays: data.monthDays,
          weekDays: data.weekDays,
        });
      } catch (error) {
        toast.error("Failed to edit task", { id: theOnlyToastId });
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    if (taskType === "edit" && originalTask) {
      toast.loading("Deleting task...", { id: theOnlyToastId });
      try {
        await deleteTask(originalTask.id);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete task", { id: theOnlyToastId });
      }
    }
  };

  const isTaskValid = isValid && (taskType === "add" || isDirty);

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
        className="mx-auto h-auto w-full max-w-[500px] space-y-4 rounded-t-2xl border-none bg-gray-200 px-4 [&>button]:absolute [&>button]:right-3 [&>button]:top-3 [&>button]:scale-150 [&>button]:text-gray-950 [&>button_svg]:font-bold"
      >
        <SheetHeader>
          <SheetTitle className="text-popover-foreground">
            {taskType === "add"
              ? "Add New Task"
              : `Edit Task: ${originalTask?.name}`}
          </SheetTitle>
        </SheetHeader>

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
                placeholder="Name (max 25 chars)"
                maxLength={25}
                autoFocus={taskType === "edit"}
                onChange={(e) => {
                  const value = e.target.value;
                  const capitalizedValue =
                    value.charAt(0).toUpperCase() + value.slice(1);
                  field.onChange(capitalizedValue);
                }}
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
                className="h-12 border-popover-foreground text-popover-foreground placeholder:text-gray-950"
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
                <SelectTrigger className="h-12 w-full border-popover-foreground text-popover-foreground">
                  <SelectValue placeholder="Category" />
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
                  <SelectTrigger className="h-12 w-full border-popover-foreground text-popover-foreground">
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

          <SheetFooter className="flex w-full flex-col items-end justify-end gap-2">
            {taskType === "edit" && (
              <>
                <div className="flex w-full flex-row items-center justify-end gap-2">
                  {!showDeleteConfirm && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-[14%] border-destructive bg-destructive/10 text-destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="w-[35%] bg-[#09c3d2] text-accent-foreground hover:bg-primary"
                    disabled={!isTaskValid}
                  >
                    Save
                  </Button>
                </div>
                {showDeleteConfirm && (
                  <div className="flex w-full flex-col items-end">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete this task?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="text-md w-15 h-7 text-muted-foreground"
                      >
                        No
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleDelete}
                        className="text-md w-15 h-7 text-destructive"
                      >
                        Yes
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
            {taskType === "add" && (
              <Button
                type="submit"
                className="w-[35%] bg-[#09c3d2] text-accent-foreground hover:bg-primary"
                disabled={!isTaskValid}
              >
                Add Task
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
