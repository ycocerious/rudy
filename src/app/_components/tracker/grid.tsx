"use client";

import { blueShades } from "@/constants/uiConstants";
import { api } from "@/trpc/react";
import { eachDayOfInterval, format, getDay, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useEffect, useMemo } from "react";

export const Grid = () => {
  const dates = useMemo(() => {
    const timeZone = "Asia/Kolkata";
    const now = new Date();
    const today = toZonedTime(startOfDay(now), timeZone);
    const endDate = today;

    const currentWeekSunday = startOfDay(
      toZonedTime(new Date(today), timeZone),
    );
    while (getDay(currentWeekSunday) !== 0) {
      currentWeekSunday.setDate(currentWeekSunday.getDate() - 1);
    }

    const startDate = new Date(currentWeekSunday);
    startDate.setDate(currentWeekSunday.getDate() - 53 * 7);

    console.log("🎯 Grid Dates:", { startDate, endDate });

    // Instead of converting to UTC string and back, just return the dates directly
    return { startDate, endDate };
  }, []);

  const { data: completionData } = api.consistency.getCompletionData.useQuery(
    {
      startDate: dates.startDate,
      endDate: dates.endDate,
    },
    {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    console.log("🎯 Grid Query Success:", {
      dataLength: completionData?.length,
      data: completionData,
    });
  }, [completionData]);

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
