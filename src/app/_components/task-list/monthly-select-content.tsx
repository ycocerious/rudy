import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  customMonthDayEnum,
  repeatFrequencyEnum,
  type monthDaysType,
} from "@/types/form-types";
import { useEffect, useState } from "react";
import { type Control, Controller, useWatch } from "react-hook-form";

type MonthlySelectContentProps = {
  control: Control<any>;
};

export const MonthlySelectContent = ({
  control,
}: MonthlySelectContentProps) => {
  const repeatFrequency = useWatch({
    control,
    name: "repeatFrequency",
  });
  const repeatDays = useWatch({
    control,
    name: "repeatDays",
  });

  const initialOptions: [monthDaysType, string][] = [
    ["1st", "First of every month"],
    ["last-date", "Last of every month"],
    ["1st-wknd", "First weekend of the month"],
    ["last-wknd", "Last weekend of the month"],
  ];

  // Create a Set of initial option values for easier checking
  const initialOptionValues = new Set(initialOptions.map(([value]) => value));

  // Check if any selected day is a custom day (not in initialOptions)
  const hasCustomDays = repeatDays?.some(
    (day: string) => !initialOptionValues.has(day as monthDaysType),
  );

  const [showCustom, setShowCustom] = useState(!!hasCustomDays);

  useEffect(() => {
    if (repeatFrequency === null) {
      setShowCustom(false);
    }
  }, [repeatFrequency]);

  // Update showCustom when repeatDays changes
  useEffect(() => {
    if (
      repeatDays?.some(
        (day: string) => !initialOptionValues.has(day as monthDaysType),
      )
    ) {
      setShowCustom(true);
    }
  }, [repeatDays]);

  return (
    <>
      <Controller
        name="repeatFrequency"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value?.toString()}
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="Select repetition frequency" />
            </SelectTrigger>
            <SelectContent>
              {repeatFrequencyEnum.map((freq) => (
                <SelectItem key={freq} value={freq.toString()}>
                  {freq} time{freq > 1 ? "s" : ""} a month
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
                Select {repeatFrequency} option
                {repeatFrequency > 1 ? "s" : ""}:
              </p>
              {initialOptions.map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => {
                    const currentValue = field.value || [];
                    if (currentValue.includes(value)) {
                      field.onChange(
                        currentValue.filter((d: string) => d !== value),
                      );
                    } else if (currentValue.length < repeatFrequency) {
                      field.onChange([...currentValue, value]);
                    } else {
                      field.onChange([...currentValue.slice(0, -1), value]);
                    }
                  }}
                  className={`m-1 rounded-lg border p-2 text-sm text-primary-foreground ${
                    repeatDays?.includes(value) ? "bg-primary" : "bg-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowCustom(!showCustom)}
                className={`m-1 rounded-lg border p-2 text-sm text-primary-foreground ${
                  showCustom ? "bg-primary" : "bg-foreground"
                }`}
              >
                Custom Dates
              </button>
              {showCustom && (
                <div className="mt-0 flex flex-wrap">
                  {customMonthDayEnum.map((day) => {
                    const dayNumber = day.replace(/[^\d]/g, "");
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => {
                          const currentValue = field.value || [];
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
                        className={`m-1 h-9 w-9 rounded-lg border text-primary-foreground ${
                          repeatDays?.includes(day as monthDaysType)
                            ? "bg-primary"
                            : "bg-foreground"
                        }`}
                      >
                        {dayNumber}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        />
      )}
    </>
  );
};
