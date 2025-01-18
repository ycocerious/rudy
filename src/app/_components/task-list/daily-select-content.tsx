import { type Control, Controller } from "react-hook-form";
import { type FormValues } from "./add-or-edit-task-sheet";

type DailySelectContentProps = {
  control: Control<FormValues>;
};

export const DailySelectContent = ({ control }: DailySelectContentProps) => {
  const dailyOptions = [1, 2, 3, 4, 5];

  return (
    <Controller
      name="dailyCountTotal"
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <p className="text-md font-medium text-black">Times per day:</p>
          <div className="flex flex-wrap gap-2">
            {dailyOptions.map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => {
                  field.onChange(field.value === value ? null : value);
                }}
                className={`h-11 w-[18%] rounded-lg border text-sm font-medium text-primary-foreground ${
                  field.value === value ? "bg-primary" : "bg-foreground"
                }`}
              >
                {value === 1 ? "Once" : `${value} times`}
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
};
