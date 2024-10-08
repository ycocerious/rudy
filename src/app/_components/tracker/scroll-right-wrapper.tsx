"use client";

import { useRef, useEffect, useState } from "react";

export default function ScrollRightWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPercentage, setScrollPercentage] = useState(100);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft = container.scrollWidth;

      const handleScroll = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        const percentage = (container.scrollLeft / maxScroll) * 100;
        setScrollPercentage(percentage);
      };

      container.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial calculation

      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        ref={containerRef}
        className="hide-scrollbar custom-scrollbar h-full w-full overflow-x-auto"
      >
        <div className="pb-4">{children}</div>
      </div>
      <div className="custom:opacity-0 absolute bottom-0 left-0 right-0 h-1 bg-white/10 transition-opacity duration-300">
        <div
          className="absolute h-full bg-white/30 transition-all duration-300 ease-out"
          style={{
            width: "20%",
            left: `${Math.min(Math.max(scrollPercentage, 0), 80)}%`,
          }}
        />
      </div>
    </div>
  );
}
