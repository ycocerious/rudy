import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type weekDaysType,
  repeatFrequencyEnum,
  type repeatFrequencyType,
  weekDaysEnum,
} from "@/types/form-types";
import React, { type Dispatch, type SetStateAction, useEffect } from "react";

type WeeklySelectContentProps = {
  newRepeatFrequency: repeatFrequencyType | null;
  newRepeatDays: weekDaysType[] | null;
  setNewRepeatFrequency: Dispatch<SetStateAction<repeatFrequencyType | null>>;
  setNewRepeatDays: Dispatch<SetStateAction<weekDaysType[] | null>>;
};

export const WeeklySelectContent: React.FC<WeeklySelectContentProps> = ({
  newRepeatFrequency,
  newRepeatDays,
  setNewRepeatFrequency,
  setNewRepeatDays,
}) => {
  useEffect(() => {
    if (newRepeatFrequency === null) {
      setNewRepeatDays(null);
    }
  }, [newRepeatFrequency, setNewRepeatDays]);

  const handleDaySelection = (day: weekDaysType) => {
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
        <SelectTrigger className="h-12 w-full text-foreground">
          <SelectValue placeholder="Select repetition frequency" />
        </SelectTrigger>
        <SelectContent>
          {repeatFrequencyEnum.map((freq) => (
            <SelectItem key={freq} value={freq.toString()}>
              {freq} time{freq > 1 ? "s" : ""} a week
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {newRepeatFrequency !== null && (
        <div className="mt-4">
          <p className="ml-1 text-foreground">
            Select {newRepeatFrequency} day
            {newRepeatFrequency > 1 ? "s" : ""}:
          </p>
          <div className="flex flex-wrap">
            {weekDaysEnum.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelection(day)}
                className={`m-1 h-10 w-24 rounded-lg border text-sm text-primary-foreground ${
                  newRepeatDays?.includes(day) ? "bg-primary" : "bg-foreground"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
