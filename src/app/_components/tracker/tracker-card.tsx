"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion"; // Import framer-motion for animations
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons
import { useState } from "react";
import { Grid } from "./grid";
import ScrollRightWrapper from "./scroll-right-wrapper";

export const TrackerCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Card className="mb-4 flex w-full min-w-[240px] flex-col border-gray-700 bg-gray-800 md:max-w-[1106px]">
      <CardHeader className="relative flex cursor-pointer flex-row items-center justify-center p-4">
        <CardTitle
          className={`mr-2 text-center text-lg ${isExpanded ? "text-gray-100" : "text-[#5ce1e6]"} sm:text-xl md:text-2xl`}
          onClick={toggleExpand}
        >
          Tracker Card
        </CardTitle>
        {isExpanded ? (
          <ChevronUp className="text-gray-400" onClick={toggleExpand} />
        ) : (
          <ChevronDown className="text-[#5ce1e6]" onClick={toggleExpand} />
        )}
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <ScrollRightWrapper>
                <Grid />
              </ScrollRightWrapper>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
