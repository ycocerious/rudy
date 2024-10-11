import { type Task } from "@/types/task";

export const exampleTasks: Task[] = [
  { id: "1", name: "Eat", category: "daily" },
  {
    id: "2",
    name: "Sleep",
    category: "xdays",
    xValue: 3,
    startDate: new Date(),
  },
  {
    id: "3",
    name: "Play",
    category: "weekly",
    repeatFrequency: 3,
    repeatDays: ["Monday", "Thursday", "Wednesday"],
  },
  {
    id: "4",
    name: "Repeat",
    category: "monthly",
    repeatFrequency: 2,
    repeatDays: ["1st", "last-date"],
  },
];
