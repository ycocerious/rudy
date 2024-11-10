/* eslint-disable prefer-const */
import { type DbTask } from "@/server/db/schema";
import { monthNumberToDaysMapping, weekDaysEnum } from "@/types/form-types";

export function getTasksForDate(
  tasks: DbTask[],
  date: Date = new Date(),
): DbTask[] {
  // Normalize the input date to remove time components
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return tasks.filter((task) => {
    switch (task.category) {
      case "daily":
        return true; // Daily tasks are always active

      case "xdays":
        if (!task.startDate || !task.xValue) return false;

        const startDate = new Date(task.startDate);
        const diffTime = Math.abs(targetDate.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Task is active if the number of days since start is divisible by xValue
        return diffDays % task.xValue === 0;

      case "weekly":
        if (!task.weekDays) return false;

        const weekDay =
          weekDaysEnum[targetDate.getDay() === 0 ? 6 : targetDate.getDay() - 1];
        return weekDay ? task.weekDays.includes(weekDay) : false;

      case "monthly":
        if (!task.monthDays) return false;

        const monthDays = task.monthDays.map(
          (d) => monthNumberToDaysMapping[d],
        );
        const targetDay = targetDate.getDate();
        const lastDateOfMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth() + 1,
          0,
        ).getDate();

        // Helper function to check if a date is a weekend
        const isWeekend = (date: Date) => {
          const day = date.getDay();
          return day === 0 || day === 6;
        };

        // Helper function to get the first weekend date of the month
        const getFirstWeekendDate = () => {
          let currentDate = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            1,
          );
          while (!isWeekend(currentDate)) {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return currentDate.getDate();
        };

        // Helper function to get the last weekend date of the month
        const getLastWeekendDate = () => {
          let currentDate = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth() + 1,
            0,
          );
          while (!isWeekend(currentDate)) {
            currentDate.setDate(currentDate.getDate() - 1);
          }
          return currentDate.getDate();
        };

        return monthDays.some((monthDay) => {
          // Handle numeric days (1st through 28th)
          if (
            monthDay?.endsWith("st") ||
            monthDay?.endsWith("nd") ||
            monthDay?.endsWith("rd") ||
            monthDay?.endsWith("th")
          ) {
            const dayNum = parseInt(monthDay);
            return targetDay === dayNum;
          }

          // Handle special cases
          switch (monthDay) {
            case "last-date":
              return targetDay === lastDateOfMonth;
            case "1st-wknd":
              return targetDay === getFirstWeekendDate();
            case "last-wknd":
              return targetDay === getLastWeekendDate();
            default:
              return false;
          }
        });

      default:
        return false;
    }
  });
}
