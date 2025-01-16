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

export function getTasksForToday(tasks: Task[]): Task[] {
  const today = new Date();
  // Convert and normalize the input date to IST
  const targetDate = convertToIST(today);

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

        // Convert both dates to IST for comparison
        const startDate = convertToIST(new Date(task.startDate));
        const normalizedTargetDate = convertToIST(targetDate);

        console.log("🔥 Start date (IST):", startDate.toISOString());
        console.log(
          "🔥 Target date (IST):",
          normalizedTargetDate.toISOString(),
        );

        if (normalizedTargetDate < startDate) return false;

        // Calculate difference in days in IST
        const diffTime = normalizedTargetDate.getTime() - startDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log("🔥 Diff days:", diffDays);
        console.log("🔥 X value:", task.xValue);
        console.log("🔥 Remainder:", diffDays % task.xValue);

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
