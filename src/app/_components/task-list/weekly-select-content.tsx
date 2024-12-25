import { weekDaysEnum } from "@/types/form-types";
import { type Control, Controller, useWatch } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type WeeklySelectContentProps = {
  control: Control<FormValues>;
};

export const WeeklySelectContent = ({ control }: WeeklySelectContentProps) => {
  const weekDays = useWatch({
    control,
    name: "weekDays",
  });

  return (
    <>
      <Controller
        name="weekDays"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field }) => (
          <div className="mt-4">
            <p className="ml-1 text-popover-foreground">Select days:</p>
            <div className="flex flex-wrap">
              {weekDaysEnum.map((day) => (
                <button
                  type="button"
                  key={day}
                  onClick={() => {
                    const currentValue = field.value! ?? [];
                    if (currentValue.includes(day)) {
                      field.onChange(
                        currentValue.filter((d: string) => d !== day),
                      );
                    } else {
                      field.onChange([...currentValue, day]);
                    }
                  }}
                  className={`m-1 h-10 w-24 rounded-lg border text-sm text-primary-foreground ${
                    weekDays?.includes(day) ? "bg-primary" : "bg-foreground"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      />
    </>
  );
};
