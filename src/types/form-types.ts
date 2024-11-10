import { z } from "zod";

//category
export const taskCategoryEnum = [
  "daily",
  "xdays",
  "weekly",
  "monthly",
] as const;
export const taskCategoryZodEnum = z.enum(taskCategoryEnum);
export type taskCategoryType = (typeof taskCategoryEnum)[number];

//dailyCountTotal
export const dailyCountTotalEnum = [1, 2, 3, 4, 5] as const;
export type dailyCountTotalType = (typeof dailyCountTotalEnum)[number];

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
export const weekDaysZodEnum = z.enum(weekDaysEnum);
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
] as const;
export const allMonthDaysEnum = [
  ...customMonthDayEnum,
  "1st",
  "last-date",
  "1st-wknd",
  "last-wknd",
] as const;
export type monthDaysType = (typeof allMonthDaysEnum)[number];

export const monthDaysToNumberMapping: Record<monthDaysType, number> = {
  "1st": 1,
  "2nd": 2,
  "3rd": 3,
  "4th": 4,
  "5th": 5,
  "6th": 6,
  "7th": 7,
  "8th": 8,
  "9th": 9,
  "10th": 10,
  "11th": 11,
  "12th": 12,
  "13th": 13,
  "14th": 14,
  "15th": 15,
  "16th": 16,
  "17th": 17,
  "18th": 18,
  "19th": 19,
  "20th": 20,
  "21st": 21,
  "22nd": 22,
  "23rd": 23,
  "24th": 24,
  "25th": 25,
  "26th": 26,
  "27th": 27,
  "28th": 28,
  "1st-wknd": -1,
  "last-date": -2,
  "last-wknd": -3,
};

export const monthNumberToDaysMapping: Record<number, monthDaysType> =
  Object.fromEntries(
    Object.entries(monthDaysToNumberMapping).map(([key, value]) => [
      value,
      key,
    ]),
  ) as Record<number, monthDaysType>;
