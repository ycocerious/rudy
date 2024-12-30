"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function DotMatrix() {
  // Create a 20x20 grid of dots
  const dots = Array.from({ length: 40 * 40 });

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] gap-8">
          {dots.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{
                delay: Math.random() * 0.5,
                duration: 0.5,
                type: "spring",
              }}
              className={cn(
                "h-1 w-1 rounded-full bg-white/60",
                // Randomly hide some dots on mobile
                "sm:block",
                Math.random() > 0.7 ? "hidden" : "block",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
