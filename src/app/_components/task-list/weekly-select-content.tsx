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
  repeatFrequencyType,
  weekDaysEnum,
} from "@/types/form-types";
import React, { type Dispatch, type SetStateAction, useEffect } from "react";

type WeeklySelectContentProps = {
  newTaskRepeatFrequency: repeatFrequencyType | null;
  newTaskRepeatDays: weekDaysType[] | null;
  setNewTaskRepeatFrequency: Dispatch<
    SetStateAction<repeatFrequencyType | null>
  >;
  setNewTaskRepeatDays: Dispatch<SetStateAction<weekDaysType[] | null>>;
};

export const WeeklySelectContent: React.FC<WeeklySelectContentProps> = ({
  newTaskRepeatFrequency,
  newTaskRepeatDays,
  setNewTaskRepeatFrequency,
  setNewTaskRepeatDays,
}) => {
  useEffect(() => {
    if (newTaskRepeatFrequency === null) {
      setNewTaskRepeatDays(null);
    }
  }, [newTaskRepeatFrequency, setNewTaskRepeatDays]);

  const handleDaySelection = (day: weekDaysType) => {
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
          {repeatFrequencyEnum.map((freq) => (
            <SelectItem key={freq} value={freq.toString()}>
              {freq} time{freq > 1 ? "s" : ""} a week
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {newTaskRepeatFrequency !== null && (
        <div className="mt-4">
          <p className="ml-1">
            Select {newTaskRepeatFrequency} day
            {newTaskRepeatFrequency > 1 ? "s" : ""}:
          </p>
          <div className="flex flex-wrap">
            {weekDaysEnum.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelection(day)}
                className={`m-1 h-10 w-24 rounded-lg border text-sm ${
                  newTaskRepeatDays?.includes(day)
                    ? "bg-[#00a3a3] text-white"
                    : "bg-white"
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
