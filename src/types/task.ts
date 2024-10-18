import {
  type monthDaysType,
  type weekDaysType,
  type taskCategoryType,
  type xValueType,
  type repeatFrequencyType,
} from "./form-types";

export type Task = {
  id: string;
  name: string;
  category: taskCategoryType;

  xValue?: xValueType;
  startDate?: Date;

  repeatFrequency?: repeatFrequencyType;
  repeatDays?: weekDaysType[] | monthDaysType[];
};
