import { blueShades } from "@/constants/uiConstants";

export const getColor = (value: number) => {
  if (value === -1 || value === 0) return blueShades[0];
  return blueShades[value];
};
