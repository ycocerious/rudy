import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  repeatFrequencyEnum,
  weekDaysEnum,
  type weekDaysType,
} from "@/types/form-types";
import { type Control, Controller, useWatch } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type WeeklySelectContentProps = {
  control: Control<FormValues>;
};

export const WeeklySelectContent = ({ control }: WeeklySelectContentProps) => {
  const repeatFrequency = useWatch({
    control,
    name: "repeatFrequency",
  });
  const repeatDays = useWatch({
    control,
    name: "repeatDays",
  }) as weekDaysType[] | null;

  return (
    <>
      <Controller
        name="repeatFrequency"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            onValueChange={(value) =>
              field.onChange(value ? Number(value) : null)
            }
            value={field.value?.toString() ?? ""}
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select repetition frequency" />
            </SelectTrigger>
            <SelectContent>
              {repeatFrequencyEnum.map((freq) => (
                <SelectItem key={freq} value={freq.toString()}>
                  {freq} time{freq > 1 ? "s" : ""} a week
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {repeatFrequency && (
        <Controller
          name="repeatDays"
          control={control}
          rules={{
            required: true,
            validate: (value) =>
              Array.isArray(value) && value.length === repeatFrequency,
          }}
          render={({ field }) => (
            <div className="mt-4">
              <p className="ml-1">
                Select {repeatFrequency} day
                {repeatFrequency > 1 ? "s" : ""}:
              </p>
              <div className="flex flex-wrap">
                {weekDaysEnum.map((day) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => {
                      const currentValue =
                        (field.value as weekDaysType[]) ?? [];
                      if (currentValue.includes(day)) {
                        field.onChange(
                          currentValue.filter((d: string) => d !== day),
                        );
                      } else if (currentValue.length < repeatFrequency) {
                        field.onChange([...currentValue, day]);
                      } else {
                        field.onChange([...currentValue.slice(0, -1), day]);
                      }
                    }}
                    className={`m-1 h-10 w-24 rounded-lg border text-sm text-primary-foreground ${
                      repeatDays?.includes(day) ? "bg-primary" : "bg-foreground"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}
        />
      )}
    </>
  );
};
