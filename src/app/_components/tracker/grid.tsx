"use client";

import { blueShades } from "@/constants/uiConstants";
import { api } from "@/trpc/react";
import { eachDayOfInterval, format, getDay, startOfDay } from "date-fns";
import { useEffect, useMemo } from "react";

export const Grid = () => {
  const dates = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const endDate = today;

    // Calculate the start of the current week (Sunday)
    const currentWeekSunday = startOfDay(new Date(today));
    while (getDay(currentWeekSunday) !== 0) {
      currentWeekSunday.setDate(currentWeekSunday.getDate() - 1);
    }

    // Go back 53 weeks from the current Sunday
    const startDate = new Date(currentWeekSunday);
    startDate.setDate(currentWeekSunday.getDate() - 53 * 7);

    return { startDate, endDate };
  }, []);

  const { data: completionData } = api.consistency.getCompletionData.useQuery({
    startDate: dates.startDate,
    endDate: dates.endDate,
  });

  //log out the completion data
  console.log("✅Completion data in grid component: ", completionData);

  useEffect(() => {
    if (completionData) {
      console.log("Completion data updated:", completionData);
    }
  }, [completionData]);

  const gridData = useMemo(() => {
    const data: number[][] = Array.from({ length: 7 }, () =>
      Array.from({ length: 54 }, () => -1),
    );

    if (!completionData) return data;

    const completionMap = new Map(
      completionData?.map((d) => [
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

        if (week < 54 && dayOfWeek < 7) {
          data[dayOfWeek]![week] = shadeIndex;
        }
      },
    );

    return data;
  }, [completionData, dates.startDate, dates.endDate]);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 54 }, (_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {Array.from({ length: 7 }, (_, dayIndex) => {
            // Don't render if value is -1 (no box)
            if (gridData[dayIndex]![weekIndex] === -1) return null;

            const boxColour = blueShades[gridData[dayIndex]![weekIndex] ?? 0];
            const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
              dayIndex
            ];

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`h-[0.85rem] w-[0.85rem] rounded-[2px]`}
                style={{ backgroundColor: boxColour }}
                title={`${dayName}, Week ${weekIndex + 1}: ${
                  (gridData[dayIndex]![weekIndex] ?? 0) * 25
                }% completed`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
