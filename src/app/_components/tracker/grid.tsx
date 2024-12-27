"use client";

import { blueShades } from "@/constants/uiConstants";
import { api } from "@/trpc/react";
import { eachDayOfInterval, format, getDay, startOfDay } from "date-fns";
import { useMemo } from "react";

export const Grid = () => {
  const dates = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const endDate = today;
    const currentWeekSunday = startOfDay(new Date(today));
    while (getDay(currentWeekSunday) !== 0) {
      currentWeekSunday.setDate(currentWeekSunday.getDate() - 1);
    }
    const startDate = new Date(currentWeekSunday);
    startDate.setDate(currentWeekSunday.getDate() - 53 * 7);
    return { startDate, endDate };
  }, []);

  const { data: completionData } = api.consistency.getCompletionData.useQuery({
    startDate: dates.startDate,
    endDate: dates.endDate,
  });

  const contributionData = useMemo(() => {
    const data = Array.from({ length: 7 }, () =>
      Array.from({ length: 54 }, () => 0),
    );

    if (!completionData) return data;

    const completionMap = new Map(
      completionData.map((d) => [
        format(d.completionDate, "yyyy-MM-dd"),
        d.completionPercentage,
      ]),
    );

    eachDayOfInterval({ start: dates.startDate, end: dates.endDate }).forEach(
      (date) => {
        const dayOfWeek = getDay(date);
        const week = Math.floor(
          (date.getTime() - dates.startDate.getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        );

        if (week < 54 && dayOfWeek < 7) {
          const percentage = completionMap.get(format(date, "yyyy-MM-dd")) ?? 0;
          const shadeIndex =
            percentage === 0
              ? 0
              : percentage <= 25
                ? 1
                : percentage <= 50
                  ? 2
                  : percentage <= 75
                    ? 3
                    : 4;
          data[dayOfWeek]![week] = shadeIndex;
        }
      },
    );
    return data;
  }, [completionData, dates.startDate, dates.endDate]);

  const weekIndexes = Array.from({ length: 54 }, (_, i) => i);
  const today = new Date();
  const dayOfWeek = today.getDay();

  return (
    <div className="flex gap-1">
      {weekIndexes.map((weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {contributionData.map((row, rowIndex) => {
            if (weekIndex === 53 && rowIndex > dayOfWeek) {
              return null;
            }
            const boxColour = blueShades[row[weekIndex] ?? 0];
            return (
              <div
                key={`${weekIndex}-${rowIndex}`}
                className="h-[0.85rem] w-[0.85rem] rounded-[2px]"
                style={{ backgroundColor: boxColour }}
                title={`Week ${weekIndex + 1}, Day ${rowIndex + 1}: ${
                  (row[weekIndex] ?? 0) * 25
                }% completed`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;
