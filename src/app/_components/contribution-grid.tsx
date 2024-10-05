import { generateMockData } from "@/lib/utils/generate-mock-data";
import { getColor } from "@/lib/utils/getColor";

const contributionData = generateMockData();

export const ContributionGrid = () => {
  const weekIndexes = Array.from({ length: 53 }, (_, i) => i + 1);

  const today = new Date();
  const dayOfWeek = today.getDay();

  return (
    <div className="flex gap-1">
      {/* each week has one div */}
      {weekIndexes.map((_, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-1">
          {/* each box is one div */}
          {contributionData.map((row, rowIndex) => {
            // Only render boxes for the current week up to the current day
            if (weekIndex === 52 && rowIndex > dayOfWeek) {
              return null;
            }

            return (
              <div
                key={`${weekIndex}-${rowIndex}`}
                className={`h-[0.85rem] w-[0.85rem] rounded-[2px] sm:h-[0.9rem] sm:w-[0.9rem] sm:rounded-[2px] md:h-4 md:w-4 md:rounded-[3px]`}
                style={{ backgroundColor: getColor(row[weekIndex] ?? -1) }}
                title={`Week ${weekIndex + 1}, Day ${rowIndex + 1}: ${
                  row[weekIndex] === -1
                    ? "No data"
                    : row[weekIndex] === 0
                      ? "Neutral day"
                      : `${(row[weekIndex] ?? 0) * 20}% completed`
                }`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};