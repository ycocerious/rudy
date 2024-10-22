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
  type repeatFrequencyType,
  type monthDaysType,
} from "@/types/form-types";
import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type MonthlySelectContentProps = {
  newRepeatFrequency: repeatFrequencyType | null;
  newRepeatDays: monthDaysType[] | null;
  setNewRepeatFrequency: Dispatch<SetStateAction<repeatFrequencyType | null>>;
  setNewRepeatDays: Dispatch<SetStateAction<monthDaysType[] | null>>;
};

export const MonthlySelectContent: React.FC<MonthlySelectContentProps> = ({
  newRepeatFrequency,
  newRepeatDays,
  setNewRepeatFrequency,
  setNewRepeatDays,
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
    if (newRepeatFrequency === null) {
      setNewRepeatDays(null);
      setShowCustom(false);
    }
  }, [newRepeatFrequency, setNewRepeatDays]);

  const handleDaySelection = (day: monthDaysType) => {
    if (newRepeatFrequency === null) return;

    setNewRepeatDays((prev) => {
      if (prev === null) return [day];
      if (prev.includes(day)) return prev.filter((d) => d !== day);
      if (prev.length < newRepeatFrequency) return [...prev, day];
      return [...prev.slice(0, -1), day];
    });
  };

  return (
    <>
      <Select
        onValueChange={(value) => setNewRepeatFrequency(Number(value))}
        value={newRepeatFrequency?.toString() ?? undefined}
      >
        <SelectTrigger className="h-12 w-full text-white placeholder:text-gray-400">
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

      {newRepeatFrequency !== null && (
        <div className="mt-4">
          <p className="ml-1 text-white">
            Select {newRepeatFrequency} option
            {newRepeatFrequency > 1 ? "s" : ""}:
          </p>
          {initialOptions.map(([value, label]) => (
            <button
              key={value}
              onClick={() => handleDaySelection(value)}
              className={`m-1 rounded-lg border p-2 text-sm ${
                newRepeatDays?.includes(value) ? "bg-[#5ce1e6]" : "bg-white"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(!showCustom)}
            className={`m-1 rounded-lg border p-2 text-sm ${
              showCustom ? "bg-[#5ce1e6]" : "bg-white"
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
                      newRepeatDays?.includes(day as monthDaysType)
                        ? "bg-[#5ce1e6]"
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
