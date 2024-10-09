import { type CategoryDisplayTextType } from "@/types/repeat-option-type";
import { type taskCateogry } from "@/types/task-category";

export const categoryDisplayText = {
  daily: "Repeat daily",
  monthly: "Repeat monthly",
  weekly: "Repeat weekly",
  xdays: "Repeat x days once",
} satisfies Record<taskCateogry, CategoryDisplayTextType>;
