export const taskFrequencyEnum = [
  "daily",
  "xdays",
  "weekly",
  "monthly",
] as const;
export type taskFrequencyType = (typeof taskFrequencyEnum)[number];

export const taskCategoryEnum = ["sleep", "nutrition", "exercise"] as const;
export type taskCategoryType = (typeof taskCategoryEnum)[number];

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
