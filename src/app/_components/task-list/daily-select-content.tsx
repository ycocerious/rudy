import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dailyCountTotalEnum } from "@/types/form-types";
import { type Control, Controller } from "react-hook-form";

type DailySelectContentProps = {
  control: Control<any>;
};

export const DailySelectContent = ({ control }: DailySelectContentProps) => {
  return (
    <div className="space-y-4">
      <Controller
        name="dailyCountTotal"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            value={field.value?.toString()}
          >
            <SelectTrigger className="h-12 w-full">
              <SelectValue placeholder="How many times a day?" />
            </SelectTrigger>
            <SelectContent>
              {dailyCountTotalEnum.map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value === 1 ? "once" : `${value} times`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
