import { type taskCateogry } from "./task-category";

export type Task = {
  id: string;
  text: string;
  category: taskCateogry;
  repeatValue?: string;
  startDate?: Date;
  customMonthDate?: string;
};
