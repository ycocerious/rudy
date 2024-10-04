import { generateMockData } from "@/lib/utils/generate-mock-data";
import { getColor } from "@/lib/utils/getColor";

const contributionData = generateMockData();

export const ContributionGrid = () => {
  return (
    <div className="flex justify-center">
      <div className="flex gap-1" style={{ minWidth: "max-content" }}>
        {contributionData[0]!.map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {contributionData.map((week, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="h-[0.85rem] w-[0.85rem] rounded-[2px] sm:h-[0.9rem] sm:w-[0.9rem] sm:rounded-[2px] md:h-4 md:w-4 md:rounded-[3px]"
                style={{ backgroundColor: getColor(week[weekIndex] ?? -1) }}
                title={`Week ${weekIndex + 1}, Day ${dayIndex + 1}: ${
                  week[weekIndex] === -1
                    ? "No data"
                    : week[weekIndex] === 0
                      ? "Neutral day"
                      : `${(week[weekIndex] ?? 0) * 20}% completed`
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
