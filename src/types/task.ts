import {
  type taskCategoryType,
  type taskFrequencyType,
  type weekDaysType,
} from "./form-types";

export type Task = {
  id: number;
  name: string;
  frequency: taskFrequencyType;
  category: taskCategoryType;

  dailyCountTotal: number;
  dailyCountFinished: number;

  xValue: number | null;
  startDate: Date | null;

  weekDays: weekDaysType[] | null;
  monthDays: number[] | null;
};
