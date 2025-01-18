import { Calendar } from "@/components/ui/calendar";
import { areDatesEqual } from "@/lib/utils/referential-equality-checks";
import { type Task } from "@/types/task";
import { addDays, format, startOfDay } from "date-fns";
import { useMemo } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type XdaySelectContentProps = {
  control: Control<FormValues>;
  originalTask?: Omit<Task, "dailyCountFinished">;
};

const X_VALUES = [2, 3, 4, 5, 6] as const;

export const XdaySelectContent = ({
  control,
  originalTask,
}: XdaySelectContentProps) => {
  const xValue = useWatch<FormValues, "xValue">({
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
          <div className="flex flex-col gap-2">
            <p className="text-md font-medium text-black">Repeat Every:</p>
            <div className="flex flex-wrap gap-2">
              {X_VALUES.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    field.onChange(field.value === value ? null : value);
                  }}
                  className={`text-md h-11 w-[18%] rounded-lg border text-sm font-medium text-primary-foreground ${
                    field.value === value ? "bg-primary" : "bg-foreground"
                  }`}
                >
                  {value} days
                </button>
              ))}
            </div>
          </div>
        )}
      />

      {xValue && (
        <div className="w-[80%]">
          <p className="text-md ml-1 font-medium text-black">
            Select start date:
          </p>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                if (originalTask?.startDate && value) {
                  if (value !== startDate) {
                    const areDatesTheSame = areDatesEqual(
                      value,
                      originalTask.startDate,
                      {
                        ignoreTime: true,
                      },
                    );
                    return !areDatesTheSame;
                  }
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
        <p className="text-md text-black">
          Task will repeat every {xValue} days, starting from{" "}
          {format(startDate, "MMMM d, yyyy")}
        </p>
      )}
    </div>
  );
};
