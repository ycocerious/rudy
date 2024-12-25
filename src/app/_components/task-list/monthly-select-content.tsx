import { type Control, Controller, useWatch } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type MonthlySelectContentProps = {
  control: Control<FormValues>;
};

export const MonthlySelectContent = ({
  control,
}: MonthlySelectContentProps) => {
  const monthDays = useWatch({
    control,
    name: "monthDays",
  });

  return (
    <Controller
      name="monthDays"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <div>
          <p className="mb-2 ml-1 text-popover-foreground">
            Select dates for monthly repetition:
          </p>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <button
                type="button"
                key={day}
                onClick={() => {
                  const currentValue = field.value ?? [];
                  if (currentValue.includes(day)) {
                    field.onChange(currentValue.filter((d) => d !== day));
                  } else {
                    field.onChange([...currentValue, day]);
                  }
                }}
                className={`h-9 w-9 rounded-lg border text-primary-foreground ${
                  monthDays?.includes(day) ? "bg-primary" : "bg-foreground"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
};
