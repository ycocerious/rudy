import { weekDaysEnum } from "@/types/form-types";
import { type Task } from "@/types/task";

export function getTasksForToday(tasks: Task[], todayString: string): Task[] {
  const todayDate = new Date(todayString);

  return tasks.filter((task) => {
    switch (task.frequency) {
      case "daily":
        return true;

      case "xdays":
        if (!task.startDate || !task.xValue) return false;

        const startDate = new Date(task.startDate);
        if (todayDate < startDate) return false;

        const diffTime = Math.abs(todayDate.getTime() - startDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays % task.xValue === 0;

      case "weekly":
        if (!task.weekDays) return false;

        // Get day of week
        const day = todayDate.getDay();
        const weekDay = weekDaysEnum[day === 0 ? 6 : day - 1];
        return weekDay ? task.weekDays.includes(weekDay) : false;

      case "monthly":
        if (!task.monthDays) return false;
        const targetDay = todayDate.getDate();
        return task.monthDays.includes(targetDay);

      default:
        return false;
    }
  });
}
