//category
export const taskCategoryEnum = [
  "daily",
  "xdays",
  "weekly",
  "monthly",
] as const;
export type taskCategoryType = (typeof taskCategoryEnum)[number];

//dailyCountTotal
export const dailyCountTotalEnum = [1, 2, 3, 4, 5] as const;
export type dailyCountTotalType = (typeof dailyCountTotalEnum)[number];

//dailyCountFinished
export const dailyCountFinishedEnum = [0, 1, 2, 3, 4, 5] as const;
export type dailyCountFinishedType = (typeof dailyCountFinishedEnum)[number];

//xValue
export const xValueEnum = [2, 3, 4, 5, 6] as const;
export type xValueType = (typeof xValueEnum)[number];

//repeat frequency
export const repeatFrequencyEnum = [1, 2, 3, 4, 5, 6];
export type repeatFrequencyType = (typeof repeatFrequencyEnum)[number];

//weekDays
export const weekDaysEnum = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
export type weekDaysType = (typeof weekDaysEnum)[number];

//monthDays
export const customMonthDayEnum = [
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "13th",
  "14th",
  "15th",
  "16th",
  "17th",
  "18th",
  "19th",
  "20th",
  "21st",
  "22nd",
  "23rd",
  "24th",
  "25th",
  "26th",
  "27th",
  "28th",
  "29th",
] as const;
export const allMonthDaysEnum = [
  ...customMonthDayEnum,
  "1st",
  "last-date",
  "1st-wknd",
  "last-wknd",
] as const;
export type monthDaysType = (typeof allMonthDaysEnum)[number];
