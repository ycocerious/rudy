import { getDay, startOfDay } from "date-fns";
import { useMemo } from "react";

export const useStartAndEndDate = () => {
  return useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const currentWeekSunday = new Date(today);
    while (getDay(currentWeekSunday) !== 0) {
      currentWeekSunday.setDate(currentWeekSunday.getDate() - 1);
    }
    const startDate = new Date(currentWeekSunday);
    startDate.setDate(currentWeekSunday.getDate() - 53 * 7);

    const endDate = today;

    console.log("🎯 Grid Dates:", { startDate, endDate });

    return { startDate, endDate };
  }, []); // Empty dependency array since we don't depend on any external values
};
