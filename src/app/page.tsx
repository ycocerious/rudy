"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useEffect } from "react";

import "@/styles/globals.css";

const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    const week = [];
    for (let j = 0; j < 52; j++) {
      if (j < 26) {
        week.push(-1); // Indicate no data for first 6 months
      } else {
        week.push(Math.floor(Math.random() * 6)); // 0-5 for variety
      }
    }
    data.push(week);
  }
  return data;
};

const contributionData = generateMockData();

const neutralColor = "#1e3a5f"; // Neutral color for empty boxes and some latter months

const blueShades = [
  neutralColor,
  "#A3E4F8", // Light blue
  "#5ce1e6", // Your preferred blue (middle shade)
  "#33D6DD", // Brighter blue
  "#00CCD6", // Brightest blue
  "#00A3A3", // Darkest blue
];

const ContributionGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, []);

  const getColor = (value: number) => {
    if (value === -1) return blueShades[0]; // Neutral color for no data
    if (value === 0) return neutralColor; // Mix neutral color in latter months
    return blueShades[value]; // Use the blue shades
  };

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-full w-full overflow-x-auto"
    >
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

export default function ContributionTracker() {
  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <Card className="flex w-full flex-col border-gray-700 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-center text-lg text-gray-100 sm:text-xl md:text-2xl">
            Contribution Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContributionGrid />
        </CardContent>
      </Card>
    </div>
  );
}
