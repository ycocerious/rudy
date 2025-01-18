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
          <p className="text-md mb-2 font-medium text-black">Select Dates:</p>
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
                className={`text-md h-10 w-10 rounded-lg border font-medium text-primary-foreground ${
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
