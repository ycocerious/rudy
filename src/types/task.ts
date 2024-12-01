import {
  type dailyCountTotalType,
  type monthDaysType,
  type repeatFrequencyType,
  type taskCategoryType,
  type weekDaysType,
  type xValueType,
} from "./form-types";

export type Task = {
  id: number;
  name: string;
  category: taskCategoryType;
  currentStreak: number;
  highestStreak: number;

  dailyCountTotal: dailyCountTotalType;

  xValue?: xValueType;
  startDate?: Date;

  repeatFrequency?: repeatFrequencyType;

  weekDays?: weekDaysType[];
  monthDays?: number[];
};
