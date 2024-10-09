import { type Task } from "@/types/task";

export const exampleTasks: Task[] = [
  {
    id: "1",
    text: "Repeat",
    category: "monthly",
    repeatValue: "custom",
    customMonthDate: "21st",
  },
  {
    id: "2",
    text: "Repeatt",
    category: "monthly",
    repeatValue: "last weekend",
  },
  { id: "3", text: "Code", category: "weekly", repeatValue: "Monday" },
  { id: "4", text: "Codee", category: "weekly", repeatValue: "Sunday" },
  { id: "5", text: "Eat", category: "xdays", repeatValue: "3" },
  { id: "6", text: "Play", category: "daily" },
  { id: "7", text: "Playe", category: "daily" },
  { id: "8", text: "Playq", category: "daily" },
  { id: "9", text: "Playl", category: "daily" },
  { id: "10", text: "Playg", category: "daily" },
  { id: "11", text: "Playf", category: "daily" },
];
