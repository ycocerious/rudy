import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { areDatesEqual } from "@/lib/utils/referential-equality-checks";
import { type Task } from "@/types/task";
import { addDays, format, startOfDay } from "date-fns";
import { useMemo } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type XdaySelectContentProps = {
  control: Control<FormValues>;
  originalTask?: Task;
};

const X_VALUES = [2, 3, 4, 5, 6] as const;

export const XdaySelectContent = ({
  control,
  originalTask,
}: XdaySelectContentProps) => {
  const xValue = useWatch<FormValues, "xValue">({
    control,
    name: "xValue",
    defaultValue: undefined,
  }) as number | undefined;
  const startDate = useWatch({
    control,
    name: "startDate",
  });

  const today = useMemo(() => startOfDay(new Date()), []);
  const oneWeekFromToday = useMemo(() => addDays(today, 6), [today]);

  const isDateDisabled = (date: Date) => {
    return date < today || date > oneWeekFromToday;
  };

  return (
    <div className="space-y-4">
      <Controller
        name="xValue"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={String(field.value ?? "")}
          >
            <SelectTrigger className="h-12 w-full border-popover-foreground text-popover-foreground">
              <SelectValue placeholder="Select value of x" />
            </SelectTrigger>
            <SelectContent>
              {X_VALUES.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  Every {value} days
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {xValue && (
        <div className="w-[70%]">
          <p className="ml-1 text-sm text-popover-foreground">
            Select start date:
          </p>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                // If we're in edit mode and this field is being changed
                if (originalTask?.startDate && value) {
                  // Only validate if the startDate field is actually being modified
                  if (value !== startDate) {
                    const areDatesTheSame = areDatesEqual(
                      value,
                      originalTask.startDate,
                      {
                        ignoreTime: true,
                      },
                    );
                    // const isXValueSame = xValue === originalTask.xValue;

                    return !areDatesTheSame;
                  }
                }
                // If we're not changing this field, always return true
                return true;
              },
            }}
            render={({ field }) => (
              <Calendar
                mode="single"
                selected={field.value ?? undefined}
                onSelect={field.onChange}
                disabled={isDateDisabled}
                initialFocus
              />
            )}
          />
        </div>
      )}

      {xValue && startDate && today <= startDate && (
        <p className="ml-1 text-sm text-popover-foreground">
          Task will repeat every {xValue} days, starting from{" "}
          {format(startDate, "MMMM d, yyyy")}
        </p>
      )}
    </div>
  );
};
