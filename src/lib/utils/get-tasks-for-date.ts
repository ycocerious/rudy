import { weekDaysEnum } from "@/types/form-types";
import { type Task } from "@/types/task";

// Helper function to convert date to IST
export function convertToIST(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      5, // IST offset hours
      30, // IST offset minutes
      0,
      0,
    ),
  );
}

// Helper function to normalize date to start of day in IST
function normalizeToISTDate(date: Date): Date {
  const istDate = convertToIST(date);
  return new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    istDate.getDate(),
    0,
    0,
    0,
    0,
  );
}

export function getTasksForToday(tasks: Task[]): Task[] {
  const today = new Date();
  // Convert and normalize the input date to IST
  const targetDate = normalizeToISTDate(today);

  console.log(
    "🎯 Target Date (IST):",
    targetDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  );

  return tasks.filter((task) => {
    switch (task.frequency) {
      case "daily":
        return true;

      case "xdays":
        if (!task.startDate || !task.xValue) return false;

        const startDate = normalizeToISTDate(new Date(task.startDate));
        if (targetDate < startDate) return false;

        const diffTime = Math.abs(targetDate.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays % task.xValue === 0;

      case "weekly":
        if (!task.weekDays) return false;

        // Get IST day of week
        const istDay = targetDate.getDay();
        const weekDay = weekDaysEnum[istDay === 0 ? 6 : istDay - 1];
        return weekDay ? task.weekDays.includes(weekDay) : false;

      case "monthly":
        if (!task.monthDays) return false;
        const targetDay = targetDate.getDate();
        return task.monthDays.includes(targetDay);

      default:
        return false;
    }
  });
}
