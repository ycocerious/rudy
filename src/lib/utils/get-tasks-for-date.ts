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
  // Get current time in IST
  const today = new Date();

  // Convert to IST string with explicit timezone info
  const istString = today.toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Parse the string parts manually to ensure correct timezone
  const [datePart, timePart] = istString.split(", ");
  const [month, day, year] = datePart!.split("/");
  const [hours, minutes, seconds] = timePart!.split(":");

  // Create date using UTC to preserve the time
  const istDate = new Date(
    Date.UTC(
      Number(year),
      Number(month) - 1, // months are 0-based
      Number(day),
      Number(hours),
      Number(minutes),
      Number(seconds),
    ),
  );

  console.log("🔥 Raw today:", today.toISOString());
  console.log("🔥 IST string:", istString);
  console.log("🔥 IST Date:", istDate.toISOString());

  // Now normalize this IST date
  const targetDate = convertToIST(istDate);

  console.log("🔥 Final target date is:", targetDate.toISOString());

  return tasks.filter((task) => {
    switch (task.frequency) {
      case "daily":
        return true;

      case "xdays":
        if (!task.startDate || !task.xValue) return false;

        const startDate = convertToIST(new Date(task.startDate));
        if (targetDate < startDate) return false;

        const diffTime = Math.abs(targetDate.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        console.log("🔥 For task:", task.name);
        console.log("🔥 Start date:", startDate.toISOString());
        console.log("🔥 Target date:", targetDate.toISOString());
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
