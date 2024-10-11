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
  repeatFrequencyType,
  type monthDaysType,
} from "@/types/form-types";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type MonthlySelectContentProps = {
  newTaskRepeatFrequency: repeatFrequencyType | null;
  newTaskRepeatDays: monthDaysType[] | null;
  setNewTaskRepeatFrequency: Dispatch<
    SetStateAction<repeatFrequencyType | null>
  >;
  setNewTaskRepeatDays: Dispatch<SetStateAction<monthDaysType[] | null>>;
};

export const MonthlySelectContent: React.FC<MonthlySelectContentProps> = ({
  newTaskRepeatFrequency,
  newTaskRepeatDays,
  setNewTaskRepeatFrequency,
  setNewTaskRepeatDays,
}) => {
  const [showCustom, setShowCustom] = useState(false);

  const frequencyOptions: repeatFrequencyType[] = repeatFrequencyEnum;
  const initialOptions: [monthDaysType, string][] = [
    ["1st", "First of every month"],
    ["last-date", "Last of every month"],
    ["1st-wknd", "First weekend of the month"],
    ["last-wknd", "Last weekend of the month"],
  ];

  useEffect(() => {
    if (newTaskRepeatFrequency === null) {
      setNewTaskRepeatDays(null);
      setShowCustom(false);
    }
  }, [newTaskRepeatFrequency, setNewTaskRepeatDays]);

  const handleDaySelection = (day: monthDaysType) => {
    if (newTaskRepeatFrequency === null) return;

    setNewTaskRepeatDays((prev) => {
      if (prev === null) return [day];
      if (prev.includes(day)) return prev.filter((d) => d !== day);
      if (prev.length < newTaskRepeatFrequency) return [...prev, day];
      return prev;
    });
  };

  return (
    <>
      <Select
        onValueChange={(value) => setNewTaskRepeatFrequency(Number(value))}
        value={newTaskRepeatFrequency?.toString() ?? undefined}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select repetition frequency" />
        </SelectTrigger>
        <SelectContent>
          {frequencyOptions.map((freq) => (
            <SelectItem key={freq} value={freq.toString()}>
              {freq} time{freq > 1 ? "s" : ""} a month
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {newTaskRepeatFrequency !== null && (
        <div className="mt-4">
          <p className="ml-1">
            Select {newTaskRepeatFrequency} option
            {newTaskRepeatFrequency > 1 ? "s" : ""}:
          </p>
          {initialOptions.map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleDaySelection(value)}
              className={`m-1 rounded-lg border p-2 text-sm ${
                newTaskRepeatDays?.includes(value)
                  ? "bg-[#00a3a3] text-white"
                  : "bg-white"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`m-1 rounded-lg border p-2 text-sm ${
              showCustom ? "bg-[#00a3a3] text-white" : "bg-white"
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
                    key={day}
                    onClick={() => handleDaySelection(day as monthDaysType)}
                    className={`m-1 h-9 w-9 rounded-lg border ${
                      newTaskRepeatDays?.includes(day as monthDaysType)
                        ? "bg-[#00a3a3] text-white"
                        : "bg-white"
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
    </>
  );
};
