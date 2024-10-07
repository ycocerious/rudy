"use client";

import { useRef, useEffect } from "react";

export default function ScrollRightWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="hide-scrollbar h-full w-full overflow-x-auto"
    >
      {children}
    </div>
  );
}
