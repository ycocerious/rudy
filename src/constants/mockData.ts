import { type Task } from "@/types/task";

export const exampleTasks: Task[] = [
  {
    id: "1",
    name: "Eatchanged",
    category: "daily",
    dailyCountTotal: 2,
    dailyCountFinished: 0,
  },
  {
    id: "2",
    name: "Play",
    category: "weekly",
    repeatFrequency: 3,
    repeatDays: ["Monday", "Thursday", "Wednesday"],
  },
  {
    id: "3",
    name: "Eat again",
    category: "daily",
    dailyCountTotal: 1,
    dailyCountFinished: 0,
  },
  {
    id: "4",
    name: "Eat once more",
    category: "daily",
    dailyCountTotal: 5,
    dailyCountFinished: 2,
  },
  {
    id: "5",
    name: "Eat - yeah",
    category: "daily",
    dailyCountTotal: 3,
    dailyCountFinished: 1,
  },
  {
    id: "6",
    name: "Sleep",
    category: "xdays",
    xValue: 3,
    startDate: new Date(),
  },
  {
    id: "7",
    name: "Play",
    category: "weekly",
    repeatFrequency: 3,
    repeatDays: ["Monday", "Thursday", "Wednesday"],
  },
  {
    id: "8",
    name: "Repeat",
    category: "monthly",
    repeatFrequency: 2,
    repeatDays: ["1st", "last-date"],
  },
];
