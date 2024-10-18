"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatePresence, motion } from "framer-motion"; // Import framer-motion for animations
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons
import { useState } from "react";
import { AppSidebar } from "../app-sidebar";
import { Grid } from "./grid";
import ScrollRightWrapper from "./scroll-right-wrapper";

export const TrackerCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Card className="mb-4 flex w-full min-w-[240px] flex-col rounded-md border-gray-700 bg-gray-800 md:max-w-[1106px]">
      <CardHeader className="relative flex flex-row items-center p-3">
        <div className="absolute left-3">
          <SidebarLayout defaultOpen={false} className="z-50">
            <AppSidebar />
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
              <SidebarTrigger />
            </main>
          </SidebarLayout>
        </div>

        <div className="flex flex-grow justify-center">
          <div className="flex items-center">
            <CardTitle
              className={`text-center text-lg ${
                isExpanded ? "text-gray-100" : "text-[#5ce1e6]"
              } sm:text-lg md:text-xl`}
              onClick={toggleExpand}
            >
              Tracker Card
            </CardTitle>
            {isExpanded ? (
              <ChevronUp
                className="h-[22px] w-[22px] pt-[2px] text-gray-400"
                onClick={toggleExpand}
              />
            ) : (
              <ChevronDown
                className="h-[22px] w-[22px] pt-[2px] text-[#5ce1e6]"
                onClick={toggleExpand}
              />
            )}
          </div>
        </div>
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
