import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { areDatesEqual } from "@/lib/utils/referential-equality-checks";
import { xValueEnum } from "@/types/form-types";
import { type Task } from "@/types/task";
import { addDays, format, startOfDay } from "date-fns";
import { useMemo } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type XdaySelectContentProps = {
  control: Control<FormValues>;
  originalTask?: Task;
};

export const XdaySelectContent = ({
  control,
  originalTask,
}: XdaySelectContentProps) => {
  const xValue = useWatch({
    control,
    name: "xValue",
  });
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
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value?.toString()}
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select value of x" />
            </SelectTrigger>
            <SelectContent>
              {xValueEnum.map((value) => (
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
          <p className="ml-1 text-sm">Select start date:</p>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                // If we're in edit mode and the dates are same, consider it not changed
                if (originalTask?.startDate) {
                  return !areDatesEqual(value, originalTask.startDate, {
                    ignoreTime: true,
                  });
                }
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
        <p className="ml-1 text-sm">
          Task will repeat every {xValue} days, starting from{" "}
          {format(startDate, "MMMM d, yyyy")}
        </p>
      )}
    </div>
  );
};
