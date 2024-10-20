"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "./grid";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "./loading-spinner";

const ScrollRightWrapper = dynamic(() => import("./scroll-right-wrapper"), {
  ssr: false,
  loading: LoadingSpinner,
});

export const ConsistencyTracker = () => {
  return (
    <Card className="mb-4 flex w-full min-w-[240px] flex-col border-gray-700 bg-gray-800 md:max-w-[1106px]">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold text-gray-100 sm:text-xl md:text-2xl">
          Consistency Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollRightWrapper>
          <Grid />
        </ScrollRightWrapper>
      </CardContent>
    </Card>
  );
};
