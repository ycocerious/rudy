import { type monthDaysType, type weekDaysType } from "@/types/form-types";

export const areArraysEqual = (
  arr1: weekDaysType[] | monthDaysType[] | null | undefined,
  arr2: weekDaysType[] | monthDaysType[] | null | undefined,
): boolean => {
  if (arr1 === arr2) return true;
  if (arr1 == null || arr2 == null) return false;
  if (arr1.length !== arr2.length) return false;

  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  return sortedArr1.every((value, index) => value === sortedArr2[index]);
};
