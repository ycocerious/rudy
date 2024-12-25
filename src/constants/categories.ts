import { Apple, Bed, Dumbbell } from "lucide-react";

export const TASK_CATEGORIES = {
  sleep: {
    label: "Sleep",
    icon: Bed,
  },
  exercise: {
    label: "Exercise",
    icon: Dumbbell,
  },
  nutrition: {
    label: "Nutrition",
    icon: Apple,
  },
} as const;

export type TaskCategory = keyof typeof TASK_CATEGORIES;
