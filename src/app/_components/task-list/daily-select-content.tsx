import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dailyCountTotalEnum,
  type dailyCountTotalType,
} from "@/types/form-types";
import { type Dispatch, type SetStateAction } from "react";

type DailySelectContentProps = {
  newDailyCountTotal: dailyCountTotalType | null;
  setNewDailyCountTotal: Dispatch<SetStateAction<dailyCountTotalType | null>>;
};

export const DailySelectContent = ({
  newDailyCountTotal,
  setNewDailyCountTotal,
}: DailySelectContentProps) => {
  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          setNewDailyCountTotal(Number(value) as dailyCountTotalType);
        }}
        value={newDailyCountTotal?.toString() ?? undefined}
      >
        <SelectTrigger className="h-12 w-full text-white placeholder:text-gray-400">
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
    </div>
  );
};
