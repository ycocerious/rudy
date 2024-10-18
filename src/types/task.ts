import {
  type monthDaysType,
  type weekDaysType,
  type taskCategoryType,
  type xValueType,
  type repeatFrequencyType,
  type dailyCountTotalType,
  type dailyCountFinishedType,
} from "./form-types";

export type Task = {
  id: string;
  name: string;
  category: taskCategoryType;

  dailyCountTotal?: dailyCountTotalType;
  dailyCountFinished?: dailyCountFinishedType;

  xValue?: xValueType;
  startDate?: Date;

  repeatFrequency?: repeatFrequencyType;
  repeatDays?: weekDaysType[] | monthDaysType[];
};
