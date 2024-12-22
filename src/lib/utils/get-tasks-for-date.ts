/* eslint-disable prefer-const */
import { weekDaysEnum } from "@/types/form-types";
import { type Task } from "@/types/task";

export function getTasksForDate(
  tasks: Task[],
  date: Date = new Date(),
): Task[] {
  // Normalize the input date to remove time components
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return tasks.filter((task) => {
    switch (task.frequency) {
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

        return task.monthDays.some((monthDay) => {
          // Special cases for weekend dates
          switch (monthDay) {
            case -1: // last date of month
              return targetDay === lastDateOfMonth;
            case -2: // first weekend
              return targetDay === getFirstWeekendDate();
            case -3: // last weekend
              return targetDay === getLastWeekendDate();
            default:
              // Regular days 1-31
              return targetDay === monthDay;
          }
        });

      default:
        return false;
    }
  });
}
