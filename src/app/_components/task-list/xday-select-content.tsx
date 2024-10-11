import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { xValueEnum, xValueType } from "@/types/form-types";
import { addDays, format, startOfDay } from "date-fns";
import React, { useMemo, type Dispatch, type SetStateAction } from "react";

type XdaySelectContentProps = {
  newTaskXValue: xValueType | null;
  setNewTaskXValue: Dispatch<SetStateAction<xValueType | null>>;
  newTaskStartDate: Date | null;
  setNewTaskStartDate: Dispatch<SetStateAction<Date | null>>;
};

export const XdaySelectContent: React.FC<XdaySelectContentProps> = ({
  newTaskXValue,
  setNewTaskXValue,
  newTaskStartDate,
  setNewTaskStartDate,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const oneWeekFromToday = useMemo(() => addDays(today, 6), [today]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setNewTaskStartDate(date);
    }
  };

  const isDateDisabled = (date: Date) => {
    return date < today || date > oneWeekFromToday;
  };

  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          setNewTaskXValue(Number(value) as xValueType);
          // setNewTaskStartDate(null); // Reset start date when x-value changes
        }}
        value={newTaskXValue?.toString() ?? undefined}
      >
        <SelectTrigger className="w-full">
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

      {newTaskXValue !== null && (
        <div>
          <p className="ml-1 text-sm">Select start date:</p>
          <Calendar
            mode="single"
            selected={newTaskStartDate ?? undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
            className="custom-calendar"
          />
        </div>
      )}

      {newTaskXValue && newTaskStartDate && today <= newTaskStartDate && (
        <p className="ml-1 text-sm">
          Task will repeat every {newTaskXValue} days, starting from{" "}
          {format(newTaskStartDate, "MMMM d, yyyy")}
        </p>
      )}
    </div>
  );
};
