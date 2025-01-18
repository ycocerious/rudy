import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { theOnlyToastId } from "@/constants/uiConstants";
import { convertToIST } from "@/lib/utils/get-tasks-for-date";
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
  task: Omit<Task, "dailyCountFinished">;
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Reset form when originalTask changes
  useEffect(() => {
    if (taskType === "edit" && originalTask) {
      // Reset the form whenever originalTask changes
      reset({
        name: originalTask.name,
        category: originalTask.category,
        frequency: originalTask.frequency,
        dailyCountTotal: originalTask.dailyCountTotal,
        xValue: originalTask.xValue,
        startDate: originalTask.startDate,
        monthDays: originalTask.monthDays,
        weekDays: originalTask.weekDays,
      });
    }
  }, [originalTask, reset, taskType]);

  const category = watch("category");

  const frequency = watch("frequency");

  const handleAddSheetClose = () => {
    setIsSheetOpen(false);
    reset();
  };

  const handleEditSheetClose = () => {
    setIsSheetOpen(false);
    reset();
  };

  const utils = api.useUtils();

  const { mutateAsync: updateCompletion } =
    api.consistency.updateTodayCompletion.useMutation();

  const { mutateAsync: addTask } = api.task.addTask.useMutation({
    onMutate: () => {
      toast.loading("Adding task...", { id: theOnlyToastId });
      handleAddSheetClose();
    },
    onSuccess: async () => {
      await updateCompletion();
      await handleTaskStateChange(utils);
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await utils.task.getAllTasks.invalidate();
      toast.success("Added Task Successfully", { id: theOnlyToastId });
    },
  });

  const { mutateAsync: editTask } = api.task.editTask.useMutation({
    onMutate: () => {
      toast.loading("Saving changes...", { id: theOnlyToastId });
      handleEditSheetClose();
    },
    onSuccess: async () => {
      await updateCompletion();
      await handleTaskStateChange(utils);
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await utils.task.getAllTasks.invalidate();
      toast.success("Edited Task Successfully", { id: theOnlyToastId });
    },
  });

  const { mutateAsync: deleteTask } = api.task.deleteTask.useMutation({
    onMutate: () => {
      toast.loading("Deleting task...", { id: theOnlyToastId });
      handleEditSheetClose();
    },
    onSuccess: async () => {
      await updateCompletion();
      await handleTaskStateChange(utils);
      await utils.task.getTodaysTasks.invalidate();
      await utils.consistency.getCompletionData.invalidate();
      await utils.task.getAllTasks.invalidate();
      setIsSheetOpen(false);
      toast.success("Task Deleted Successfully", { id: theOnlyToastId });
    },
  });

  const onSubmit = async (data: FormValues) => {
    const adjustedDate = data.startDate ? convertToIST(data.startDate) : null;

    if (taskType === "add") {
      try {
        await addTask({
          name: data.name.trim(),
          frequency: data.frequency!,
          dailyCountTotal: data.dailyCountTotal,
          xValue: data.xValue,
          category: data.category!,
          startDate: adjustedDate,
          monthDays: data.monthDays,
          weekDays: data.weekDays,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to add task", { id: theOnlyToastId });
      }
    } else {
      try {
        await editTask({
          taskId: originalTask!.id,
          name: data.name.trim(),
          frequency: data.frequency!,
          dailyCountTotal: data.dailyCountTotal,
          xValue: data.xValue,
          category: data.category!,
          startDate: adjustedDate,
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

    // Only reset dependent fields when frequency changes
    if (frequency) {
      if (!originalTask || frequency !== originalTask.frequency) {
        setValue("xValue", null);
        setValue("startDate", null);
        setValue("weekDays", null);
        setValue("monthDays", null);
        setValue("dailyCountTotal", null);
      }
    }
  }, [frequency, setValue, originalTask]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isScrollable = container.scrollHeight > container.clientHeight;
    if (isScrollable) {
      container.scrollTop = container.scrollHeight;
    }
  }, [watch]);

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
        className="mx-auto flex max-h-[85vh] w-full max-w-[500px] flex-col rounded-t-2xl border-none bg-gray-200 px-4 [&>button]:absolute [&>button]:right-3 [&>button]:top-3 [&>button]:scale-150 [&>button]:text-gray-950 [&>button_svg]:font-bold"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-popover-foreground">
            {taskType === "add" ? "Add New Task" : `Edit Task`}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-1">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Name is required",
                    maxLength: {
                      value: 100,
                      message: "Name must be less than 100 characters",
                    },
                    validate: (value) => {
                      if (value.trim().length === 0)
                        return "Name cannot be empty";
                      if (!/^[\x00-\x7F]*$/.test(value))
                        return "Only ASCII characters are allowed";
                      return true;
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="Habit Name"
                        maxLength={100}
                        onChange={(e) => {
                          const value = e.target.value;
                          const capitalizedValue =
                            value.charAt(0).toUpperCase() + value.slice(1);
                          field.onChange(capitalizedValue);
                        }}
                        onFocus={(e) => {
                          e.preventDefault();
                          if (taskType === "edit") {
                            const input = e.target;
                            setTimeout(() => {
                              const length = input.value.length;
                              input.setSelectionRange(length, length);
                            }, 0);
                          }
                        }}
                        className="h-12 border-popover-foreground text-base font-medium text-popover-foreground placeholder:text-gray-400"
                      />
                      {error && (
                        <p className="text-sm text-destructive">
                          {error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="flex flex-col justify-center gap-2">
                    <p className="text-md font-medium text-black">Category:</p>
                    <div className="flex flex-wrap gap-[2%]">
                      {["sleep", "nutrition", "exercise"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            const newValue = field.value === cat ? null : cat;
                            field.onChange(newValue);
                            if (!newValue) {
                              setValue("frequency", null);
                            }
                          }}
                          className={`h-11 w-[31%] rounded-lg border text-sm font-medium text-primary-foreground ${
                            field.value === cat ? "bg-primary" : "bg-foreground"
                          }`}
                        >
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />

              {category && (
                <Controller
                  name="frequency"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <p className="text-md font-medium text-black">
                        Frequency:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {["daily", "weekly", "monthly", "xdays"].map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => {
                              field.onChange(
                                field.value === freq ? null : freq,
                              );
                            }}
                            className={`h-11 w-[23%] rounded-lg border text-sm font-medium text-primary-foreground ${
                              field.value === freq
                                ? "bg-primary"
                                : "bg-foreground"
                            }`}
                          >
                            {freq === "xdays"
                              ? "X Days"
                              : freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                />
              )}

              {frequency === "monthly" && (
                <MonthlySelectContent control={control} />
              )}
              {frequency === "weekly" && (
                <WeeklySelectContent control={control} />
              )}
              {frequency === "xdays" && (
                <XdaySelectContent
                  control={control}
                  originalTask={originalTask ?? undefined}
                />
              )}
              {frequency === "daily" && (
                <DailySelectContent control={control} />
              )}
            </div>
          </div>

          <SheetFooter className="flex w-full flex-shrink-0 flex-col items-end justify-end gap-2 py-4">
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
                    className="h-10 w-[35%] bg-[#09c3d2] font-medium text-accent-foreground hover:bg-primary"
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
                className="h-10 w-[35%] bg-[#09c3d2] font-medium text-accent-foreground hover:bg-primary"
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
