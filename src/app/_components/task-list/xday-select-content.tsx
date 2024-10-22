import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { xValueEnum, type xValueType } from "@/types/form-types";
import { addDays, format, startOfDay } from "date-fns";
import React, { useMemo, type Dispatch, type SetStateAction } from "react";

type XdaySelectContentProps = {
  newXValue: xValueType | null;
  setNewXValue: Dispatch<SetStateAction<xValueType | null>>;
  newStartDate: Date | null;
  setNewStartDate: Dispatch<SetStateAction<Date | null>>;
};

export const XdaySelectContent: React.FC<XdaySelectContentProps> = ({
  newXValue,
  setNewXValue,
  newStartDate,
  setNewStartDate,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const oneWeekFromToday = useMemo(() => addDays(today, 6), [today]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewStartDate(date);
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < today || date > oneWeekFromToday;
  };

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          setNewXValue(Number(value) as xValueType);
          // setNewStartDate(null); // Reset start date when x-value changes
        }}
        value={newXValue?.toString() ?? undefined}
      >
        <SelectTrigger className="h-12 w-full text-white placeholder:text-gray-400">
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

      {newXValue !== null && (
        <div className="w-[70%]">
          <p className="ml-1 text-sm text-white">Select start date:</p>
          <Calendar
            mode="single"
            selected={newStartDate ?? undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
          />
        </div>
      )}

      {newXValue && newStartDate && today <= newStartDate && (
        <p className="ml-1 text-sm text-white">
          Task will repeat every {newXValue} days, starting from{" "}
          {format(newStartDate, "MMMM d, yyyy")}
        </p>
      )}
    </div>
  );
};
